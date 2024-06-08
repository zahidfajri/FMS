import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const departmentRouter = createTRPCRouter({
  departments: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.department.findMany();
  }),

  departmentById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.department.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  myDepartment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
      });
      if (!user) throw new Error("User does not exist");

      if (!user.departmentId) throw new Error("User does not have department");
      const department = await ctx.prisma.department.findFirst({
        where: {
          id: user.departmentId,
        },
      });

      return {
        department,
        isPIC: user.email === department?.emailPic,
      };
    }),

  createDepartment: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        emailPIC: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.department.create({
        data: {
          ...input,
        },
      });
    }),

  updateDepartment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        emailPIC: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { emailPIC, ...data } = input;
      let fixedEmailPIC: string | null = null;
      if (emailPIC) {
        const user = await ctx.prisma.user.count({
          where: {
            email: emailPIC,
          },
        });
        if (Boolean(user)) fixedEmailPIC = emailPIC;
      }

      return await ctx.prisma.department.update({
        where: {
          id: input.id,
        },
        data: {
          ...data,
          emailPic: fixedEmailPIC,
        },
      });
    }),
});
