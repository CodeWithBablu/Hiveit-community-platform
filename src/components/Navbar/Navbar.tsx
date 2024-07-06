import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";
import useDirectory from "@/hooks/useDirectory";
import { RiSearch2Line } from "@remixicon/react";
// import useWindowWidth from "@/hooks/useWindowWidth";

const defaultMenuItem = {
  displayText: "Home",
  link: "/",
};

const Navbar = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  // const windowWidth = useWindowWidth();

  return (
    <nav className="flex items-center justify-between border-b-[1px] border-dimGray bg-zinc-950 px-2 h-16 text-white xl:px-[5%]">
      {/* left corner */}
      <div className="relative z-10 cursor-pointer bg-transparent">
        <div className="relative z-10 flex h-10 items-center gap-2 md:h-12">
          <div onClick={() => onSelectMenuItem(defaultMenuItem)} className="flex items-center gap-2">
            <img
              className="h-[30px] w-[30px] rounded-full sm:h-[40px] sm:w-[40px]"
              src="/Hiveit.png"
              alt=""
            />
            <h1 className="hidden font-chillax text-xl font-medium sm:inline-block lg:text-2xl">
              hive<span className="text-secondary">i</span>t
            </h1>
          </div>
          {user && <Directory />}
        </div>

        <div className="blob absolute left-0 top-0">
          <div className="absolute -top-4 left-0 h-12 w-12 animate-blob rounded-full bg-rose-600 opacity-60 mix-blend-multiply blur-xl delay-0 md:left-0"></div>
          <div className="delay-5000 absolute -top-4 left-8 h-12 w-12 animate-blob rounded-full bg-teal-600 opacity-60 mix-blend-multiply blur-xl md:left-20"></div>
          <div className="delay-2000 absolute left-5 top-4 h-12 w-12 animate-blob rounded-full bg-gray-300 opacity-60 mix-blend-multiply blur-xl md:left-8"></div>
        </div>
      </div>

      {/* search section */}
      <SearchInput />

      {/* <Directory/> */}
      <RightContent user={user} />

    </nav>
  );
};

export default Navbar;
