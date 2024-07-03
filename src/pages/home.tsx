import CreatePostLink from "@/components/Community/CreatePostLink";
import Recommendations from "@/components/Community/Recommendations";
import Homefeed from "@/components/Home/Homefeed";
import PageLayout from "@/components/Layout/PageLayout";

const Home = () => {


  return (
    <div className="bg-zinc-950 text-gray-100">
      <PageLayout>
        <>
          <div className="flex flex-col flex-grow w-full border-x-[1px] border-dimGray">
            <CreatePostLink />
            <Homefeed />
          </div>
        </>
        <>
          <Recommendations />
        </>
      </PageLayout>
    </div>
  );
};


export default Home;
