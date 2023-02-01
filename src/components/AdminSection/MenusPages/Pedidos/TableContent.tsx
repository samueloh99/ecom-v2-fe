import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Td,
  Text,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tr,
  Badge
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { usePedidos } from '../../../../services/hooks/usePedidos'
import { translateOrderStatus } from '../../../../../utils/masks'

const TableContent = () => {
  const { push, query } = useRouter()
  const [page, setPage] = useState(1)

  const filterArray = Object.keys(query)
    .map(item => {
      return item + '=' + query[item]
    })
    .join('&')

  const { data, isLoading } = usePedidos(page, filterArray)
  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Código</Th>
            <Th>Cliente</Th>
            <Th>Frete</Th>
            <Th>Pagamento</Th>
            <Th>Produtos</Th>
            <Th>Frete</Th>
            <Th>Pedido Total</Th>
            <Th>Compra Aprovado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pedidos.map((item, index) => {
            const {
              usuario,
              id,
              usuario_id,
              pedido_total,
              enderecoFk,
              frete_valor,
              frete_titulo,
              pagamento_nome,
              status_pagamento,
              pedido_geral,
              created_at
            } = item
            return (
              <Tr key={index}>
                <Td>
                  <Badge
                    colorScheme={translateOrderStatus(status_pagamento).color}
                  >
                    {translateOrderStatus(status_pagamento).value}
                  </Badge>
                </Td>
                <Td>
                  <Text>{id}</Text>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton textDecoration="underline">
                      {usuario.nome_completo.toUpperCase()}
                    </MenuButton>
                    <MenuList bg="black" color="white">
                      <MenuItem
                        onClick={() =>
                          push({
                            pathname: `/admin/pedidos/editar/${id}`
                          })
                        }
                      >
                        Ver o pedido
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          push({
                            pathname: `/admin/clientes/editar/${usuario_id}`
                          })
                        }
                      >
                        Vizualizar o cliente
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
                <Td>
                  <Text>{frete_titulo}</Text>
                  <Text>{enderecoFk.cep}</Text>
                </Td>
                <Td>{pagamento_nome}</Td>
                <Td>R$ {pedido_total.toFixed(2)}</Td>
                <Td>R$ {frete_valor.toFixed(2)}</Td>
                <Td>R$ {pedido_geral.toFixed(2)}</Td>
                <Td>
                  {new Date(created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        totalCount={data.pag.encontrados}
        totalPerPage={data.pag.exibindo}
        onPageChange={setPage}
      />
    </Flex>
  )
}

export default TableContent
