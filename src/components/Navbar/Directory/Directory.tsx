import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import Communities from "./Communities";
import { RiArrowDropDownLine } from "@remixicon/react";

const homeicon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-none stroke-slate-200"
  >
    <path
      d="M12 18V15"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Directory = () => {
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "whiteAlpha.200" }}
        className="mx-1 h-10 rounded-md px-2"
      >
        <div className="flex items-center justify-between space-x-1">
          {homeicon}
          <span className="hidden font-poppins text-sm font-medium sm:inline-block">
            Home
          </span>
          <RiArrowDropDownLine size={20} />
        </div>
      </MenuButton>
      <MenuList
        zIndex={20}
        boxShadow={"0px 0px 15px 0px rgba(225,225,225,0.3)"}
        padding={"10px 10px"}
        color={"gray.400"}
        borderRadius={10}
        borderColor="gray.600"
        bgColor="blackAlpha.900"
        className="flex flex-col items-center p-2"
      >
        <Communities />
      </MenuList>
    </Menu>
  );
};

export default Directory;
