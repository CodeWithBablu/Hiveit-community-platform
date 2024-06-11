import { useDispatch } from "react-redux"
import { setAuthModalState } from "../../../slices";
import { motion } from "framer-motion";

const AuthButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className=" hidden md:flex font-chillax items-center gap-4">
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => { dispatch(setAuthModalState({ open: true, view: 'login' })) }} className=" h-10 px-5 text-xl font-medium rounded-md ring-2 ring-gray-100">Login</motion.button>
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => { dispatch(setAuthModalState({ open: true, view: 'signup' })) }} className=" h-10 px-5 text-xl font-medium rounded-md text-zinc-900 bg-gray-100">Sign Up</motion.button>
    </div>
  )
}

export default AuthButtons