import { useDispatch } from "react-redux";
import { setAuthModalState } from "../../../slices";
import { motion } from "framer-motion";

const AuthButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className="items-center gap-4 font-chillax flex">
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          dispatch(setAuthModalState({ open: true, view: "login" }));
        }}
        className=" h-10 rounded-md px-5 text-xl font-medium ring-1 ring-gray-100"
      >
        Login
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          dispatch(setAuthModalState({ open: true, view: "signup" }));
        }}
        className="hidden md:inline-block h-10 rounded-md bg-gray-100 px-5 text-xl font-medium text-zinc-900"
      >
        Sign Up
      </motion.button>
    </div>
  );
};

export default AuthButtons;
