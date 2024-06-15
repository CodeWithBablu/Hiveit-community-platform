// type Props = {}

const Poll = () => {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-5">
      <h2 className="animate-pulse font-chillax text-2xl font-semibold">
        Coming soon
      </h2>
      <img
        className="h-20 w-fit object-contain sm:h-44"
        src="/coming-soon.png"
        alt="coming-soon"
      />
    </div>
  );
};

export default Poll;
