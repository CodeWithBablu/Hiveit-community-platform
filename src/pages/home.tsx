import CreatePostLink from "@/components/Community/CreatePostLink";
import Recommendations from "@/components/Community/Recommendations";
import Homefeed from "@/components/Home/Homefeed";
import PageLayout from "@/components/Layout/PageLayout";

const Home = () => {


  return (
    <div className="bg-zinc-950 text-gray-100">
      <PageLayout>
        <>
          <CreatePostLink />
          <Homefeed />
        </>
        <>
          <div className="sticky top-14 w-[350px] h-fit mt-14 rounded-2xl border-[1px] border-dimGray">
            <div className='relative h-32 mb-4 overflow-hidden rounded-t-2xl'>
              <img src="/community.svg" className='absolute object-cover' alt="" />
              <h3 className='relative z-10 top-3 left-4 font-semibold tracking-wide text-zinc-900'>Top Communities</h3>
            </div>
            <Recommendations />
          </div>
        </>
      </PageLayout>
    </div>
  );
};


export default Home;
