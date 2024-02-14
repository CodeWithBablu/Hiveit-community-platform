import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";


// type Props = {
//   // user:
// }

const SearchInput = () => {
  return (
    <div className="flex-1 mx-2 lg:max-w-xl">
      <InputGroup>
        <InputLeftElement className=" p-2" pointerEvents='none'>
          <RiSearch2Line size={20} color="red" className="" />
        </InputLeftElement>
        <Input className="font-poppins font-medium"
          placeholder='Find community or post...'
          fontSize="12pt"
          borderColor='gray.600'
          _placeholder={{ color: "gray.500" }}
          _hover={{
            border: "1px solid",
            borderColor: 'gray.400'
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "purple.300"
          }}
          style={{ padding: '0px 10px 0px 40px' }} type='text' />
      </InputGroup>
    </div>
  )
}

export default SearchInput