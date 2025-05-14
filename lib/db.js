//This file exports a utility function connectToDatabase that connects your application to a MongoDB Atlas cloud database using the official MongoDB Node.js driver
//MongoClient is used to connect to a MongoDB database and perform CRUD operations
import { MongoClient } from "mongodb"; //This imports the MongoClient class from the official MongoDB Node.js drive

// This defines and exports an asynchronous function named connectToDatabase.

// It's marked async because it uses await to connect to the database.

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    //Uses MongoClient.connect() to initiate a connection to your MongoDB Atlas cluster
    "mongodb+srv://Sakshi:93lKvj1z92CosxAk@cluster0.ylnilbg.mongodb.net/auth-demo?retryWrites=true&w=majority&appName=Cluster0"
    ///auth-demo: Name of the database to connect to (auth-demo). Sakshi is Username and password is 93lKvj1z92Cosx
  );
  //Returns the client instance connected to MongoDB.

  // This allows the caller (e.g., an API route) to use this connection to interact with the database.
  return client;
}
//It is not safe to hardcode your MongoDB username and password directly in the code like this, especially in a public repository. Instead:

// Store sensitive info like credentials in environment variables (e.g., .env.local).

// Access it using process.env.MONGODB_URI.
