import { novo } from "../mod.ts";
import createMovieModel from "./models/movie.model.ts";

await novo.connect("mongodb://localhost:27017/movies");

const avengerEndGame = await createMovieModel().findOne({
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
