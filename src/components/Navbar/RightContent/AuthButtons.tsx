import { useDispatch } from "react-redux"
import { setAuthModalState } from "../../../slices";
import { motion } from "framer-motion";

const AuthButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className=" hidden sm:flex items-center gap-4">
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => { dispatch(setAuthModalState({ open: true, view: 'login' })) }} className=" h-10 px-5 text-xl font-semibold rounded-md ring-2 ring-indigo-300">Login</motion.button>
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => { dispatch(setAuthModalState({ open: true, view: 'signup' })) }} className=" h-10 px-5 text-xl font-semibold rounded-md text-white bg-indigo-500">Sign Up</motion.button>
    </div>
  )
}

export default AuthButtons