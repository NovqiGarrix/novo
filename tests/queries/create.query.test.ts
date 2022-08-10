/**
 * The only difference between novo and novo_test is that in novo_test,
 * we can't open a TCP connection to the database.
 * 
 * Instead, We have to do it manually inside your test.
 */
import { novo_test as novo } from '../../src/Novo_Test.ts';


import { ObjectId } from '../../deps.ts';
import { equal, assertEquals, describe, beforeAll, it, afterAll } from '../test.deps.ts';
import { CreateMany } from '../../src/Query.ts';
import { Model } from '../../src/Model.ts';

interface TestModel {
    _id: string;

    name: string;

    createdAt: Date;

    updatedAt: Date;
}

describe("Create Query Unit Testing", () => {

    let TestModel: Model<TestModel> = (undefined as unknown) as Model<TestModel>;

    beforeAll(async () => {
        await novo.connect("mongodb://localhost:27017/test");
        TestModel = novo.model<TestModel>("create_collection");
    })

    afterAll(async () => {
        await TestModel.deleteMany();
        await novo.disconnect();
    });


    it("Should create a new document from a model", async () => {

        const doc = await TestModel.create({ name: "First Docs!!!" });
        equal(doc, {
            // @ts-ignore
            _id: doc._id instanceof ObjectId,
            name: "First Docs!!!",
            createdAt: doc.createdAt instanceof Date,
            updatedAt: doc.updatedAt instanceof Date,
        });

    })

    it("Should create a new document from a model", async () => {

        const rawdocs: CreateMany<TestModel> = [{ name: "First Docs!!!" }, { name: "Second Docs!!!" }];

        const doc = await TestModel.createMany(rawdocs);
        assertEquals(doc.insertedIds.length, rawdocs.length);
        assertEquals(doc.insertedCount, rawdocs.length);

    })

})