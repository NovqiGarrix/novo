import { Novo } from "./Novo.ts";
import {
  AggregateOptions,
  AggregatePipeline,
  Collection,
  CreateIndexOptions,
  DeleteOptions,
  DistinctOptions,
  DropIndexOptions,
  DropOptions,
  Filter,
  FindCursor,
  FindOptions,
  InsertDocument,
  InsertOptions,
  ObjectId,
  UpdateFilter,
  UpdateOptions,
} from "../deps.ts";

export type CreateOne<T> = Omit<
  T,
  "_id" | "createdAt" | "created_at" | "updatedAt" | "updated_at"
>;
export type CreateMany<T> = Array<CreateOne<T>>;

interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export class Query<T extends { _id: ObjectId }> {
  private collection: Collection<T> | undefined;

  constructor(collectionName: string, dbName?: string) {
    if (!Novo.client) {
      throw new Error("You have to connect to the database first.");
    }

    const db = Novo.client.database(dbName);
    this.collection = db.collection<T>(collectionName);
  }

  private checkConnection() {
    if (!this.collection) {
      throw new Error("You haven't connect to the database, Buddy.");
    }

    return this.collection;
  }

  /**
   * Aggregate the documents in the collection based on the pipeline.
   *
   * @param pipeline
   * @param options
   * @returns
   */
  async aggregate(
    pipeline: Array<AggregatePipeline<T>>,
    options?: AggregateOptions,
  ) {
    const collection = this.checkConnection();
    return collection.aggregate(pipeline, options);
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
    const collection = this.checkConnection();

    const insertData: CreateOne<T> & Timestamp = {
      ...data as CreateOne<T>,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdID = await collection.insertOne(
      (insertData as unknown) as InsertDocument<T>,
      options,
    );
    return (await this.findOne({ _id: createdID }))!;
  }

  /**
   * Create an index on the collection.
   *
   * @param options
   * @returns
   */
  async createIndexes(options: CreateIndexOptions) {
    const collection = this.checkConnection();
    return collection.createIndexes(options);
  }

  /**
   * Create as many documents as you want in the collection.
   *
   * @param data
   * @param options
   * @returns
   */
  async createMany(data: CreateMany<T>, options?: InsertOptions) {
    const collection = this.checkConnection();

    const inserdata = data.map((item) => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const results = await collection.insertMany(
      (inserdata as unknown) as InsertDocument<T>[],
      options,
    );
    return results;
  }

  /**
   * Count all the documents in the collection based on the filter.
   *
   * @param filter
   * @returns
   */
  async count(filter?: Filter<T>): Promise<number> {
    const collection = this.checkConnection();
    return collection.countDocuments(filter);
  }

  /**
   * Delete one document in the collection based on the filter.
   *
   * @param filter
   * @param options
   * @returns
   */
  async deleteOne(filter: Filter<T>, options?: DeleteOptions) {
    const collection = this.checkConnection();
    return collection.deleteOne(filter, options);
  }

  /**
   * Delete all the documents in the collection based on the filter.
   *
   * @param filter
   * @param options
   * @returns
   */
  async deleteMany(filter?: Filter<T>, options?: DeleteOptions) {
    const collection = this.checkConnection();
    return collection.deleteMany(filter ?? {}, options);
  }

  /**
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
  async distinct<N>(
    key: keyof T,
    query?: Filter<T>,
    options?: DistinctOptions,
  ) {
    const collection = this.checkConnection();
    return (await collection.distinct(
      key as string,
      query,
      options,
    )) as Array<N>;
  }

  /**
   * Drop the current collection.
   *
   * @param options
   * @returns
   */
  async drop(options?: DropOptions) {
    const collection = this.checkConnection();
    return collection.drop(options);
  }

  /**
   * Drop an index from the collection.
   *
   * @param options
   * @returns
   */
  async dropIndex(options: DropIndexOptions) {
    const collection = this.checkConnection();
    return collection.dropIndexes(options);
  }

  /**
   * Find all the documents in the collection based on the filter.
   *
   * @param filter
   * @param options
   * @returns
   */
  async find(
    filter?: Filter<T>,
    options?: FindOptions,
  ): Promise<FindCursor<T>> {
    const collection = this.checkConnection();
    return collection.find(filter, options);
  }

  /**
   * Find one document in the collection based on the filter.
   *
   * @param filter
   * @param options
   * @returns
   */
  async findOne(filter?: Filter<T>, options?: FindOptions) {
    const collection = this.checkConnection();
    return collection.findOne(filter, options);
  }

  /**
   * Get list of indexes in the collection.
   *
   * @returns
   */
  async listIndexes() {
    const collection = this.checkConnection();
    return collection.listIndexes();
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
  async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: UpdateOptions,
  ): Promise<T> {
    const collection = this.checkConnection();

    const existDoc = await this.findOne(filter, { projection: { _id: 1 } });
    if (!existDoc) {
      throw new Error("You're likely trying to update non-existing document.");
    }

    const updateData = {
      ...update,
      updatedAt: new Date(),
    };

    // @ts-ignore
    const updatedRes = await collection.updateOne(filter, {
      $set: updateData,
    }, options);
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
  async upsert(
    filter: Filter<T>,
    data: Partial<CreateOne<T>>,
    options?: InsertOptions | UpdateOptions,
  ): Promise<T> {
    const collection = this.checkConnection();

    const existedData = await this.findOne(filter);
    if (existedData) {
      const updateData = {
        ...(data ?? {}),
        updatedAt: new Date(),
      };

      // @ts-ignore
      const newDoc = await collection.updateOne(filter, {
        $set: updateData,
      }, options);

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
  async updateMany(
    filter: Filter<T>,
    documents: UpdateFilter<T>,
    options?: UpdateOptions,
  ) {
    const collection = this.checkConnection();

    const updateData = {
      ...documents,
      updatedAt: new Date(),
    };

    // @ts-ignore
    return collection.updateMany(filter, { $set: updateData }, options);
  }
}

export default Query;
