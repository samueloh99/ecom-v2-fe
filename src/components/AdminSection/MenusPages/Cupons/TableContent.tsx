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
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useCupons } from '../../../../services/hooks/useCupons'

const TableContent = () => {
  const router = useRouter()
  const { data, isLoading } = useCupons()

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
            <Th>Desconto</Th>
            <Th>Código</Th>
            <Th>Frete-Grátis</Th>
            <Th>Qtd. Pedidos</Th>
            <Th>Compra Mínima</Th>
            <Th>Desconto Prod.</Th>
            <Th>Desconto Pgto.</Th>
            <Th>Válido até</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map((item, index) => {
              const {
                id,
                ativo,
                data_2,
                desconto_valor,
                codigo,
                frete_gratis,
                minimo_compra,
                total_pedidos,
                desconto_pagamento,
                desconto_produto,
                updated_at
              } = item
              return (
                <Tr key={index}>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={ativo === 1 ? 'green' : 'red'}
                    />
                  </Td>
                  <Td>{desconto_valor}</Td>
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
                        {codigo}
                      </MenuButton>
                      <MenuList bg="black" borderColor="transparent">
                        <MenuItem
                          onClick={() =>
                            router.push(`/admin/descontos/editar/${id}`)
                          }
                        >
                          Editar Cupom
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={frete_gratis === 1 ? 'green' : 'red'}
                    />
                  </Td>
                  <Td>{total_pedidos}</Td>
                  <Td>{minimo_compra}</Td>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={desconto_produto === 1 ? 'green' : 'red'}
                    />
                  </Td>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={desconto_pagamento === 1 ? 'green' : 'red'}
                    />
                  </Td>
                  <Td>
                    {new Date(data_2).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Td>
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
      {/* <Pagination /> */}
    </Flex>
  )
}

export default TableContent
