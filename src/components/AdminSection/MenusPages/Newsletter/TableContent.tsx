import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Spinner,
  Td,
  Tr
} from '@chakra-ui/react'

import { useClientes } from '../../../../services/hooks/useClientes'

const TableContent = () => {
  const router = useRouter()
  const { data, isSuccess, isLoading } = useClientes()

  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Data</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.usuarios.map((item, index) => {
              const { nome_completo, created_at, newsletter, email } = item

              return (
                newsletter === 1 && (
                  <Tr key={index}>
                    <Td>{nome_completo}</Td>
                    <Td>{email}</Td>
                    <Td>
                      {new Date(created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </Td>
                  </Tr>
                )
              )
            })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default TableContent
