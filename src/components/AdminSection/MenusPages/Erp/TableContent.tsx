import React from 'react'

import { Stack, Center, useDisclosure } from '@chakra-ui/react'

import ModalBling from './bling/ModalBling'

const TableContent = () => {
  const {
    isOpen: isOpenBling,
    onOpen: onOpenBling,
    onClose: onCloseBling
  } = useDisclosure()
  return (
    <Stack direction="row">
      <Center
        bg="pink.500"
        h="50px"
        w="150px"
        color="white"
        cursor="pointer"
        borderRadius={5}
        transition="0.5s"
        _hover={{ bg: 'pink.700' }}
        onClick={() => onOpenBling()}
      >
        Bling
      </Center>
      <ModalBling onClose={onCloseBling} isOpen={isOpenBling} />
    </Stack>
  )
}

export default TableContent
