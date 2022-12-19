import { ConnectOptions, MongoClient } from "../deps.ts";
import connection from "./Connection.ts";
import model from "./Model.ts";

class NovoTest {
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

const novo_test: NovoTest = new NovoTest();

/** If you want to test Novo, you cant open TCP connection here.
 * Do it inside your test instead.
 */
// await novo.connect(DATABASE_URL);
export { novo_test };
