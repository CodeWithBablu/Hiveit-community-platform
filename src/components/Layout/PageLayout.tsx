import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const PageLayout = ({ children }: Props) => {

  return (
    <div className="flex w-full max-w-7xl m-auto text-white font-poppins">
      <div className="flex justify-center w-full lg:gap-10">
        <div className=" w-full lg:w-[65%] lg:max-w-[850px]">{children && children[0 as keyof typeof children]}</div>
        <div className=" hidden lg:flex flex-grow">{children && children[1 as keyof typeof children]}</div>
      </div>
    </div>
  )
}

export default PageLayout