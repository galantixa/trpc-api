// TODO 
// get a list of users
// get a user by id
// create a user

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";

type User = {
    id : number;
    name: string;
};

const userList: User[] = [
    {
        id: 1,
        name: "Jhon",
    },
];

const trpc = initTRPC.create();
const appRouter = trpc.router({
    listUser: trpc.procedure.query(() => userList),
    getUserById: trpc.procedure.input(z.object({id: z.number()})).query( ({input}) => {
        return userList.find (user => user.id === input.id);
    }),
    createUsers : trpc.procedure.input(z.object({name: z.string()})).mutation(({input}) => {
        const newUser : User = {
            name: input.name,
            id: userList[userList.length -1].id+ 1,
        }
        userList.push(newUser);
        return newUser;
    }),
});


const app = express();

export type AppRouter = typeof appRouter;

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware ({
        router: appRouter,
    })
);


app.listen(3000, () => console.log(`App is running on port ${3000}`));
