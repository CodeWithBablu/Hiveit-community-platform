import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./RightContent/RightContent"
import SearchInput from "./SearchInput"
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";

const Navbar = () => {

  const [user] = useAuthState(auth);

  return (
    <nav className="flex items-center justify-between text-white py-2 px-2 xl:px-[5%] bg-zinc-950 border-b-[0.1px] border-gray-700">
      {/* left corner */}
      <div className=" relative cursor-pointer bg-transparent z-10">
        <div className=" relative h-10 md:h-12 z-10 flex gap-2 items-center">
          <img className=" w-6 h-6 sm:w-8 sm:h-8 rounded-full" src="/Hiveit.png" alt="" />
          <h1 className=" hidden sm:inline-block font-chillax font-medium text-xl lg:text-2xl">hive<span className=" text-secondary">i</span>t</h1>
          {user && <Directory />}
        </div>

        <div className=" blob absolute top-0 left-0">
          <div className=" absolute blur-xl -top-4 left-0 md:left-0 w-12 h-12 mix-blend-multiply bg-rose-500 opacity-70 rounded-full animate-blob delay-0"></div>
          <div className=" absolute blur-xl -top-4 left-8 md:left-20 w-12 h-12 mix-blend-multiply bg-teal-500 opacity-70 rounded-full animate-blob delay-5000"></div>
          <div className=" absolute blur-xl top-4 left-5 md:left-8 w-12 h-12 mix-blend-multiply bg-gray-200 opacity-70 rounded-full animate-blob delay-2000"></div>
        </div>
      </div>

      {/* search section */}
      <SearchInput />
      {/* <Directory/> */}
      <RightContent user={user} />

    </nav>
  )
}

export default Navbar