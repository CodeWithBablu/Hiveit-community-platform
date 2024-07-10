import clsx from "clsx";
import { ReactNode } from "react";
import { useLocation, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RiArrowUpDoubleLine } from "@remixicon/react";

type Props = {
  children: ReactNode;
  maxWidth?: string;
};

const PageLayout = ({ children, maxWidth }: Props) => {

  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isCommunityPage = location.pathname.startsWith('/h/');

  const isSubmitPage = location.pathname.endsWith('/submit');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div style={{ maxWidth: `${maxWidth ? maxWidth : '1300px'}` }} className={`relative mx-auto min-h-[calc(100dvh-64px)] flex w-full font-poppins lg:px-4 text-white`}>
      <div className="flex w-full justify-center lg:gap-5">
        <div className={clsx(
          'flex flex-grow',
          {
            ' w-full max-w-[650px] xl:max-w-[950px]': (isCommunityPage || isHomePage) && !isSubmitPage,
            'w-full xl:w-[65%] xl:max-w-[860px]': isSubmitPage,
          }
        )}>
          {!isSubmitPage && <Sidebar isDrawer={false} />}
          {children && children[0 as keyof typeof children]}
        </div>

        <div className="hidden lg:flex w-fit">
          {children && children[1 as keyof typeof children]}
        </div>

      </div>

      <div onClick={() => scrollToTop()} className="fixed bottom-4 right-2 z-20 flex justify-center pt-3 sm:pt-5 bg-blue-700 h-12 w-12 sm:h-14 sm:w-14 rounded-full">
        <RiArrowUpDoubleLine size={26} className="animate-bounce" />
      </div>

    </div>
  );
};

export default PageLayout;
