import "/style/search.css";
import { InputGroup, InputLeftElement, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

import algoliasearch from "algoliasearch/lite";
import { Hits, InstantSearch, SearchBox, Configure, SearchBoxProps } from "react-instantsearch";
import { Hit } from "./Hit";


type HitType = {
  objectID: string;
  communityId: string;
  imageURL: string;
  _highlightResult: {
    communityId: {
      [key: string]: string | number
    }
  },
  __position: number
}
const SearchInput = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [term, setTerm] = useState<string>("");

  const handleSearch = useDebouncedCallback(async (query: string, search) => {
    setTerm(query.trim());
    if (query.trim() !== "") {
      search(query.trim());
    }
  }, 1000);


  const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_PUBLIC_KEY);

  return (
    <div className="ml-auto md:mx-auto">

      <div className="hidden md:inline-block mx-2 max-w-80 flex-1 lg:max-w-xl cursor-pointer">
        <InputGroup className="outline-none">
          <InputLeftElement pointerEvents="none" height={12}>
            <RiSearch2Line size={20} color="red" />
          </InputLeftElement>
          <Input
            className="font-poppins font-normal outline-none"
            placeholder="Find community or post..."
            fontSize="12pt"
            height={12}
            borderColor="gray.700"
            onClick={onOpen}
            _placeholder={{ color: "gray.500" }}
            _hover={{
              outline: "none",
              border: "1px solid",
              borderColor: "gray.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "gray.500",
            }}
            focusBorderColor="none"
            style={{ padding: "0px 10px 5px 40px" }}
            type="text"
          />
        </InputGroup>
      </div>

      <div onClick={onOpen} className="mr-4 flex justify-center items-center md:hidden cursor-pointer">
        <RiSearch2Line className="text-secondary" />
      </div>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent backgroundColor={"blackAlpha.800"} width={'400px'} borderRadius={'10px'} marginTop={'100px'} className="backdrop-blur-2xl">
          <ModalHeader className="text-gray-400">Discover communities</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody className="w-full">
            <InstantSearch
              searchClient={searchClient}
              indexName={import.meta.env.VITE_ALGOLIA_INDEX}
            >
              <div className="ais-InstantSearch">
                <SearchBox queryHook={handleSearch} autoFocus placeholder="search communities..." />

                {term ? (
                  <>
                    <Configure hitsPerPage={5} />
                    <Hits hitComponent={({ hit }) => <Hit hit={(hit as unknown) as HitType} onClose={onClose} />} />
                  </>) : (
                  <p className="text-gray-400 font-medium">Please enter a search term to see results...</p>
                )}
              </div>
            </InstantSearch>
          </ModalBody>

        </ModalContent>
      </Modal>
    </div>
  );
};

export default SearchInput;
