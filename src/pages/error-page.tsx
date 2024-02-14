import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <div id="error-page" className="flex items-center justify-center w-full h-[600px] bg-zinc-950">
        <div className=" text-center">
          <h1 className=" text-3xl text-orange-600 font-semibold font-poppins my-3">Oops!</h1>
          <p className=" text-xl text-gray-500 my-2">Sorry, an unexpected error has occurred.</p>
          <p className="text-rose-400">
            < i >
              {'"'}
              {error instanceof Error && error.message}
              {String(error)}
              {'"'}
            </i>
          </p>
        </div>
      </div >
    </>
  );
}