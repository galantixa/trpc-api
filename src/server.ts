// TODO
// get a list of users
// get a user by id
// create a user

import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

type User = {
  id: number;
  name: string;
};

const userList: User[] = [
  {
    id: 1,
    name: "Jhon",
  },
];

const createContext = (opts: CreateExpressContextOptions) => {
  const userId = opts.req.headers.authorization;

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No USER id" });
  }
  const user = userList.find((user) => user.id === +userId);

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "no matching user was found",
    });
  }
  return {
    ...opts,
    user,
  };
};

const trpc = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

const appRouter = trpc.router({
  listUser: trpc.procedure.query(({ ctx }) => {
    console.log("Requesting user: ", ctx.user.name);
    return userList;
  }),
  getUserById: trpc.procedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return userList.find((user) => user.id === input.id);
    }),
  createUsers: trpc.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newUser: User = {
        name: input.name,
        id: userList[userList.length - 1].id + 1,
      };
      userList.push(newUser);
      return newUser;
    }),
});

const app = express();

export type AppRouter = typeof appRouter;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3000, () => console.log(`App is running on port ${3000}`));
