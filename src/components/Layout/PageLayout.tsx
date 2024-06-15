import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PageLayout = ({ children }: Props) => {
  return (
    <div className="m-auto flex w-full max-w-7xl font-poppins text-white">
      <div className="flex w-full justify-center lg:gap-10">
        <div className="w-full lg:w-[65%] lg:max-w-[850px]">
          {children && children[0 as keyof typeof children]}
        </div>
        <div className="hidden flex-grow lg:flex">
          {children && children[1 as keyof typeof children]}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
