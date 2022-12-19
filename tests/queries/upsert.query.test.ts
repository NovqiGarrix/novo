import {
  afterAll,
  assertEquals,
  assertThrows,
  beforeAll,
  describe,
  equal,
  getRandomString,
  it,
} from "../test.deps.ts";
import { ObjectId } from "../../deps.ts";

import { novo } from "../../src/Novo.ts";

import { Model } from "../../src/Model.ts";
import { CreateOne } from "../../src/Query.ts";

interface IUpsertModel {
  _id: ObjectId;

  name: string;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}

describe("Upsert Query Unit Test", () => {
  let UpsertModel: Model<IUpsertModel> = (undefined as unknown) as Model<
    IUpsertModel
  >;

  beforeAll(async () => {
    await novo.connect("mongodb://localhost:27017/test");
    UpsertModel = novo.model<IUpsertModel>("upsert_collection");
  });

  afterAll(async () => {
    await UpsertModel.deleteMany();
    novo.disconnect();
  });

  const data: CreateOne<IUpsertModel> = {
    name: getRandomString(),
    status: "Deactivated",
  };

  it("Insert document if it does not exist", async () => {
    const isDocumentExisted = await UpsertModel.findOne({ name: data.name });
    if (isDocumentExisted) {
      assertThrows(() => {
        throw new Error("Document already exists.");
      });
    }

    const createdDoc = await UpsertModel.upsert({ name: data.name }, data);
    equal(data, { name: createdDoc.name, status: createdDoc.status });
  });

  it("Update document if it does existed", async () => {
    const updateData = { status: "Activated" };
    const updatedDoc = await UpsertModel.upsert(
      { name: data.name },
      updateData,
    );

    assertEquals(updateData.status, updatedDoc.status);
  });
});
