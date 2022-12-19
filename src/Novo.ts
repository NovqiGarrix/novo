import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import { ConnectOptions, MongoClient } from "../deps.ts";

import model from "./Model.ts";
import connection from "./Connection.ts";

export class Novo {
  public static client: MongoClient;
  public readonly model: typeof model;

  constructor() {
    this.model = model;
  }

  public async connect(options: ConnectOptions | string): Promise<MongoClient> {
    if (Novo.client) return Novo.client;
    Novo.client = await connection.connect(options);
    return Novo.client;
  }

  public disconnect(): void {
    if (!Novo.client) {
      throw new Error("Can't disconnect. No connection found.");
    }
    Novo.client.close();
  }
}

// const DATABASE_URL = Deno.env.get("DATABASE_URL");
// if (!DATABASE_URL) {
//   console.error("Please define your DATABASE_URL in your .env file!");
//   Deno.exit(1);
// }

export const novo: Novo = new Novo();
