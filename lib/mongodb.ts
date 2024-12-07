import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp"; // Update the URI as needed
const dbName = "chatapp";

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}