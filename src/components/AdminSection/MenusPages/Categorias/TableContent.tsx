import React from 'react'

import NextLink from 'next/link'

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
  useToast,
  Portal,
  Button,
  Tr,
  Text
} from '@chakra-ui/react'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useCategorias } from '../../../../services/hooks/useCategorias'
import { useProdutos } from '../../../../services/hooks/useProdutos'
import { useMutation } from 'react-query'
import { queryClient } from '../../../../services/queryClient'
import { api } from '../../../../services/apiClient'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableContent = () => {
  const { data, isLoading } = useCategorias()
  const { data: dataProd, isSuccess: isSuccessProd } = useProdutos(
    '',
    1,
    9999999
  )

  const toast = useToast()

  const countProdByCat = (id: number) => {
    const filterSubCategory =
      dataProd &&
      dataProd.produtos.filter(
        item => item.sub_categorias_ids && item.sub_categorias_ids.includes(id)
      ).length
    const filterMainCategory =
      isSuccessProd &&
      dataProd.produtos.filter(item => item.categoria_id === id).length

    return filterMainCategory + filterSubCategory
  }

  const deleteCategoria = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/categorias/apagar/${id}`)

        toast({
          title: 'Sucesso ao excluir.',
          description: 'Categoria foi excluido com sucesso',
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
        queryClient.invalidateQueries('categorias')
        queryClient.resetQueries()
      }
    }
  )

  const handleDeleteCategoria = async (id: number) => {
    await deleteCategoria.mutateAsync(id)
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
            <Th>Código</Th>
            <Th>SubCategorias</Th>
            <Th>Nome</Th>
            <Th>Produtos</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data
            .filter(item => item.pai_id === 0)
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
                  <Td>{item.id}</Td>
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
                            <NextLink
                              href={`categorias/editar/${item.id}`}
                              passHref
                            >
                              <a>
                                <Button w="100%">Editar</Button>
                              </a>
                            </NextLink>
                            <Button
                              onClick={() => handleDeleteCategoria(item.id)}
                            >
                              Excluir
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </Td>
                  <Td>
                    <Text>{`${countProdByCat(item.id)}`}</Text>
                  </Td>
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
    </Flex>
  )
}

export default TableContent
