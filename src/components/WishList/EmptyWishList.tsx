import React from 'react'

import { useRouter } from 'next/router'

import { Text, Icon, Button, HStack, VStack } from '@chakra-ui/react'

import { FiHeart } from 'react-icons/fi'

const EmptyWishList = () => {
  const { push } = useRouter()

  return (
    <VStack h="50vh" align="center" spacing="30px" pt="30px">
      <VStack>
        <Text fontWeight="bold">LISTA DE DESEJO</Text>
        <Text>
          Você não possui nenhum produto favoritado ? Nunca é tarde para
          começar.
        </Text>
        <HStack>
          <Text>
            Para não perder seus produtos favoritos de vista é só tocar no{' '}
          </Text>
          <Icon as={FiHeart} fontSize={20} color="black" />
          <Text>e eles aparecerão nessa lista.</Text>
        </HStack>
      </VStack>

      <Button
        bg="black"
        color="white"
        w="240px"
        onClick={() => push({ pathname: '/categorias/13' })}
      >
        VER NOVIDADES
      </Button>
    </VStack>
  )
}

export default EmptyWishList
