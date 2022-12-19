import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import { ConnectOptions, MongoClient } from "../deps.ts";

import model from "./Model.ts";
import connection from "./Connection.ts";

class Novo {
  public client: MongoClient | undefined;
  public model: typeof model;

  constructor() {
    this.model = model;
  }

  public async connect(options: ConnectOptions | string): Promise<MongoClient> {
    if (this.client) return this.client;
    this.client = await connection.connect(options);
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (!this.client) {
      throw new Error("You haven't connect to the database, Buddy.");
    }
    this.client.close();
  }
}

const DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
  console.error("Please define your DATABASE_URL in your .env file!");
  Deno.exit(1);
}

export const novo: Novo = new Novo();
await novo.connect(DATABASE_URL);
