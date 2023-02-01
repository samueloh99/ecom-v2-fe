import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Spinner,
  Text,
  Td,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useClientes } from '../../../../services/hooks/useClientes'
import { usePedidos } from '../../../../services/hooks/usePedidos'

const TableContent = () => {
  const [page, setPage] = useState(1)
  const { query, push } = useRouter()

  const filterArray = Object.keys(query)
    .map(item => {
      return item + '=' + query[item]
    })
    .join('&')

  const { data, isLoading } = useClientes(filterArray)
  const { data: dataPedidos, isSuccess: successPedidos } = usePedidos()

  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Ativo</Th>
            <Th>Código</Th>
            <Th>Nome/Email</Th>
            <Th>Tel1/Tel2</Th>
            <Th>Nascimento</Th>
            <Th>Pedidos</Th>
            <Th>Newsletter</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            successPedidos &&
            data.usuarios.map((item, index) => {
              const {
                ativo,
                id,
                nome_completo,
                telefone,
                celular,
                nascimento,
                newsletter,
                updated_at
              } = item
              const countPedidos =
                successPedidos &&
                dataPedidos.pedidos.filter(item => item.usuario_id === id)
                  .length
              return (
                <Tr key={index}>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={ativo === 1 ? 'green' : 'red'}
                    />
                  </Td>
                  <Td>{id}</Td>
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
                        {nome_completo}
                      </MenuButton>
                      <MenuList bg="black" borderColor="transparent">
                        <MenuItem
                          onClick={() => push(`/admin/clientes/editar/${id}`)}
                        >
                          Editar Cliente
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>
                    <Text>{celular}</Text>
                    <Text>{telefone}</Text>
                  </Td>
                  <Td>
                    {new Date(nascimento).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Td>
                  <Td>{countPedidos}</Td>
                  <Td>{newsletter === 1 ? 'Inscrito' : 'Não inscrito'}</Td>
                  <Td>
                    {new Date(updated_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
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
