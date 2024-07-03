import clsx from "clsx";
import { ReactNode } from "react";
import { useLocation, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  maxWidth?: string;
};

const PageLayout = ({ children, maxWidth }: Props) => {

  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isCommunityPage = location.pathname.startsWith('/h/');
  // const isCommentsPage = location.pathname.includes('/comments')
  const isSubmitPage = location.pathname.endsWith('/submit');

  return (
    <div style={{ maxWidth: `${maxWidth ? maxWidth : '1300px'}` }} className={`mx-auto min-h-[calc(100dvh-64px)] flex w-full font-poppins lg:px-4 text-white`}>
      <div className="flex w-full justify-center lg:gap-5">
        <div className={clsx(
          'flex flex-grow',
          {
            'border-x-[1px] lg:border-none border-dimGray w-full max-w-[950px]': (isCommunityPage || isHomePage) && !isSubmitPage,
            'w-full xl:w-[65%] xl:max-w-[860px]': isSubmitPage,
          }
        )}>
          <Sidebar />
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
