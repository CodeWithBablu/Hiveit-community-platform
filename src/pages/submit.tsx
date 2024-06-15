import { useAuthState } from "react-firebase-hooks/auth";
import PageLayout from "../components/Layout/PageLayout";
import PostForm from "../components/Post/PostForm";
import { auth } from "../firebase/clientApp";
import { useDispatch } from "react-redux";
import { setAuthModalState } from "@/slices";

const Submit = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  return (
    <div className="bg-zinc-950 pt-12 font-poppins text-white">
      <PageLayout>
        {/* left content */}
        <>
          {user && <PostForm user={user} />}
          {!user && (
            <div className="relative flex h-96 w-full items-center justify-center rounded-xl p-2 sm:h-auto">
              <img
                className="rounded-xl"
                src="/community.svg"
                alt="community"
              />
              <button onClick={() => {
                dispatch(setAuthModalState({ open: true, view: "login" }));
              }} className="absolute rounded-full bg-blackAplha700 px-6 py-5 font-chillax text-base font-semibold backdrop-blur-xl sm:text-2xl">
                Sign in to submit post
              </button>
            </div>
          )}
        </>

        {/* right content */}
        <></>
      </PageLayout>
    </div>
  );
};

export default Submit;
