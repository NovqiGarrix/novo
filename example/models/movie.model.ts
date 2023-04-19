import { novo, ObjectId } from "../../mod.ts";

interface IMovieModel {
  _id: ObjectId;

  slug: string;

  title: string;

  poster: string;

  createdAt: string;

  updatedAt: string;
}

const MovieModel = novo.model<IMovieModel>("movies");
export default MovieModel;
