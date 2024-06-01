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

      const sortedComments = comments.sort((a, b) => (a.id < b.id ? 1 : -1));
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
        },
      });

      if (!comment) return null;

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
          type: input.type,
        },
      });

      if (!comment) return null;

      return comment;
    }),
});
