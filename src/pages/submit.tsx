import { useAuthState } from "react-firebase-hooks/auth";
import PageLayout from "../components/Layout/PageLayout";
import PostForm from "../components/Post/PostForm";
import { auth } from "../firebase/clientApp";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalState } from "@/slices";
import { CommunitiesState, Community } from "@/slices/communitySlice";
import About from "@/components/Community/About";
import useCommunity from "@/hooks/useCommunity";

const Submit = () => {
  const [user] = useAuthState(auth);
  const { userCommunities } = useCommunity();
  const dispatch = useDispatch();

  const currentCommunity = userCommunities.currentCommunity || undefined;

  return (
    <div className="bg-zinc-950 font-poppins text-white">
      <PageLayout maxWidth="1280px">
        {/* left content */}
        <>
          {user && <PostForm user={user} communityImageURL={currentCommunity?.imageURL} />}
          {!user && (
            <div className="relative flex h-[100dvh] sm:h-96 sm:mt-32 w-full items-center justify-center rounded-xl p-2">
              <img
                className="rounded-xl h-96 sm:h-full w-full object-cover"
                src="/community.svg"
                alt="community"
              />
              <button
                onClick={() => {
                  dispatch(setAuthModalState({ open: true, view: "login" }));
                }}
                className="absolute rounded-full bg-blackAplha700 px-6 py-5 font-chillax text-base font-semibold backdrop-blur-xl sm:text-2xl"
              >
                Sign in to submit post
              </button>
            </div>
          )}
        </>

        {/* right content */}
        <>
          {currentCommunity &&
            <div className="sticky top-14 w-full max-w-[350px] h-fit mt-32">
              <About communityData={currentCommunity} />
            </div>
          }
        </>
      </PageLayout>
    </div>
  );
};

export default Submit;
