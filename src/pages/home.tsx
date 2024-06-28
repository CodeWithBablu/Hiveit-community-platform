import CreatePostLink from "@/components/Community/CreatePostLink";
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
          {/* Recomendations */}
        </>
      </PageLayout>
    </div>
  );
};


export default Home;
