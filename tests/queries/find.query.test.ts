/**
 * The only difference between novo and novo_test is that in novo_test,
 * we can't open a TCP connection to the database.
 *
 * Instead, We have to do it manually inside your test.
 */
import { novo_test as novo } from "../../src/Novo_Test.ts";

import { Model } from "../../src/Model.ts";
import { CreateMany } from "../../src/Query.ts";
import {
  afterAll,
  assertEquals,
  beforeAll,
  describe,
  equal,
  getRandomString,
  it,
} from "../test.deps.ts";

interface IFindModel {
  _id: string;

  name: string;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}

describe("Find Query Unit Testing", () => {
  let FindModel: Model<IFindModel> = (undefined as unknown) as Model<
    IFindModel
  >;

  beforeAll(async () => {
    await novo.connect("mongodb://localhost:27017/test");
    FindModel = novo.model<IFindModel>("find_collection");
  });

  afterAll(async () => {
    await FindModel.deleteMany();
    await novo.disconnect();
  });

  const rawdocs: CreateMany<IFindModel> = [
    { name: getRandomString(), status: "Deactivated" },
    { name: getRandomString(), status: "Active" },
  ];

  it("Should create documents", async () => {
    const docs = await FindModel.createMany(rawdocs);
    assertEquals(docs.insertedCount, rawdocs.length);
  });

  it("Should Find All the documents", async () => {
    const docs = await (await FindModel.find()).toArray();
    assertEquals(docs.length, 2);

    let index = 0;
    for (const doc of docs) {
      equal({ name: rawdocs[index].name, status: rawdocs[index].status }, {
        name: doc.name,
        status: doc.status,
      });
      index++;
    }
  });

  it("Find One Document", async () => {
    const doc = await FindModel.findOne({ name: rawdocs[0].name });
    equal(rawdocs[0], { name: doc?.name, status: doc?.status });
  });
});
