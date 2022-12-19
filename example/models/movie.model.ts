import { novo } from "../../mod.ts";

interface IMovieModel {
  _id: string;

  slug: string;

  title: string;

  poster: string;

  createdAt: string;

  updatedAt: string;
}

const MovieModel = novo.model<IMovieModel>("movies");
export default MovieModel;
