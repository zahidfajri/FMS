import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hash } from "argon2";

export const userRouter = createTRPCRouter({
  getUserByDepartmentId: protectedProcedure
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          departmentId: input.departmentId,
        },
      });

      return users;
    }),

  createTechnician: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).trim(),
        email: z.string().email(),
        password: z.string().min(8),
        departmentId: z.number(),
        isPIC: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = input.name.trim().toLowerCase().split(" ").join("-");

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          departmentId: input.departmentId,
          password: await hash(input.password),
          username,
          role: "TECHNICIAN",
        },
      });

      if (!user) throw new Error("Cannot create user");

      if (input.isPIC) {
        await ctx.prisma.department.update({
          where: {
            id: input.departmentId,
          },
          data: {
            emailPic: user.email,
          },
        });
      }

      return user;
    }),

  updateTechnician: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3).trim(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = input.name.trim().toLowerCase().split(" ").join("-");

      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          username,
        },
      });

      return user;
    }),
});
