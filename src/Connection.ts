import { ConnectOptions, Database, MongoClient } from "../deps.ts";

export class Connection {
  public client: MongoClient | undefined = undefined;
  public db: Database | undefined = undefined;

  async connect(options: string | ConnectOptions): Promise<MongoClient> {
    this.client = new MongoClient();

    let connectionString: string | undefined = undefined;
    if (
      typeof options === "string" && options.includes("mongodb://localhost")
    ) connectionString = options.replace("localhost", "127.0.0.1");

    await this.client.connect(connectionString ?? options);

    this.db = this.client.database();

    return this.client;
  }

  disconnect(): void {
    if (this.client) {
      this.client.close();
    } else {
      throw new Error("No connection to close.");
    }
  }
}

const connection: Connection = new Connection();
export default connection;
