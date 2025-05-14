// This dynamic API route allows NextAuth.js to automatically handle multiple authentication-related
// subroutes like: eg. /api/auth/signin ,/api/auth/signout, etc
import NextAuth from "next-auth";
import { connectToDatabase } from "../../../lib/db"; //Imports a helper function to connect to MongoDB. Used to fetch user data from your users collection.
import { verifyPassword } from "../../../lib/auth"; //Imports a utility function that compares a plain password with a hashed one, using bcrypt.
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  session: {
    // This means session data will be stored in encrypted cookies using JSON Web Tokens.
    // Enables JWT-based session management instead of database sessions.
    jwt: true,
    //  strategy: "jwt",
  },
  providers: [
    //This sets up Credential-based authentication — i.e., sign in with email and password instead of OAuth (like Google, GitHub, etc.).
    //You must manually validate users in this method.
    CredentialsProvider({
      //This is the main function that runs during login.
      async authorize(credentials) {
        //credentials contains the email and password entered by the user on the login form.
        const client = await connectToDatabase(); //Connects to your MongoDB database.
        const usersCollection = client.db().collection("users"); //Accesses the users collection in your MongoDB database.
        const user = await usersCollection.findOne({
          email: credentials.email, //Tries to find a user document where the email matches the one entered by the user.
        });
        if (!user) {
          //if no user is found, close the DB connection and throw an error.
          client.close();
          throw new Error("No Users Found!!!");
        }
        const isValid = await verifyPassword(
          //Compares the plain password entered by the user with the hashed password in the DB using the verifyPassword function.
          credentials.password,
          user.password
        );
        if (!isValid) {
          //If the password doesn't match, throw an error
          client.close();
          throw new Error("Could not Log You In...");
        }
        client.close();
        return { email: user.email }; //If everything is valid, return a session user object (email in this case)/ This object will be embedded in the session token.
      },
    }),
  ],
});
