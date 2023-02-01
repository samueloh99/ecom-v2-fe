import React from 'react'

import NextLink from 'next/link'

import { Stack, Center, useDisclosure } from '@chakra-ui/react'

import ModalPagarme from './pagarme/ModalPagarme'
import ModalParcelamento from './pagarme/ModalParcelamento'

const TableContent = () => {
  const {
    isOpen: isOpenPagarme,
    onOpen: onOpenPagarme,
    onClose: onClosePagarme
  } = useDisclosure()

  const {
    isOpen: isOpenParcelamento,
    onOpen: onOpenParcelamento,
    onClose: onCloseParcelamento
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
        onClick={() => onOpenPagarme()}
      >
        Pagarme
      </Center>
      <ModalPagarme onClose={onClosePagarme} isOpen={isOpenPagarme} />

      <Center
        bg="pink.500"
        h="50px"
        w="150px"
        color="white"
        cursor="pointer"
        borderRadius={5}
        transition="0.5s"
        _hover={{ bg: 'pink.700' }}
        onClick={() => onOpenParcelamento()}
      >
        Parcelamento
      </Center>
      <ModalParcelamento
        onClose={onCloseParcelamento}
        isOpen={isOpenParcelamento}
      />
      <Center
        bg="gray"
        h="50px"
        w="150px"
        color="white"
        borderRadius={5}
        transition="0.5s"
      >
        Getnet
      </Center>
      <Center
        bg="gray"
        h="50px"
        w="150px"
        color="white"
        borderRadius={5}
        transition="0.5s"
      >
        Pagseguro
      </Center>
      <Center
        bg="gray"
        h="50px"
        w="150px"
        color="white"
        borderRadius={5}
        transition="0.5s"
      >
        Mercado Pago
      </Center>
    </Stack>
  )
}

export default TableContent
