# Novo

Novo is a simple Object Data Modeling (ODM) for MongoDB. Novo is created for
your Mongodb project in Deno. It's easy to use and blazingly fast.

## TODOs

Working further for Query Class.

## How to Use

You can run this example with:

```bash
deno task example
```

### Create a Model

```ts
// example/models/movie.model.ts

import { novo, ObjectId } from "../../mod.ts";

interface IMovieModel {
  _id: ObjectId;

  slug: string;

  title: string;

  poster: string;

  createdAt: string;

  updatedAt: string;
}

const createMovieModel = () => novo.model<IMovieModel>("you-collection-name");
export default createMovieModel;
```

### Use The Model

```ts
/**
 * To make this things work, you have to define your `DATABASE_URL` in your .env file.
 */
import { novo } from "../mod.ts";
import createMovieModel from "./models/movie.model.ts";

const MovieModel = createMovieModel();

const avengerEndGame = await MovieModel.findOne({ slug: "avg-endgame" });
console.log(`-- ${avengerEndGame?.title} --`);
console.log(avengerEndGame);

globalThis.addEventListener("unload", () => {
  /** Disconnect from database when deno is about to exit.
   * NOTE: This action is required.
   */
  novo.disconnect();
});

Deno.exit(0);
```

## Run Unit Test

To run the unit tests:

```bash
deno task test
```

## Free for Contributions

Hey, Developers. I'm glad if we're working together on this project.
