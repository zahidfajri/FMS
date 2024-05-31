import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  sendCreateTicketEmail,
  sendReceiveTicketEmail,
  sendSolveTicketEmail,
} from "../utils/templateEmailHtml";
import { startDayOfDate } from "~/utils/date";

export const ticketRouter = createTRPCRouter({
  getAllTicket: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.findMany();
  }),

  getUnassignedTicket: protectedProcedure.query(async ({ ctx }) => {
    const uanssignedTicket = await ctx.prisma.ticket.findMany({
      where: {
        departmentId: null,
      },
    });

    const sortedTickets = uanssignedTicket
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .sort((a) =>
        startDayOfDate(a.lastTechnicianUpdateComment) ===
        startDayOfDate(new Date())
          ? 1
          : -1
      );

    return sortedTickets;
  }),

  getActiveTicketsByDepartment: protectedProcedure
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const activeTickets = await ctx.prisma.ticket.findMany({
        where: {
          isSolved: false,
          departmentId: input.departmentId,
        },
      });

      const sortedTickets = activeTickets
        .sort((a, b) => (a.id < b.id ? 1 : -1))
        .sort((a) =>
          startDayOfDate(a.lastTechnicianUpdateComment) ===
          startDayOfDate(new Date())
            ? 1
            : -1
        );
      // sort by when today is not the day of lastTechnicianUpdate

      return sortedTickets;
    }),

  getTicketByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.ticket.findFirstOrThrow({
        where: {
          code: input.code,
        },
      });
    }),

  getNextActiveTicketByCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
        departmentId: z.number().optional().nullable(),
      })
    )
    .query(async ({ input, ctx }) => {
      const initialId = Number(input.code);
      const nextActiveTicket = await ctx.prisma.ticket.findFirst({
        where: {
          id: {
            gte: initialId + 1,
          },
          departmentId: input.departmentId ? input.departmentId : undefined,
        },
      });

      if (!nextActiveTicket) return null;

      return nextActiveTicket;
    }),

  getCountTicketByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const count = await ctx.prisma.ticket.count({
        where: {
          userId: input.userId,
          isSolved: false,
        },
      });

      return count;
    }),

  createTicket: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(3),
        title: z.string(),
        subtitle: z.string(),
        attachment: z.string().nullable().optional(),
        type: z
          .enum(["INQUIRY", "COMPLAINT", "SUGGESTION", "COMPLIMENT"])
          .nullable(),
        departmentId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const now = new Date();
      const yearCode = now.getFullYear().toString().slice(2);
      const monthCode = String(now.getMonth() + 1).padStart(2, "0");
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      const ticketCount = await ctx.prisma.ticket.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const sequence = String(ticketCount + 1).padStart(3, "0");
      const code = `${yearCode}${monthCode}${sequence}`;

      let userId: string | null = null;
      let email: string | null = null;
      if (input.departmentId) {
        const department = await ctx.prisma.department.findFirst({
          where: {
            id: input.departmentId,
          },
        });
        if (department && department.emailPic) {
          const user = await ctx.prisma.user.findFirst({
            where: {
              email: department.emailPic,
            },
          });
          if (user) {
            userId = user.id;
            email = user.email;
          }
        }
      }

      const ticket = await ctx.prisma.ticket.create({
        data: {
          ...input,
          code,
          userId,
        },
      });

      if (ticket.email && Boolean(ticket.departmentId)) {
        await sendCreateTicketEmail(
          ticket.email,
          ticket.name || "",
          ticket.code
        );
      }
      if (email) await sendReceiveTicketEmail(ticket.email, ticket.code);
      return ticket;
    }),

  updateTicketType: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
        type: z.enum(["INQUIRY", "COMPLAINT", "SUGGESTION", "COMPLIMENT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          type: input.type,
        },
      });
    }),

  updateTicketStatus: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
        isSolved: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          isSolved: input.isSolved,
        },
      });
      if (!ticket) return null;

      if (input.isSolved) {
        await sendSolveTicketEmail(ticket.email, ticket.name || "", ticket.id);
      }

      return ticket;
    }),

  updateTicketDepartment: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
        departmentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findFirst({
        where: {
          id: input.ticketId,
        },
      });
      if (!ticket || ticket.departmentId === input.departmentId) return null;

      if (ticket.departmentId === null) {
        const departmentDestination = await ctx.prisma.department.findFirst({
          where: {
            id: input.departmentId,
          },
        });
        if (!departmentDestination) return null;

        const comment = await ctx.prisma.comment.create({
          data: {
            title: `Assigned to Department ${departmentDestination.name}`,
            ticketId: ticket.id,
            attachment: undefined,
            type: "SOLVE",
            isDone: true,
          },
        });
        if (!comment) return null;

        await sendCreateTicketEmail(ticket.email, ticket.name || "", ticket.id);

        return await ctx.prisma.ticket.update({
          where: {
            id: input.ticketId,
          },
          data: {
            departmentId: input.departmentId,
          },
        });
      } else {
        const departmentSource = await ctx.prisma.department.findFirst({
          where: {
            id: ticket.departmentId,
          },
        });
        if (!departmentSource) return null;

        const departmentDestination = await ctx.prisma.department.findFirst({
          where: {
            id: input.departmentId,
          },
        });
        if (!departmentDestination) return null;

        const comment = await ctx.prisma.comment.create({
          data: {
            description: `from department ${departmentSource.name}`,
            title: `Move to Department ${departmentDestination.name}`,
            ticketId: ticket.id,
            attachment: undefined,
            type: "SOLVE",
            isDone: true,
          },
        });
        if (!comment) return null;

        return await ctx.prisma.ticket.update({
          where: {
            id: input.ticketId,
          },
          data: {
            departmentId: input.departmentId,
          },
        });
      }
    }),

  bulkAssignTicket: publicProcedure
    .input(
      z.object({
        ticketIds: z.array(z.number()),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      for (const ticketId of input.ticketIds) {
        const ticket = await ctx.prisma.ticket.update({
          where: {
            id: ticketId,
          },
          data: {
            userId: input.userId,
          },
        });
        if (!ticket) throw new Error("Ticket doesn't exist");
      }
      return true;
    }),
});
