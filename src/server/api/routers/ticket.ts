import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  sendBulkAssignTicketEmail,
  sendCreateTicketEmail,
  sendReceiveTicketEmail,
  sendSolveTicketEmail,
  sendUnassignedTicketEmail,
} from "../utils/templateEmailHtml";

export const ticketRouter = createTRPCRouter({
  getAllTicket: protectedProcedure
    .input(
      z.object({
        isSolvedOnly: z.boolean().optional().default(true),
        limit: z.number().optional().default(5),
        page: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          isSolved: input.isSolvedOnly ? true : undefined,
        },
        take: input.limit,
        skip: input.page * input.limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          department: true,
        },
      });
    }),

  getCountAllTicket: protectedProcedure
    .input(
      z.object({
        isSolvedOnly: z.boolean().optional().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.ticket.count({
        where: {
          isSolved: input.isSolvedOnly ? true : undefined,
        },
      });
    }),

  getUnassignedTicket: protectedProcedure.query(async ({ ctx }) => {
    const uanssignedTicket = await ctx.prisma.ticket.findMany({
      where: {
        departmentId: null,
      },
    });

    const sortedTickets = uanssignedTicket.sort((a, b) =>
      a.id < b.id ? 1 : -1
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

      const sortedTickets = activeTickets.sort((a, b) =>
        a.id < b.id ? 1 : -1
      );

      return sortedTickets;
    }),

  getTicketByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.ticket.findFirstOrThrow({
        where: {
          code: input.code,
        },
        include: {
          technician: true
        }
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

  getTicketsByDepartmentId: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
        monthCode: z.string().max(2),
        yearCode: z.string().max(2),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          departmentId: input.departmentId,
          code: {
            startsWith: `${input.yearCode}${input.monthCode}`,
          },
        },
      });
    }),

  getActiveTicketsByTechnicianId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          userId: input.userId,
          isSolved: false,
        },
      });

      return tickets;
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

      // Find the highest sequence number for the current month and year
      const highestTicket = await ctx.prisma.ticket.findFirst({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          code: {
            startsWith: `${yearCode}${monthCode}`,
          },
        },
        orderBy: {
          code: "desc",
        },
      });

      let sequence = 1;
      if (highestTicket) {
        const highestSequence = parseInt(highestTicket.code.slice(-3), 10);
        sequence = highestSequence + 1;
      }

      const code = `${yearCode}${monthCode}${String(sequence).padStart(
        3,
        "0"
      )}`;

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

      if (ticket.email) {
        await sendCreateTicketEmail(
          ticket.email,
          ticket.name || "",
          ticket.code
        );
      }
      if (email) {
        await sendReceiveTicketEmail(ticket.email, ticket.code);
      } else {
        const admin = await ctx.prisma.user.findMany({
          where: {
            role: "ADMIN",
          },
        });
        if (admin && admin.length > 0 && admin[0]?.email) {
          sendUnassignedTicketEmail(admin[0]?.email, ticket.code);
        }
      }
      return ticket;
    }),

  updateTicketType: protectedProcedure
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

  updateTicketStatus: protectedProcedure
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
          solvedAt: new Date(),
        },
      });
      if (!ticket) return null;

      if (input.isSolved) {
        await sendSolveTicketEmail(
          ticket.email,
          ticket.name || "",
          ticket.code
        );
      }

      return ticket;
    }),

  updateTicketDepartment: protectedProcedure
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
            title: `Assigned to ${departmentDestination.name}`,
            ticketId: ticket.id,
            attachment: undefined,
          },
        });
        if (!comment) return null;

        await sendCreateTicketEmail(
          ticket.email,
          ticket.name || "",
          ticket.code
        );

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

  deleteTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input.ticketId,
        },
      });

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      await ctx.prisma.ticket.delete({
        where: {
          id: input.ticketId,
        },
      });

      return { message: "Ticket deleted successfully" };
    }),

  bulkAssignTicket: protectedProcedure
    .input(
      z.object({
        ticketIds: z.array(z.number()),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
      });
      if (!user || !user.email || !user.name)
        throw new Error("Ticket doesn't exist");

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

      await sendBulkAssignTicketEmail(
        user.email,
        user.name,
        input.ticketIds.length
      );
      return true;
    }),
});
