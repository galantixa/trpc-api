// TODO
// query a specific user by id
// create a new user
// get all users

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "./server";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      headers: {
        authorization: "1",
      },
    }),
  ],
});

async function main() {
  await client.getUserById
    .query({ id: 1 })
    .then((user) => console.log("get user reached", user));
  client.createUsers
    .mutate({ name: "Jane" })
    .then((user) => console.log("create user reached", user));
  client.listUser
    .query()
    .then((users) => console.log("list user reached", users));
}

main();
