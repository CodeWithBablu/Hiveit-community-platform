import { useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AuthModalState } from "../../../slices/authModalSlice";
import { setAuthModalState } from "../../../slices";

import AuthInputs from "./AuthInputs";
import OAuthButton from "./OAuthButton";
import ResetPassword from "./ResetPassword";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

// type Props = {}

const AuthModal = () => {
  const [user] = useAuthState(auth);

  const modalState: AuthModalState = useSelector(
    (state: { authModalState: AuthModalState }) => state.authModalState,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(setAuthModalState({ open: false, view: "login" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Modal
        isOpen={modalState.open}
        onClose={() => {
          dispatch(setAuthModalState({ open: false, view: "login" }));
        }}
      >
        <ModalOverlay />
        <ModalContent className="w-full md:min-w-[700px]">
          <ModalHeader>
            {modalState.view == "login" && "Login"}
            {modalState.view == "signup" && "Sign Up"}
            {modalState.view == "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="mb-8 flex items-center justify-around md:space-x-8">
            <>
              <img
                className="hidden h-44 w-44 rounded-full shadow-2xl shadow-secondary md:inline-block"
                src="/logo.webp"
                alt="logo"
              />
              {modalState.view === "resetPassword" ? (
                <ResetPassword />
              ) : (
                <div className="flex flex-col">
                  <OAuthButton />
                  <hr className="my-3" />
                  <AuthInputs />
                </div>
              )}
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
