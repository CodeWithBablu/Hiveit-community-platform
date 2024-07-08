import { motion } from "framer-motion";
import { auth, firestore } from "../../../firebase/clientApp";
import { Spinner } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { Toast } from "../../../lib/Toast";
import { FirebaseError } from "firebase/app";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

// type Props = {}

const OAuthButton = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (userCred) createUserDocument(userCred.user);

    if (error) {
      Toast(
        "error",
        FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS],
        5000,
      );
    }
  }, [userCred, error]);

  useEffect(() => { }, [error]);

  const onSignin = async () => {
    try {
      console.log(
        window.location.protocol === "http:" ||
        window.location.protocol === "https:",
      );
      const userCred = await signInWithGoogle();

      if (userCred) return Toast("success", "Signed in Successful!!", 5000);
    } catch (error) {
      Toast(
        "error",
        error instanceof FirebaseError
          ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]
          : "Failed to login/signup. Try again",
        4000,
      );
    }
  };

  //// create User document when user signup first time
  const createUserDocument = async (user: User) => {
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
      createdAt: serverTimestamp()
    };
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, newUser);
  };

  return (
    <div className="relative w-full">
      <motion.div
        onClick={onSignin}
        whileTap={{ scale: 0.9 }}
        className={`my-2 flex cursor-pointer items-center justify-center gap-4 rounded-md bg-gray-200 px-6 py-1 ${loading ? "pointer-events-none opacity-60" : "opacity-100"}`}
      >
        <img className="h-10 w-10" src="/google.svg" alt="" />
        <h1 className="font-poppins text-xl font-medium text-zinc-800">
          Signin with Google
        </h1>
      </motion.div>
      {loading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          size="md"
          className="absolute bottom-0 left-0 right-0 top-0 m-auto text-rose-500"
        />
      )}
    </div>
  );
};

export default OAuthButton;
