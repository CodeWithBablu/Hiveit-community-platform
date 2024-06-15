import { useSelector } from "react-redux";
import { AuthModalState } from "../../../slices/authModalSlice";
import Login from "./Login";
import Signup from "./Signup";

// type Props = {}

const AuthInputs = () => {
  const modalState = useSelector(
    (state: { authModalState: AuthModalState }) => state.authModalState,
  );

  return (
    <div className="w-full">
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <Signup />}
    </div>
  );
};

export default AuthInputs;
