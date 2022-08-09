import Query from "./Query.ts";

// Create Query Class
// Di QueryClass ambil db dari connection novo, baru query;

// Last, extends model nya ke class sini.

export class Model<T> extends Query<T> {

    constructor(collectionName: string) {
        super(collectionName);
    }

}

export default function model<T>(collectionName: string): Model<T> {
    return new Model<T>(collectionName);
}