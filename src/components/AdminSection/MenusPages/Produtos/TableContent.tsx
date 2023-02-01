import React, { useEffect, useState } from 'react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useDescontos } from '../../../../services/hooks/useDescontos'
import { useMutation } from 'react-query'
import { api } from '../../../../services/apiClient'
import { queryClient } from '../../../../services/queryClient'
import { useProdutos } from '../../../../services/hooks/useProdutos'

import { dateFormatter } from '../../../../../utils/masks'

const TableContent = () => {
  const { query } = useRouter()
  const [page, setPage] = useState(1)

  const filterArray = Object.keys(query)
    .map(item => {
      return item + '=' + query[item]
    })
    .join('&')

  useEffect(() => {
    if (filterArray) {
      setPage(1)
    }
  }, [query])

  const toast = useToast()

  const { data: productsData } = useProdutos(filterArray, page)

  const { isSuccess: descontoIsSuccess, data: descontoData } = useDescontos()

  const deleteProduto = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/produtos/apagar/${id}`)

        toast({
          title: 'Sucesso ao excluir.',
          description: 'Produto foi excluido com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao excluir.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('produtos')
      }
    }
  )

  const handleDeleteProduto = async (id: number) => {
    await deleteProduto.mutateAsync(id)
  }
  return (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Ativo</Th>
            <Th>Cod.</Th>
            <Th>Título</Th>
            <Th>Referencia</Th>
            <Th>Preço</Th>
            <Th>Desconto</Th>
            <Th>Estoque</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productsData &&
            productsData.produtos.map((item, index) => {
              const {
                nome,
                id,
                referencia,
                estoque,
                updated_at,
                ativo,
                preco
              } = item
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
                      <MenuButton textDecoration="underline">{nome}</MenuButton>
                      <MenuList bg="black" color="white">
                        <NextLink
                          href={`/admin/produtos/editar/${id}`}
                          passHref
                          rel="noopener noreferrer"
                        >
                          <a>
                            <MenuItem>Editar Produto</MenuItem>
                          </a>
                        </NextLink>
                        <MenuItem onClick={() => handleDeleteProduto(id)}>
                          Excluir
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>{referencia}</Td>
                  <Td>R${preco[0]}</Td>
                  <Td>
                    {descontoIsSuccess &&
                      descontoData.filter(item => item.produto_id === id)
                        .length >= 1 &&
                      descontoData[0].desconto_tipo === 1 &&
                      'R$'}
                    {descontoIsSuccess &&
                      descontoData.filter(item => item.produto_id === id)
                        .length >= 1 &&
                      descontoData[0].desconto_valor}
                    {descontoIsSuccess &&
                      descontoData.filter(item => item.produto_id === id)
                        .length >= 1 &&
                      descontoData[0].desconto_tipo === 2 &&
                      '%'}
                  </Td>
                  <Td>{estoque}</Td>
                  <Td>{dateFormatter(updated_at)}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalCount={productsData && productsData.pag.encontrados}
        totalPerPage={productsData && productsData.pag.exibindo}
      />
    </Flex>
  )
}

export default TableContent
