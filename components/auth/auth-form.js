import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/react";
function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  // Sends a POST request to /api/auth/signup Sends email & password in JSON format.
  // If the response isn’t OK (status not 200–299), it throws an error. Otherwise, it returns the response data
  async function createUser(email, password) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went Wrong");
    }
    return data;
  }

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }
  async function submitHandler(event) {
    event.preventDefault(); //Prevents page reload
    //Reads the current value of email and password from the ref inputs.
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    //Optional: Add Validation
    if (isLogin) {
      //log users in
      const result = await signIn("credentials", {
        redirect: false, //redirect: false tells NextAuth to return the result instead of redirecting
        email: enteredEmail,
        password: enteredPassword
      });
      console.log(result);
      if (!result.error) {
        //set some auth state If login is successful (no error), you can redirect or update app state
      }
    } else {
      //If in signup mode, it calls createUser() and logs the result or any error.
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
