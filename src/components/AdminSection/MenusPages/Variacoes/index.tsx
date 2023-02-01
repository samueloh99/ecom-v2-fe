import React from 'react'

import { useRouter } from 'next/router'

import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  HStack
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

import Header from './Header'

import TableContent from './TableContent'
import { useVariacoes } from '../../../../services/hooks/useVariacoes'
import TableContentSubVariacoes from './TableContentSubVariacoes'

const AdminVariacoes = () => {
  const { data, isSuccess } = useVariacoes()

  const router = useRouter()

  const idParent = router.query['parentVariacoes']

  const nameSubVariacoes =
    isSuccess && data.find(item => String(item.id) === idParent)

  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          Variações
          {nameSubVariacoes === undefined ? (
            ''
          ) : (
            <HStack mt="5px">
              <Text>{nameSubVariacoes.nome}</Text>
              <Button colorScheme="pink" onClick={() => router.back()}>
                <Icon as={IoMdArrowRoundBack} />
                Voltar
              </Button>
            </HStack>
          )}
        </Heading>
        <Header />
      </Flex>
      {router.query['parentVariacoes'] !== undefined ? (
        <TableContentSubVariacoes />
      ) : (
        <TableContent />
      )}
    </Stack>
  )
}

export default AdminVariacoes
