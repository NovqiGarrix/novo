import {
  afterAll,
  assertEquals,
  assertThrows,
  beforeAll,
  describe,
  it,
} from "../test.deps.ts";
import { ObjectId } from "../../deps.ts";

import { novo } from "../../src/Novo.ts";
import { Model } from "../../src/Model.ts";

interface IDeleteModel {
  _id: ObjectId;

  name: string;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}

describe("Delete Query Unit Testing", () => {
  let DeleteModel: Model<IDeleteModel> = (undefined as unknown) as Model<
    IDeleteModel
  >;

  beforeAll(async () => {
    await novo.connect("mongodb://localhost:27017/test");
    DeleteModel = novo.model<IDeleteModel>("delete_collection");
    await DeleteModel.createMany([
      { name: "Delete One", status: "Deactivated" },
      { name: "Delete Many", status: "Active" },
    ]);
  });

  afterAll(async () => {
    await DeleteModel.deleteMany();
    novo.disconnect();
  });

  it("Should delete a document", async () => {
    const doc = await DeleteModel.findOne({ name: "Delete One" });
    await DeleteModel.deleteOne({ _id: doc?._id });
    const deleted = await DeleteModel.findOne({ name: "Delete One" });
    assertEquals(deleted, undefined);
  });

  it("Should delete many documents", async () => {
    const docs = await (await DeleteModel.find({ status: "Active" })).toArray();
    if (docs.length < 1) assertThrows(() => new Error("Invalid Test"));

    await DeleteModel.deleteMany({});
    const deleted = await (await DeleteModel.find()).toArray();

    assertEquals(deleted.length, 0);
  });
});
