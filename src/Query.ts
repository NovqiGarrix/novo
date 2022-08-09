import { novo } from './Novo.ts';
import { Collection, DeleteOptions, Filter, FindOptions, InsertDocument, InsertOptions, UpdateOptions } from "../deps.ts";
import { FindCursor } from "https://deno.land/x/mongo@v0.31.0/src/collection/commands/find.ts";

export type CreateOne<T> = Omit<T, "_id" | "createdAt" | "created_at" | "updatedAt" | "updated_at">;
export type CreateMany<T> = Array<CreateOne<T>>;

interface Timestamp {
    createdAt: Date;
    updatedAt: Date;
}

export class Query<T> {

    private collection: Collection<T> | undefined;

    constructor(collectionName: string) {
        const db = novo.client?.database();
        this.collection = db?.collection<T>(collectionName);
    }

    async find(filter?: Filter<T>, options?: FindOptions): Promise<FindCursor<T>> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.find(filter, options);
    }

    async findOne(filter?: Filter<T>, options?: FindOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.findOne(filter, options);
    }

    /**
     * @description You don't have to pass _id, createdAt, and updatedAt. It will automatically generated.
     *
     * @param data
     * @returns 
     */
    async create(data: CreateOne<T>, options?: InsertOptions): Promise<T> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const inserdata: CreateOne<T> & Timestamp = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const createdID = await this.collection.insertOne((inserdata as unknown) as InsertDocument<T>, options);
        return (await this.findOne({ _id: createdID }))!;
    }

    async createMany(data: CreateMany<T>, options?: InsertOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const inserdata = data.map((item) => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const results = await this.collection.insertMany((inserdata as unknown) as InsertDocument<T>[], options);
        return results;
    }

    async upsert(filter: Filter<T>, data: Partial<CreateOne<T>>, options?: InsertOptions | UpdateOptions): Promise<T> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const existedData = await this.findOne(filter);
        if (existedData) {
            const updateData = {
                ...(data ?? {}),
                updatedAt: new Date(),
            }

            /**
             * If the 
             */
            // @ts-ignore
            const newDoc = await this.collection.updateOne(filter, { $set: updateData }, options);

            const doc = await this.findOne({ _id: newDoc.upsertedId });
            return doc!;
        }

        return this.create((data as unknown) as CreateOne<T>, options);
    }

    async deleteOne(filter: Filter<T>, options?: DeleteOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.deleteOne(filter, options);
    }

    async deleteMany(filter?: Filter<T>, options?: DeleteOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.deleteMany(filter ?? {}, options);
    }

}

interface IMovieModel {

    _id: string;

    slug: string;

    title: string;

    poster: string;

    createdAt: string;

    updatedAt: string;

}

// const query = new Query<IMovieModel>("users");
// await query.create({ poster: "", slug: "", title: "" }, {})
// const datas = await query.createMany([{ poster: "", slug: "", title: "" }], {})
// const upsert = await query.upsert({ slug: "ok" }, { poster: "Oke", slug: "Ok", title: "OK" });
// upsert.

export default Query