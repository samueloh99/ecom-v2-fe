import React from 'react'

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
  Icon,
  Spinner,
  Td,
  Portal,
  Button,
  Tr
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useCategorias } from '../../../../services/hooks/useCategorias'
import { useProdutos } from '../../../../services/hooks/useProdutos'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableContentSubCategories = () => {
  const router = useRouter()

  const parentId = router.query['parentCategory'] as string

  const { data, isLoading } = useCategorias()
  const { data: dataProd, isSuccess: isSuccessProd } = useProdutos()

  const countProdByCat = (id: number) => {
    const filtered =
      isSuccessProd &&
      dataProd.produtos.filter(item => item.categoria_id === id).length

    return filtered
  }

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
            <Th>SubCategorias</Th>
            <Th>Nome</Th>
            <Th>Produtos</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data
            .filter(item => item.pai_id === parseInt(parentId))
            .map((item, index) => {
              const subcategorias = data.filter(
                sub => sub.pai_id === item.id
              ).length

              return (
                <Tr key={index}>
                  <Td>
                    <Icon
                      fontSize={20}
                      color={item.ativo === 1 ? 'green' : 'red'}
                      as={AiFillCheckCircle}
                    />
                  </Td>
                  <NextLink href={`categorias?parentCategory=${item.id}`}>
                    <Td cursor="pointer" textDecoration="underline">
                      {subcategorias}
                    </Td>
                  </NextLink>

                  <Td>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          bg="transparent"
                          textDecoration="underline"
                          _hover={{ bg: 'none' }}
                        >
                          {item.nome}
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
                            <NextLink href={`categorias/editar/${item.id}`}>
                              <Button w="100%">Editar</Button>
                            </NextLink>
                            <Button
                              onClick={() => console.log('delete:', item.id)}
                            >
                              Excluir
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </Td>
                  <Td>{countProdByCat(item.id)}</Td>
                  <Td>
                    {new Date(item.updated_at).toLocaleDateString('pt-BR', {
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
      {/* <Pagination /> */}
    </Flex>
  )
}

export default TableContentSubCategories
