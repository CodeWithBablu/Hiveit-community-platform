import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { setAuthModalState } from "../../../slices";

import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { Spinner } from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import { Toast } from "../../../lib/Toast";

// type Props = {}

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errormessage, setErrorMessage] = useState("");

  const [signInWithEmailAndPassword, userCred, loading, error] =
    useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (error)
      setErrorMessage(
        FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS],
      );
  }, [error]);

  const dispatch = useDispatch();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const userCred = await signInWithEmailAndPassword(
        loginForm.email,
        loginForm.password,
      );

      if (!userCred) Toast("error", "invalid credential. Try again", 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof FirebaseError
          ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]
          : "login failed. try again",
      );
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      <form
        name="loginForm"
        onSubmit={onSubmit}
        className="flex w-full flex-col space-y-4 font-poppins"
      >
        <input
          onChange={onChange}
          required
          autoComplete="email"
          className="rounded-lg border-2 p-3 text-gray-400 placeholder-gray-500 font-medium autofill-auth outline-none bg-transparent border-dimGray caret-gray-200 focus:border-blue-800"
          id="email"
          name="email"
          placeholder="email please..."
          type="text"
        />
        <input
          onChange={onChange}
          required
          autoComplete="current-password"
          className="rounded-lg border-2 p-3 text-gray-400 placeholder-gray-500 font-medium autofill-auth outline-none bg-transparent border-dimGray  caret-gray-200 focus:border-blue-800"
          id="password"
          name="password"
          placeholder="password please..."
          type="password"
        />

        <div className="relative w-28">
          <motion.button
            whileTap={{ scale: 0.8 }}
            type="submit"
            className={`w-28 rounded-full bg-blue-700 px-4 py-2 text-xl font-medium font-chillax text-white ${loading ? "pointer-events-none opacity-30" : "opacity-100"}`}
          >
            Login
          </motion.button>
          {loading && (
            <Spinner
              speed="0.7s"
              thickness="3px"
              className="absolute bottom-0 text-gray-300 left-0 right-0 top-0 m-auto"
            />
          )}
        </div>

        <h2 className="text-md font-semibold text-gray-400">
          Forgot your password?{" "}
          <motion.span
            whileTap={{ scale: 0.7 }}
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "resetPassword" }))
            }
            className="inline-block cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Reset Password
          </motion.span>{" "}
          🥰️
        </h2>
        <h2 className="text-md font-semibold text-gray-400">
          Ahh!! New here?{" "}
          <motion.span
            whileTap={{ scale: 0.7 }}
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "signup" }))
            }
            className="inline-block cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Sign Up{" "}
          </motion.span>{" "}
          🥰️
        </h2>

        {errormessage && (
          <h3 className="min-h-5 text-center font-poppins text-[16px] font-medium text-rose-600">
            {errormessage}
          </h3>
        )}
      </form>
    </div>
  );
};

export default Login;
