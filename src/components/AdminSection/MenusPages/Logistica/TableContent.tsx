import React from 'react'

import { Stack, Center, useDisclosure } from '@chakra-ui/react'

import ModalDeposito from './modals/ModalDeposito'
import ModalFretes from './modals/ModalFretes'
import ModalCorreios from './modals/ModalCorreios'

const TableContent = () => {
  const {
    isOpen: isOpenDeposito,
    onOpen: onOpenDeposito,
    onClose: onCloseDeposito
  } = useDisclosure()
  const {
    isOpen: isOpenFretes,
    onOpen: onOpenFretes,
    onClose: onCloseFretes
  } = useDisclosure()

  const {
    isOpen: isOpenCorreios,
    onOpen: onOpenCorreios,
    onClose: onCloseCorreios
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
        onClick={() => onOpenDeposito()}
      >
        Depósito
      </Center>
      <ModalDeposito onClose={onCloseDeposito} isOpen={isOpenDeposito} />
      <Center
        bg="pink.500"
        h="50px"
        w="150px"
        color="white"
        cursor="pointer"
        borderRadius={5}
        transition="0.5s"
        _hover={{ bg: 'pink.700' }}
        onClick={() => onOpenFretes()}
      >
        Fretes
      </Center>
      <ModalFretes onClose={onCloseFretes} isOpen={isOpenFretes} />

      <Center
        bg="pink.500"
        h="50px"
        w="150px"
        color="white"
        cursor="pointer"
        borderRadius={5}
        transition="0.5s"
        _hover={{ bg: 'pink.700' }}
        onClick={() => onOpenCorreios()}
      >
        Correios
      </Center>
      <ModalCorreios onClose={onCloseCorreios} isOpen={isOpenCorreios} />
    </Stack>
  )
}

export default TableContent
