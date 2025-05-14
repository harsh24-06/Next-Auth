//bcryptjs is a JavaScript implementation of the bcrypt hashing algorithm, commonly used for securely storing passwords.
import { compare, hash } from "bcryptjs";
export async function hashPassword(password) {
  //Uses the imported hash() function to hash the plain-text password.

  // Parameters: password: The plain password input by the user. 12: The salt rounds, meaning how many times to run the hashing algorithm internally.
  // More rounds = more secure, but also more CPU-intensive.
  // 12 is considered a good trade-off between security and performance.

  // await is used because hash() returns a promise.
  const hashedPassword = await hash(password, 12); //It's marked async because it uses await to handle asynchronous hashing.
  return hashedPassword; // Returns the hashed password (a string that looks like $2a$12$...) to the caller.
}
export async function verifyPassword(password, hashedPassword) {
  //Compares a plain password (entered during login) to a hashed password (stored in DB).
  //Uses bcrypt's compare() to do this securely.
  //Returns a boolean: true if the password is valid, false otherwise.
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
