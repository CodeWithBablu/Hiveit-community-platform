import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';
import { useNavigate } from "react-router-dom";

type HitProps = {
  hit: {
    communityId: string,
    imageURL: string
  }
}
export const Hit = ({ hit }: HitProps) => {

  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/h/${hit.communityId}`)} className="hit-communityId cursor-pointer">
      <div className="flex items-center gap-4 font-poppins font-medium tracking-wider hover:bg-zinc-900/70 rounded-md py-2 px-4 cursor-pointer">
        <img src={hit.imageURL ? hit.imageURL : "/profile.png"} className="h-[40px] w-[40px] rounded-full" alt="comm img" />
        <h3>{hit.communityId}</h3>
      </div>
    </div>
  );
};