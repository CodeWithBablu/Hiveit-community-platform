import { motion } from "framer-motion"
import { auth, firestore } from "../../../firebase/clientApp";
import { Spinner } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { Toast } from "../../../lib/Toast";
import { FirebaseError } from "firebase/app";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

// type Props = {}

const OAuthButton = () => {

  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

  useEffect(() => {
    if (userCred) createUserDocument(userCred.user);

    if (error) Toast('error', FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS], 5000);
  }, [userCred, error]);

  useEffect(() => {
  }, [error]);

  const onSignin = async () => {
    try {
      const userCred = await signInWithGoogle();
      if (userCred) return Toast('success', "Signed in Successful!!", 5000);
    } catch (error) {
      Toast('error', error instanceof FirebaseError ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS] : 'Failed to login/signup. Try again', 4000);
    }
  }

  //// create User document when user signup first time
  const createUserDocument = async (user: User) => {
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    }
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, newUser);
  }

  return (
    <div className="relative w-full">
      <motion.div onClick={onSignin} whileTap={{ scale: 0.9 }} className={`flex items-center justify-center cursor-pointer gap-4 bg-primary rounded-md py-2 px-6 my-2 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <img className=" w-10 h-10" src="/google.svg" alt="" />
        <h1 className=" text-lime-50 text-xl font-medium font-poppins">Signin with Google</h1>
      </motion.div>
      {loading && <Spinner thickness='4px' size='lg' className="absolute text-rose-500 top-0 bottom-0 left-0 right-0 m-auto" />}
    </div>
  )
}

export default OAuthButton