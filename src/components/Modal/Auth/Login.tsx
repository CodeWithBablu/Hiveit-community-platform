
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { setAuthModalState } from "../../../slices";

import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../../firebase/clientApp";
import { Spinner } from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import { Toast } from "../../../lib/Toast";

// type Props = {}


const Login = () => {

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [errormessage, setErrorMessage] = useState("");

  const [
    signInWithEmailAndPassword,
    userCred,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (error) setErrorMessage(FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]);
  }, [error]);

  const dispatch = useDispatch();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const userCred = await signInWithEmailAndPassword(loginForm.email, loginForm.password);

      if (!userCred)
        Toast('error', "hey there", 30000);

    } catch (error) {
      setErrorMessage(error instanceof FirebaseError ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS] : 'login failed. try again');
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (

    <div>
      <form name="loginForm" onSubmit={onSubmit} className=' flex flex-col w-full space-y-4'>
        <input onChange={onChange} required autoComplete="email" className=' border-2 p-2 hover:border-sky-500 focus:border-sky-500 outline-none font-poppins font-medium rounded-lg' id="email" name="email" placeholder='email please...' type="text" />
        <input onChange={onChange} required autoComplete="current-password" className=' border-2 p-2 hover:border-sky-500 focus:border-sky-500 outline-none font-poppins font-medium rounded-lg' id="password" name="password" placeholder='password please...' type="password" />


        <div className="relative w-28">
          <motion.button whileTap={{ scale: 0.8 }} type="submit" className={` w-28 text-xl text-white font-semibold rounded-lg bg-blue-500 py-2 px-4 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>Login</motion.button>
          {loading && <Spinner thickness='4px' className="absolute top-0 bottom-0 left-0 right-0 m-auto" />}
        </div>

        <h2 className=' text-md font-bold'>Forgot your password? <motion.span whileTap={{ scale: 0.7 }} onClick={() => dispatch(setAuthModalState({ open: true, view: "resetPassword" }))} className=' inline-block cursor-pointer text-sky-400 hover:text-sky-300'>Reset Password</motion.span> 🥰️</h2>
        <h2 className=' text-md font-bold'>Ahh!! New here? <motion.span whileTap={{ scale: 0.7 }} onClick={() => dispatch(setAuthModalState({ open: true, view: "signup" }))} className=' inline-block cursor-pointer text-sky-400 hover:text-sky-300'>Sign Up </motion.span> 🥰️</h2>

        {errormessage && <h3 className=' text-[16px] min-h-5 font-medium font-poppins text-center text-rose-400'>{errormessage}</h3>}
      </form>
    </div>

  )
}

export default Login