import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  getCommentsByTicketId: publicProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ input, ctx }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          ticketId: input.ticketId,
        },
      });

      const sortedComments = comments.sort((a, b) => (a < b ? 1 : -1));
      return sortedComments;
    }),

  createCommentTechnician: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        attachment: z.string().nullable().optional(),
        isDone: z.boolean().optional(),
        type: z.enum(["QUESTION", "NEEDFOLLOWUP", "SOLVE"]).default("SOLVE"),
        ticketId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          ...input,
          isTechnicianReply: true,
        },
      });

      if (!comment) return null;

      const ticket = await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          lastTechnicianUpdateComment: new Date(),
        },
      });

      if (!ticket) return null;

      // TODO: TEMPLATE BY STATUS: SOLVING ATAU FOLLOWUP
      // await sendReplyEmail(
      //   ticket.email,
      //   ticket.name || "",
      //   ticket.id,
      //   input.description
      // );

      return comment;
    }),

  updateCommentTechnician: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
        title: z.string(),
        description: z.string(),
        attachment: z.string().nullable().optional(),
        isDone: z.boolean().optional(),
        type: z.enum(["QUESTION", "NEEDFOLLOWUP", "SOLVE"]).default("SOLVE"),
        ticketId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          title: input.title,
          description: input.description,
          attachment: input.attachment,
          isDone: input.isDone,
          doneAt: input.isDone ? new Date() : null,
          type: input.type,
          isTechnicianReply: true,
        },
      });

      if (!comment) return null;

      const ticket = await ctx.prisma.ticket.update({
        where: {
          id: comment.ticketId,
        },
        data: {
          lastTechnicianUpdateComment: new Date(),
        },
      });

      if (!ticket) return null;

      return comment;
    }),
});
