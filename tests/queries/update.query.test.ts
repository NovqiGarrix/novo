import { equal, describe, it, beforeAll, afterAll, assertEquals } from '../test.deps.ts'
import { novo_test as novo } from '../../src/Novo_Test.ts';
import { Model } from '../../src/Model.ts';

interface UpdateModel {
    _id: string;

    name: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;
}

describe("Update Query Unit Testing", () => {

    let UpdateModel: Model<UpdateModel> = (undefined as unknown) as Model<UpdateModel>;

    beforeAll(async () => {
        await novo.connect("mongodb://localhost:27017/test");
        UpdateModel = novo.model<UpdateModel>("update_collection");
        await UpdateModel.deleteMany();
    })

    afterAll(async () => {
        await UpdateModel.deleteMany();
        await novo.disconnect();
    })

    describe("UpdateOne Function", () => {

        it("Should update the document and return the updated document", async () => {
            const doc = {
                name: "Novo",
                status: "Active",
            }
            const newDoc = await UpdateModel.create(doc);
            const updateData = {
                status: "Deactivated",
            }
            const updatedDoc = await UpdateModel.updateOne({ _id: newDoc._id }, updateData);
            assertEquals(updatedDoc.status, "Deactivated");
        })

    })

    describe("UpdateMany Function", () => {

        it("Should update the documents", async () => {
            const doc = [
                {
                    name: "Novo",
                    status: "Active",
                },
                {
                    name: "Novri",
                    status: "Active",
                }
            ]

            const docs = await UpdateModel.createMany(doc);

            const updateData = { status: "Deactivate" }

            const updatedRes = await UpdateModel.updateMany({ status: "Active" }, updateData);
            assertEquals(updatedRes.modifiedCount, 2);

            const updatedDocs = await (await UpdateModel.find({ status: updateData.status })).toArray();

            let index = 0;
            for (const doc of updatedDocs) {
                assertEquals(doc._id, docs.insertedIds[index]);
                assertEquals(doc.status, updateData.status);
            }

        });

    })

})