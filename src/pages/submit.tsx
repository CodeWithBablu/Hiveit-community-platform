import PageLayout from "../components/Layout/PageLayout"
import PostForm from "../components/Post/PostForm"

const Submit = () => {
  return (
    <div className="bg-zinc-950 pt-12 text-white font-poppins">
      <PageLayout>
        {/* left content */}
        <>
          <PostForm />
        </>

        {/* right content */}
        <></>
      </PageLayout>
    </div>
  )
}

export default Submit