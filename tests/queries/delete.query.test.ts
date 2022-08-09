/**
 * The only difference between novo and novo_test is that in novo_test,
 * we can't open a TCP connection to the database.
 * 
 * Instead, We have to do it manually inside your test.
 */
import { novo_test as novo } from "../../mod.ts";

import { Model } from "../../src/Model.ts";
import { describe, it, beforeAll, afterAll, assertEquals, assertThrows } from "../test.deps.ts";

interface IDeleteModel {
    _id: string;

    name: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;
}

describe("Delete Query Unit Testing", async () => {

    let DeleteModel: Model<IDeleteModel> = (undefined as unknown) as Model<IDeleteModel>;

    beforeAll(async () => {
        await novo.connect("mongodb://localhost:27017/test");
        DeleteModel = novo.model<IDeleteModel>("delete_collection");
        await DeleteModel.createMany([
            { name: "Delete One", status: "Deactivated" },
            { name: "Delete Many", status: "Active" },
        ]);
    })

    afterAll(async () => {
        await DeleteModel.deleteMany();
        await novo.disconnect();
    });

    it("Should delete a document", async () => {

        const doc = await DeleteModel.findOne({ name: "Delete One" });
        await DeleteModel.deleteOne({ _id: doc?._id });
        const deleted = await DeleteModel.findOne({ name: "Delete One" });
        assertEquals(deleted, undefined);

    })

    it("Should delete many documents", async () => {

        const docs = await (await DeleteModel.find({ status: "Active" })).toArray();
        if (docs.length < 1) assertThrows(() => new Error("Invalid Test"));

        await DeleteModel.deleteMany({});
        const deleted = await (await DeleteModel.find()).toArray();

        assertEquals(deleted.length, 0);

    })

})