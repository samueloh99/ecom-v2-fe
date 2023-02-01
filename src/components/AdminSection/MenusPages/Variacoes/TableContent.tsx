import NextLink from 'next/link'

import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Popover,
  Icon,
  Spinner,
  PopoverTrigger as OrigPopoverTrigger,
  useToast,
  PopoverContent,
  PopoverBody,
  Td,
  Portal,
  Button,
  Tr
} from '@chakra-ui/react'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useVariacoes } from '../../../../services/hooks/useVariacoes'
import { useMutation } from 'react-query'
import { api } from '../../../../services/apiClient'
import { queryClient } from '../../../../services/queryClient'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableContent = () => {
  const { data: dataVariacoes, isLoading: loadingVariacoes } = useVariacoes()

  const toast = useToast()

  const router = useRouter()

  const deleteVariacao = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/variacoes/apagar/${id}`)

        toast({
          title: 'Sucesso ao apagar.',
          description: 'Variacao foi apagada com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao apagar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('variacoes')
        router.push('/admin/variacoes')
      }
    }
  )

  const handleDeleteVariacao = async (id: number) => {
    await deleteVariacao.mutateAsync(id)
  }

  return loadingVariacoes ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>SubVariacoes</Th>
            <Th>Ativo</Th>
            <Th>Nome</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataVariacoes
            .filter(item => !item.pai_id)
            .map((item, index) => {
              const { nome, id, updated_at } = item

              const subVariacoes = dataVariacoes.filter(
                sub => sub.pai_id === item.id
              ).length

              return (
                <Tr key={index}>
                  <NextLink href={`variacoes?parentVariacoes=${item.id}`}>
                    <Td cursor="pointer" textDecoration="underline">
                      {subVariacoes}
                    </Td>
                  </NextLink>
                  <Td>
                    <Icon
                      fontSize={20}
                      color={item.ativo === 1 ? 'green' : 'red'}
                      as={AiFillCheckCircle}
                    />
                  </Td>
                  <Td>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          bg="transparent"
                          textDecoration="underline"
                          _hover={{ bg: 'none' }}
                        >
                          {nome}
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
                              href={`/admin/variacoes/editar/${id}`}
                              passHref
                            >
                              <a>
                                <Button w="100%">Editar</Button>
                              </a>
                            </NextLink>

                            <Button onClick={() => handleDeleteVariacao(id)}>
                              Excluir
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
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
    </Flex>
  )
}

export default TableContent
