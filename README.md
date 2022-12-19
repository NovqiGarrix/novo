# Novo

## Novo is a Future of Mongodb Object Modeling for Deno.js

Novo is created for your Mongodb Object Modeling in Deno.js environment. It's
easy to use and blazingly fast. The syntaxs are pretty the same with Mongoose
(The most popular Mongodb Object Modeling for Node.js)

## TODOs

Working further for Query Class.

## How to Use

You can run this example using command: `deno task example`

```ts
/**
 * To make this things work, you have to define your DATABASE_URL in your .env file.
 */
import novo from "../mod.ts";
import MovieModel from "./models/movie.model.ts";

const avengerEndGame = await MovieModel.findOne({ slug: "avg-endgame" });
console.log(`-- ${avengerEndGame?.title} --`);
console.log(avengerEndGame);

/** Disconnect from database.
 * NOTE: This action is required.
 */
await novo.disconnect();
```

## Free for Contributions

Hey, Developers. I'm glad if we're working together on this project.
