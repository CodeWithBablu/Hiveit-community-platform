import { User } from "firebase/auth";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";
import SideDrawer from "@/components/Layout/SideDrawer";

type Props = {
  user?: User | null;
};

const RightContent = ({ user }: Props) => {

  return (
    <div className="shrink-0">
      <AuthModal />
      <div className="flex items-center">
        {user ? <Icons /> : <AuthButtons />}
        {user && <UserMenu user={user} />}

        <div className="flex xl:hidden ml-1 md:ml-3">
          <SideDrawer />
        </div>

      </div>
    </div>
  );
};

export default RightContent;
