import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[600px] w-full flex-col items-center justify-center gap-4 bg-zinc-950 font-poppins text-xl font-medium">
      <h1 className="text-gray-500">
        Sorry, that community does not exist or has been banned
      </h1>
      <Link to={"/"}>
        <button className="rounded-full bg-rose-500 px-4 py-2 text-white">
          Go home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
