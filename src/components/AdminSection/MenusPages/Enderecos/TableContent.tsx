import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  PopoverTrigger as OrigPopoverTrigger,
  Td,
  Text,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tr
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { useEnderecos } from '../../../../services/hooks/useEnderecos'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableContent = () => {
  const [page, setPage] = useState(1)
  const { query, push } = useRouter()

  const filterArray = Object.keys(query)
    .map(item => {
      return item + '=' + query[item]
    })
    .join('&')

  const { data, isLoading } = useEnderecos(filterArray)

  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>CEP</Th>
            <Th>Info</Th>
            <Th>Atualizado em</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.enderecos.map((item, index) => {
            const {
              id,
              usuario_id,
              cep,
              updated_at,
              destinatario,
              bairro,
              cidade,
              endereco,
              numero,
              pais,
              estado
            } = item
            return (
              <Tr key={index}>
                <Td>
                  <Text>{usuario_id}</Text>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      bg="transparent"
                      _focus={{ boxShadow: 'none' }}
                      _hover={{ bg: 'none' }}
                      _active={{ bg: 'none' }}
                      as={Button}
                      textDecoration="underline"
                    >
                      {cep}
                    </MenuButton>
                    <MenuList bg="black" borderColor="transparent">
                      <MenuItem
                        onClick={() => push(`/admin/enderecos/editar/${id}`)}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          push(`/admin/clientes/editar/${usuario_id}`)
                        }
                      >
                        Ver Cliente
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
                <Td>
                  <Text>{destinatario}</Text>
                  <Text>
                    {numero} - {endereco}
                  </Text>
                  <Text>{bairro}</Text>
                  <Text>{cidade}</Text>
                  <Text>
                    {estado}/{pais}
                  </Text>
                </Td>
                <Td>
                  {new Date(updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalCount={data && data.pag.encontrados}
        totalPerPage={data && data.pag.exibindo}
      />
    </Flex>
  )
}

export default TableContent
