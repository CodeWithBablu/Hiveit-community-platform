import { useAuthState } from "react-firebase-hooks/auth";
import PageLayout from "../components/Layout/PageLayout"
import PostForm from "../components/Post/PostForm"
import { auth } from "../firebase/clientApp";

const Submit = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="bg-zinc-950 pt-12 text-white font-poppins">
      <PageLayout>
        {/* left content */}
        <>
          {user && <PostForm user={user} />}
          {!user && (
            <div className="relative flex justify-center items-center w-full h-96 sm:h-auto p-2 rounded-xl">
              <img className="rounded-xl" src="/community.svg" alt="community" />
              <button className="absolute py-5 px-6 text-base sm:text-2xl bg-blackAplha700 backdrop-blur-xl rounded-full font-chillax font-semibold">Sign in to submit post</button>
            </div>
          )}
        </>

        {/* right content */}
        <></>
      </PageLayout>
    </div>
  )
}

export default Submit