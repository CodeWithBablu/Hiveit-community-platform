import { User } from "firebase/auth";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type Props = {
  user?: User | null;
};

const RightContent = ({ user }: Props) => {
  return (
    <div>
      <AuthModal />
      <div className="flex items-center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </div>
    </div>
  );
};

export default RightContent;
