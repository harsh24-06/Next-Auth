import { hashPassword } from "../../../lib/auth"; //hashPassword: A utility function (likely using bcryptjs or crypto) that securely hashes the user's password before storing it.
import { connectToDatabase } from "../../../lib/db"; //: A function that connects to MongoDB and returns a MongoDB client object. It’s usually defined in a reusable module so it can be used across different parts of the app.

// 1. This is the main request handler function for the API route.
// 2. It handles HTTP requests (e.g., POST) and sends back HTTP responses.
async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body; //req.body contains the data sent from the frontend
  const { email, password } = data; //It extracts email and password from the incoming request payload
  //  block ensures the inputs are valid:
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    //Responds with HTTP 422 Unprocessable Entity
    //Sends a JSON error message
    //return exits early to prevent further execution
    res.status(422).json({
      message: "Invalid input - password should be atleast 7 characters long",
    });
    return;
  }
  const client = await connectToDatabase(); //Connects to MongoDB using connectToDatabase(), which returns a MongoClient instance
  const db = client.db(); //client.db() gets a reference to the specific database
  //It tries to find a document where the email field matches the given email from the signup request.
  const existingUser = await db.collection("users").findOne({ email: email }); //findOne returns the first matching document or null if no match is found.
  if (existingUser) {
    //This checks if the existingUser is not null, which means a user with that email already exists.
    res.status(422).json({ message: "User Exists Already!!!" });
    client.close(); //Properly closes the MongoDB connection to free up resources
    return; //prevent the rest of the code (password hashing and inserting new user) from running
  }
  const hashedPassword = await hashPassword(password); //Hashes the plain-text password for security using the imported hashPassword function
  //Inserts a new document into the users collection in MongoDB.
  const result = await db.collection("users").insertOne({
    email: email,
    password: hashedPassword,
  });
  res.status(201).json({ message: "User Created" });
}
export default handler;
