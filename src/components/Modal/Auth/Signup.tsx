import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { setAuthModalState } from "../../../slices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { auth, firestore } from "../../../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { Spinner } from "@chakra-ui/react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth/cordova";
import { FirebaseError } from "firebase/app";

// type Props = {}

const Signup = () => {
  const [signupForm, setSignUpForm] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const [errormessage, setErrorMessage] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (userCred) createUserDocument(userCred.user);
    //// run if there is an error
    if (error)
      setErrorMessage(
        FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS],
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, userCred]);

  const dispatch = useDispatch();

  //// create User document when user signup first time
  const createUserDocument = async (user: User) => {
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    };
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, newUser);
  };

  //// Submit function
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const emailFormat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passwordFormat =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!signupForm.email.match(emailFormat)) {
        setErrorMessage("🥶️ Email is invalid!!");
        return;
      } else if (!signupForm.password.match(passwordFormat)) {
        setErrorMessage(
          "🥶️ 8-Minimum char, 1-Uppercase, 1-lowercase, 1-number, 1-[@$!*?&]",
        );
        return;
      } else if (signupForm.password !== signupForm.cpassword) {
        setErrorMessage("🥶️ Confirm password doesn't match");
        return;
      }

      const user = await createUserWithEmailAndPassword(
        signupForm.email,
        signupForm.password,
      );

      if (user) {
        setErrorMessage("");

        // Shows toast message
        toast.success(`Created account Successful!!`, {
          duration: 3000,
          icon: "👏️😉️",
          style: {
            borderRadius: "10px",
            background: "#1b1b19",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 800,
          },
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof FirebaseError
          ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]
          : "signup failed. try again",
      );
    }
  };

  //// ON Change function
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      <form
        name="signupForm"
        onSubmit={onSubmit}
        className="flex w-full flex-col space-y-4"
      >
        <input
          onChange={onChange}
          required
          autoComplete="email"
          className="rounded-lg border-2 p-2 font-poppins font-medium outline-none hover:border-sky-500 focus:border-sky-500"
          name="email"
          placeholder="email please..."
          type="text"
        />
        <input
          onChange={onChange}
          required
          autoComplete="current-password"
          className="rounded-lg border-2 p-2 font-poppins font-medium outline-none hover:border-sky-500 focus:border-sky-500"
          name="password"
          placeholder="password please..."
          type="password"
        />
        <input
          onChange={onChange}
          required
          autoComplete="current-password"
          className="rounded-lg border-2 p-2 font-poppins font-medium outline-none hover:border-sky-500 focus:border-sky-500"
          name="cpassword"
          placeholder="confirm password please..."
          type="password"
        />

        <div className="relative w-fit">
          <motion.button
            whileTap={{ scale: 0.8 }}
            type="submit"
            className={`w-28 rounded-lg bg-blue-500 px-4 py-2 text-xl font-semibold text-white ${loading ? "pointer-events-none opacity-30" : "opacity-100"}`}
          >
            Sign Up
          </motion.button>
          {loading && (
            <Spinner
              thickness="4px"
              className="absolute bottom-0 left-0 right-0 top-0 m-auto"
            />
          )}
        </div>
        <h3 className="text-md font-bold">
          Ahh!! Already have account?{" "}
          <motion.span
            whileTap={{ scale: 0.7 }}
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "login" }))
            }
            className="inline-block cursor-pointer text-sky-400 hover:text-sky-300"
          >
            Login{" "}
          </motion.span>{" "}
          🥰️
        </h3>

        {errormessage && (
          <h3 className="min-h-5 text-center font-poppins text-[16px] font-medium text-rose-400">
            {errormessage}
          </h3>
        )}
      </form>
    </div>
  );
};

export default Signup;
