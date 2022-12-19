import {
  afterAll,
  assertEquals,
  beforeAll,
  describe,
  equal,
  it,
} from "../test.deps.ts";
import { ObjectId } from "../../deps.ts";

import { novo } from "../../src/Novo.ts";
import { Model } from "../../src/Model.ts";
import { CreateMany } from "../../src/Query.ts";

interface TestModel {
  _id: ObjectId;

  name: string;

  createdAt: Date;

  updatedAt: Date;
}

describe("Create Query Unit Testing", () => {
  let TestModel: Model<TestModel> = (undefined as unknown) as Model<TestModel>;

  beforeAll(async () => {
    await novo.connect("mongodb://localhost:27017/test");
    TestModel = novo.model<TestModel>("create_collection");
  });

  afterAll(async () => {
    await TestModel.deleteMany();
    novo.disconnect();
  });

  it("Should create a new document from a model", async () => {
    const doc = await TestModel.create({ name: "First Docs!!!" });
    equal(doc, {
      _id: doc._id instanceof ObjectId,
      name: "First Docs!!!",
      createdAt: doc.createdAt instanceof Date,
      updatedAt: doc.updatedAt instanceof Date,
    });
  });

  it("Should create a new document from a model", async () => {
    const rawdocs: CreateMany<TestModel> = [{ name: "First Docs!!!" }, {
      name: "Second Docs!!!",
    }];

    const doc = await TestModel.createMany(rawdocs);
    assertEquals(doc.insertedIds.length, rawdocs.length);
    assertEquals(doc.insertedCount, rawdocs.length);
  });
});
