import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://Sakshi:93lKvj1z92CosxAk@cluster0.ylnilbg.mongodb.net/auth-demo?retryWrites=true&w=majority&appName=Cluster0"
  );
  return client;
}
