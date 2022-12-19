# Novo

Novo is a simple Object Data Modeling (ODM) for MongoDB. Novo is created for your Mongodb project in Deno. 
It's easy to use and blazingly fast.

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
