import React, { useEffect, useState } from 'react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Popover,
  PopoverTrigger as OrigPopoverTrigger,
  PopoverContent,
  PopoverBody,
  Td,
  Portal,
  Img,
  Spinner,
  Button,
  Tr
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useSkus } from '../../../../services/hooks/useSkus'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

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

  const { data, isLoading } = useSkus(filterArray, page)

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
            <Th>Cód.</Th>
            <Th>Título</Th>
            <Th>Prod Ref.</Th>
            <Th>Sku Ref.</Th>
            <Th>Nome</Th>
            <Th>Variação 1</Th>
            <Th>Variação 2</Th>
            <Th>Estoque</Th>
            <Th>Custo</Th>
            <Th>Venda</Th>
            <Th>Peso</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.skus.map((item, index) => {
            const {
              ativo,
              id,
              foto1,
              estoque,
              peso,
              referencia,
              produto,
              var1fk,
              preco_custo,
              preco_venda,
              var2fk
            } = item
            return (
              <Tr key={index}>
                <Td>
                  <AiFillCheckCircle
                    color={ativo === 1 ? 'green' : 'red'}
                    size={20}
                  />
                </Td>
                <Td>{id}</Td>
                <Td>
                  <Img w="40px" src={foto1} />
                </Td>
                <Td>{produto.referencia}</Td>
                <Td>{referencia}</Td>
                <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        bg="transparent"
                        textDecoration="underline"
                        _hover={{ bg: 'none' }}
                      >
                        {produto.nome}
                      </Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent bg="transparent">
                        <PopoverBody
                          display="flex"
                          flexDirection="column"
                          bg="transparent"
                          p="0"
                        >
                          <NextLink href={`/admin/skus/editar/${id}`} passHref>
                            <a>
                              <Button w="100%">Editar</Button>
                            </a>
                          </NextLink>
                          <Button>Excluir</Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </Td>
                <Td>{var1fk.nome}</Td>
                <Td>{var2fk.nome}</Td>
                <Td>{estoque}</Td>
                <Td>{preco_custo}</Td>
                <Td>{preco_venda}</Td>
                <Td>{peso}</Td>
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
