import React from 'react'

import Link from 'next/link'

import { useRouter } from 'next/router'

import {
  Th,
  Table,
  Thead,
  Tbody,
  Popover,
  Flex,
  PopoverTrigger as OrigPopoverTrigger,
  useToast,
  PopoverContent,
  PopoverBody,
  Td,
  Portal,
  Spinner,
  Tr,
  Button
} from '@chakra-ui/react'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useSkus } from '../../../../../../services/hooks/useSkus'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableSkuContent = () => {
  const { data, isSuccess, isLoading } = useSkus('', 1, 99999999)

  const toast = useToast()

  const router = useRouter()

  const { slug } = router.query

  const filteredSkus =
    isSuccess &&
    data.skus
      .filter(item => item.produto_id === parseInt(slug[0]))
      .sort((a, b) => a.var1fk.nome.localeCompare(b.var1fk.nome))

  const deleteSku = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/skus/apagar/${id}`)

        toast({
          title: 'Apagado com Sucesso.',
          description: 'O SKU foi apagado.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {}
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('skus')
        queryClient.resetQueries()
      }
    }
  )

  const handleDeleteSku = async id => {
    await deleteSku.mutateAsync(id)
  }

  return isLoading ? (
    <Flex p="10" justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Table colorScheme="whiteAlpha" m="auto" mt="20" width="100%">
      <Thead>
        <Tr>
          <Th>Ativo</Th>
          <Th>Foto</Th>
          <Th>Cod.</Th>
          <Th>Referencia</Th>
          <Th>Variação 1</Th>
          <Th>Variação 2</Th>
          <Th>Estoque</Th>
          <Th>Custo</Th>
          <Th>Venda</Th>
          <Th>Peso</Th>
        </Tr>
      </Thead>

      <Tbody>
        {filteredSkus.map((item, index) => {
          const {
            ativo,
            id,
            referencia,
            estoque,
            preco_custo,
            preco_venda,
            var1fk,
            var2fk,
            peso
          } = item
          return (
            <Tr key={index}>
              <Td>
                <AiFillCheckCircle
                  size={20}
                  color={ativo === 1 ? 'green' : 'red'}
                />
              </Td>
              <Td>Foto</Td>
              <Td>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      bg="transparent"
                      textDecoration="underline"
                      _hover={{ bg: 'none' }}
                    >
                      {id}
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
                        <Link href={`/admin/skus/editar/${id}`}>
                          <Button>Editar</Button>
                        </Link>
                        <Button onClick={() => handleDeleteSku(id)}>
                          Excluir
                        </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Td>
              <Td>{referencia}</Td>
              <Td>{var1fk.nome}</Td>
              <Td>{var2fk.nome}</Td>
              <Td>{estoque}</Td>
              <Td>R${preco_custo}</Td>
              <Td>R${preco_venda}</Td>
              <Td>{peso}g</Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default TableSkuContent
