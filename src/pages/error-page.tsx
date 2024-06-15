import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <div
        id="error-page"
        className="flex h-[600px] w-full items-center justify-center bg-zinc-950"
      >
        <div className="text-center">
          <h1 className="my-3 font-poppins text-3xl font-semibold text-orange-600">
            Oops!
          </h1>
          <p className="my-2 text-xl text-gray-500">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="text-rose-400">
            <i>
              {'"'}
              {error instanceof Error && error.message}
              {String(error)}
              {'"'}
            </i>
          </p>
        </div>
      </div>
    </>
  );
}
