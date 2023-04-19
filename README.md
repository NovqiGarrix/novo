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

import {
    novo,
    ObjectId,
} from "https://raw.githubusercontent.com/NovqiGarrix/novo/main/mod.ts";

interface IMovieModel {
    _id: ObjectId;

    slug: string;

    title: string;

    poster: string;

    createdAt: string;

    updatedAt: string;
}

// "movies" is the collection name
const MovieModel = novo.model<IMovieModel>("movies");
export default MovieModel;
```

### Use The Model

```ts
import { novo } from "https://raw.githubusercontent.com/NovqiGarrix/novo/main/mod.ts";
import MovieModel from "./models/movie.model.ts";

await novo.connect("mongodb://localhost:27017/movies");

const avengerEndGame = await MovieModel.findOne({
    slug: "avg-endgame",
});
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
