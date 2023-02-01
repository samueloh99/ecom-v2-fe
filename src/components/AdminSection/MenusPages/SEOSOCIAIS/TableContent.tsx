import React from 'react'

import { Stack, Center, useDisclosure } from '@chakra-ui/react'

import ModalIntegracoes from './modals/ModalIntegracoes'
import ModalSociais from './modals/ModalSociais'

const TableContent = () => {
  const {
    isOpen: isOpenIntegracoes,
    onOpen: onOpenIntegracoes,
    onClose: onCloseIntegracoes
  } = useDisclosure()

  const {
    isOpen: isOpenSociais,
    onOpen: onOpenSociais,
    onClose: onCloseSociais
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
        onClick={() => onOpenIntegracoes()}
      >
        Integracoes
      </Center>
      <ModalIntegracoes
        onClose={onCloseIntegracoes}
        isOpen={isOpenIntegracoes}
      />
      <Center
        bg="pink.500"
        h="50px"
        w="150px"
        color="white"
        cursor="pointer"
        borderRadius={5}
        transition="0.5s"
        _hover={{ bg: 'pink.700' }}
        onClick={() => onOpenSociais()}
      >
        Sociais
      </Center>
      <ModalSociais onClose={onCloseSociais} isOpen={isOpenSociais} />
    </Stack>
  )
}

export default TableContent
