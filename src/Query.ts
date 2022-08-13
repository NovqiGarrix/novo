import { novo } from './Novo.ts';
import { AggregateOptions, AggregatePipeline, Collection, CreateIndexOptions, DeleteOptions, DistinctOptions, DropIndexOptions, DropOptions, Filter, FindOptions, InsertDocument, InsertOptions, UpdateFilter, UpdateOptions } from "../deps.ts";
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

    /**
     * Aggregate the documents in the collection based on the pipeline.
     * 
     * @param pipeline 
     * @param options 
     * @returns 
     */
    async aggregate(pipeline: Array<AggregatePipeline<T>>, options?: AggregateOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.aggregate(pipeline, options);
    }




    /**
     * Create one document in the collection.
     * 
     * @note You don't have to pass _id, createdAt, and updatedAt. It will automatically generated.
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




    /**
     * Create an index on the collection.
     * 
     * @param options 
     * @returns 
     */
    async createIndexes(options: CreateIndexOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.createIndexes(options);
    }




    /**
     * Create as many documents as you want in the collection.
     * 
     * @param data 
     * @param options 
     * @returns 
     */
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




    /**
     * Count all the documents in the collection based on the filter.
     * 
     * @param filter 
     * @returns 
     */
    async count(filter?: Filter<T>): Promise<number> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.countDocuments(filter);
    }




    /**
     * Delete one document in the collection based on the filter.
     * 
     * @param filter 
     * @param options 
     * @returns 
     */
    async deleteOne(filter: Filter<T>, options?: DeleteOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.deleteOne(filter, options);
    }




    /**
     * Delete all the documents in the collection based on the filter.
     * 
     * @param filter 
     * @param options 
     * @returns 
     */
    async deleteMany(filter?: Filter<T>, options?: DeleteOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.deleteMany(filter ?? {}, options);
    }




    /**
     * 
     * To get unique values and ignore duplicates.
     * The distinct() finds the distinct values for a specified 
     * field across a single collection and returns the results in an array.
     * 
     * @param key 
     * @param query 
     * @param options 
     * @returns 
     * 
     * @generic N - The type of the value.
     */
    async distinct<N>(key: keyof T, query?: Filter<T>, options?: DistinctOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return (await this.collection.distinct(key as string, query, options)) as Array<N>;
    }




    /**
     * Drop the current collection.
     * 
     * @param options 
     * @returns 
     */
    async drop(options?: DropOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.drop(options);
    }




    /**
     * Drop an index from the collection.
     * 
     * @param options 
     * @returns 
     */
    async dropIndex(options: DropIndexOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.dropIndexes(options);
    }




    /**
     * Find all the documents in the collection based on the filter.
     * 
     * @param filter 
     * @param options 
     * @returns 
     */
    async find(filter?: Filter<T>, options?: FindOptions): Promise<FindCursor<T>> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.find(filter, options);
    }




    /**
     * Find one document in the collection based on the filter.
     * 
     * @param filter 
     * @param options 
     * @returns 
     */
    async findOne(filter?: Filter<T>, options?: FindOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.findOne(filter, options);
    }




    /**
     * Get list of indexes in the collection.
     * 
     * @returns 
     */
    async listIndexes() {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");
        return this.collection.listIndexes();
    }




    /**
     * Update one document in the collection based on the filter.
     * Automatically update the updatedAt field.
     * 
     * @param filter 
     * @param update 
     * @param options 
     * @returns 
     */
    async updateOne(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<T> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const existDoc = await this.findOne(filter, { projection: { _id: 1 } });
        if (!existDoc) throw new Error("You're likely trying to update non-existing document.");

        const updateData = {
            ...update,
            updatedAt: new Date(),
        }

        // @ts-ignore
        const updatedRes = await this.collection.updateOne(filter, { $set: updateData }, options);
        const doc = await this.findOne({ _id: updatedRes.upsertedId });
        return doc!;
    }




    /**
     * Insert one document in the collection if does not exist, otherwise update the document.
     * Automatically generated createdAt and updatedAt fields.
     * 
     * @param filter filter to find the document, if match the filter, the document will be updated.
     * @param data the data need to be updated or created
     * @param options insert options
     * @returns 
     */
    async upsert(filter: Filter<T>, data: Partial<CreateOne<T>>, options?: InsertOptions | UpdateOptions): Promise<T> {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const existedData = await this.findOne(filter);
        if (existedData) {
            const updateData = {
                ...(data ?? {}),
                updatedAt: new Date(),
            }

            // @ts-ignore
            const newDoc = await this.collection.updateOne(filter, { $set: updateData }, options);

            const doc = await this.findOne({ _id: newDoc.upsertedId });
            return doc!;
        }

        return this.create((data as unknown) as CreateOne<T>, options);
    }




    /**
     * Update as many documents in the collection based on the filter.
     * Automatically update the updatedAt field.
     * 
     * @param filter 
     * @param documents 
     * @param options 
     * @returns 
     */
    async updateMany(filter: Filter<T>, documents: UpdateFilter<T>, options?: UpdateOptions) {
        if (!this.collection) throw new Error("You haven't connect to the database, Buddy.");

        const updateData = {
            ...documents,
            updatedAt: new Date(),
        }

        // @ts-ignore
        return this.collection.updateMany(filter, { $set: updateData }, options);
    }

}

// API for Query
interface IMovieModel {

    _id: string;

    name: string;

    email: string;

    password: string;

    createdAt: Date;

    updatedAt: Date;

}

// const query = new Query<IMovieModel>("users");
// await query.create({ poster: "", slug: "", title: "" }, {})
// const datas = await query.createMany([{ poster: "", slug: "", title: "" }], {})
// const upsert = await query.upsert({ slug: "ok" }, { poster: "Oke", slug: "Ok", title: "OK" });

// const distinctRes = await query.distinct<Date>("updatedAt");

export default Query