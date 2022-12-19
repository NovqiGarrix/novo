import { ObjectId } from "../deps.ts";
import Query from "./Query.ts";

export class Model<T extends { _id: ObjectId }> extends Query<T> {
  constructor(collectionName: string) {
    super(collectionName);
  }
}

export default function model<T extends { _id: ObjectId }>(
  collectionName: string,
): Model<T> {
  return new Model<T>(collectionName);
}
