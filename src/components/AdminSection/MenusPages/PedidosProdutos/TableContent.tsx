import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Td,
  Img,
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

import { usePedidosProdutos } from '../../../../services/hooks/usePedidosProdutos'
import { usePedidos } from '../../../../services/hooks/usePedidos'

const TableContent = () => {
  const { push, query } = useRouter()
  const [page, setPage] = useState(1)

  const filterArray = Object.keys(query)
    .map(item => {
      return item + '=' + query[item]
    })
    .join('&')

  const { data: produtoData, isSuccess: produtoIsSuccess } =
    usePedidosProdutos(filterArray)

  const { data: pedidoData, isSuccess: pedidoIsSuccess } = usePedidos()

  const router = useRouter()

  return !produtoIsSuccess && !pedidoIsSuccess && !pedidoData ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Pedido</Th>
            <Th>Cliente</Th>
            <Th>Foto</Th>
            <Th>Produto(SKU)</Th>
            <Th>Produto/Variação</Th>
            <Th>Quantidade</Th>
            <Th>Unitário/Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidoIsSuccess &&
            produtoIsSuccess &&
            produtoData.pedidosProdutos.map((item, index) => {
              const {
                quantidade,
                preco,
                pedido_id,
                produto_id,
                sku_id_fk,
                produto_id_fk
              } = item
              const pedidoinfo = pedidoData.pedidos.find(
                item => item.id === pedido_id
              )

              return (
                pedidoinfo && (
                  <Tr key={index}>
                    <Td>{pedidoinfo.id}</Td>
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
                          {pedidoinfo.usuario.nome_completo}
                        </MenuButton>
                        <MenuList bg="black" borderColor="transparent">
                          <MenuItem
                            onClick={() =>
                              router.push(
                                `/admin/pedidos/editar/${pedidoinfo.id}`
                              )
                            }
                          >
                            Ver pedido
                          </MenuItem>
                          <MenuItem>Ver Cliente</MenuItem>
                          <MenuItem
                            onClick={() =>
                              router.push(
                                `/admin/produtos/editar/${produto_id}`
                              )
                            }
                          >
                            Ver Produto
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td>
                      <Img src={sku_id_fk.foto1} w="60px" />
                    </Td>
                    <Td>
                      <Text>{sku_id_fk.id}</Text>
                      <Text>{sku_id_fk.referencia}</Text>
                    </Td>
                    <Td>
                      <Text>{produto_id_fk.nome}</Text>
                      <Text>Cor: {sku_id_fk.var1fk.nome}</Text>
                      <Text>Tamanho: {sku_id_fk.var2fk.nome}</Text>
                    </Td>
                    <Td>{quantidade}</Td>
                    <Td>
                      <Text>R${preco}</Text>
                      <Text>R${preco * quantidade}</Text>
                    </Td>
                  </Tr>
                )
              )
            })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalCount={produtoData && produtoData.pag.encontrados}
        totalPerPage={produtoData && produtoData.pag.exibindo}
      />
    </Flex>
  )
}

export default TableContent
