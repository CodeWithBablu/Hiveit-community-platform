import { motion } from "framer-motion";

import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { useState } from "react";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { setAuthModalState } from "../../../slices";
import { useDispatch } from "react-redux";
import { Spinner } from "@chakra-ui/react";

const ResetPassword = () => {
  const [sucess, setSucess] = useState(false);
  const [email, setEmail] = useState("");
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const dispatch = useDispatch();

  const onSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendPasswordResetEmail(email);
    if (!error) setSucess(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {sucess ? (
        <span className="text-center font-poppins text-[14px] font-semibold text-slate-700">
          Reset Email successfully send to
          <span className="block text-sky-500"> {email}</span>
        </span>
      ) : (
        <>
          <h1 className="font-poppins text-xl font-semibold">
            Reset your Password
          </h1>

          <span className="text-md text-center font-poppins font-medium text-rose-400">
            {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
          </span>

          <span className="text-md text-center font-poppins font-medium">
            Enter the email associated with your account and we&lsquo;ll send
            you a reset link
          </span>

          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col items-center space-y-4"
          >
            <input
              onChange={onChange}
              required
              className="rounded-lg border-2 p-2 font-poppins font-medium outline-none hover:border-sky-500 focus:border-sky-500"
              name="email"
              placeholder="email please..."
              type="text"
            />
            <div className="relative w-fit">
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="submit"
                className={`w-44 rounded-lg bg-teal-500 px-4 py-2 text-lg font-semibold text-white ${sending ? "pointer-events-none opacity-30" : "opacity-100"}`}
              >
                Reset Password
              </motion.button>
              {sending && (
                <Spinner
                  thickness="4px"
                  className="absolute bottom-0 left-0 right-0 top-0 m-auto"
                />
              )}
            </div>
          </form>
        </>
      )}
      <div>
        <h2 className="text-md mb-2 font-bold">
          Already have a account ?{" "}
          <motion.span
            whileTap={{ scale: 0.7 }}
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "login" }))
            }
            className="inline-block cursor-pointer text-sky-400 hover:text-sky-300"
          >
            Login
          </motion.span>{" "}
          🥰️
        </h2>
        <h2 className="text-md font-bold">
          Ahh!! New here?{" "}
          <motion.span
            whileTap={{ scale: 0.7 }}
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "signup" }))
            }
            className="inline-block cursor-pointer text-sky-400 hover:text-sky-300"
          >
            Sign Up{" "}
          </motion.span>{" "}
        </h2>
      </div>
    </div>
  );
};

export default ResetPassword;
