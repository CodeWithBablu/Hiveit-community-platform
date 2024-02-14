import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className=" flex flex-col gap-4 justify-center items-center  w-full min-h-[600px] font-poppins font-medium text-xl">
      <h1 className=" text-gray-500">Sorry, that community does not exist or has been banned</h1>
      <Link to={'/'}>
        <button className=" text-white bg-rose-500 px-4 py-2 rounded-full">Go home</button>
      </Link>
    </div>
  )
}

export default NotFound