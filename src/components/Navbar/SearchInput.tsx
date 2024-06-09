import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";


// type Props = {
//   // user:
// }

const SearchInput = () => {
  return (
    <div className="flex-1 mx-2 lg:max-w-xl">
      <InputGroup className="outline-none">
        <InputLeftElement pointerEvents='none' height={12}>
          <RiSearch2Line size={20} color="red" />
        </InputLeftElement>
        <Input className="font-poppins font-normal outline-none"
          placeholder='Find community or post...'
          fontSize="12pt"
          height={12}
          borderColor='gray.600'
          _placeholder={{ color: "gray.500" }}
          _hover={{
            outline: "none",
            border: "1px solid",
            borderColor: 'gray.500'
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "gray.200",
          }}
          focusBorderColor="none"
          style={{ padding: '0px 10px 5px 40px' }} type='text' />
      </InputGroup>
    </div>
  )
}

export default SearchInput