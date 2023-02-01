import React from 'react'

import { useRouter } from 'next/router'

import BaseTemplate from '../Base'

import { Flex, Text } from '@chakra-ui/react'

export const ErrorPage = () => {
  const { push } = useRouter()
  return (
    <BaseTemplate>
      <Flex
        h="70vh"
        direction="column"
        w="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontWeight="bold" fontSize="100px">
          404
        </Text>
        <Text>PÁGINA NÃO ENCONTRADA</Text>
        <Flex
          bg="black"
          color="white"
          p="10px 20px"
          cursor="pointer"
          mt="30px"
          onClick={() => push({ pathname: '/' })}
        >
          VOLTE PARA O SITE
        </Flex>
      </Flex>
    </BaseTemplate>
  )
}

export default ErrorPage
