import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Td,
  Tr
} from '@chakra-ui/react'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useFornecedores } from '../../../../services/hooks/useFornecedores'
import { useProdutos } from '../../../../services/hooks/useProdutos'
import { dateFormatter } from '../../../../../utils/masks'
import { api } from '../../../../services/apiClient'
import { queryClient } from '../../../../services/queryClient'

const TableContent = () => {
  const router = useRouter()
  const toast = useToast()

  const { data, isSuccess } = useFornecedores()
  const { data: produtosData, isSuccess: produtosIsSuccess } = useProdutos()

  const handleDelete = async id => {
    await api
      .delete(`/fornecedores/deletar/${id}`)
      .then(() => {
        toast({
          title: 'Cadastro criado.',
          description: 'Cadastro realizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true
        }),
          queryClient.invalidateQueries('fornecedores')
      })
      .catch(err => {
        toast({
          title: 'Erro ao deletar.',
          description: 'Erro.',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
  }

  return (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>-</Th>
            <Th>Ativo</Th>
            <Th>Nome</Th>
            <Th>Produtos</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isSuccess &&
            data.map((item, index) => {
              const { nome, id, updated_at, ativo } = item
              const countProducts =
                produtosIsSuccess &&
                produtosData.produtos.filter(marca => marca.marca_id === id)
                  .length
              return (
                <Tr key={index}>
                  <Td>
                    <AiFillCheckCircle
                      size={20}
                      color={ativo === 1 ? 'green' : 'red'}
                    />
                  </Td>
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
                        {nome}
                      </MenuButton>
                      <MenuList bg="black" borderColor="transparent">
                        <MenuItem
                          onClick={() =>
                            router.push(`/admin/fornecedores/editar/${id}`)
                          }
                        >
                          Editar
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(id)}>
                          Excluir
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>{countProducts}</Td>
                  <Td>{dateFormatter(updated_at)}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default TableContent
