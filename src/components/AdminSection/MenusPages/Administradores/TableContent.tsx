import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Spinner,
  Text,
  Td,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from '@chakra-ui/react'

import { AiFillCheckCircle } from 'react-icons/ai'
import { useClientes } from '../../../../services/hooks/useClientes'
import { dateFormatter } from '../../../../../utils/masks'

const TableContent = () => {
  const router = useRouter()
  const { data, isLoading, isSuccess } = useClientes()

  const users =
    isSuccess &&
    data.usuarios.filter(item =>
      item.roles.find(item => item.nome === 'admin' || item.nome === 'colab')
    )

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
            <Th>Nome</Th>
            <Th>Nível</Th>
            <Th>Cadastrado/Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((item, index) => {
            const { ativo, id, nome_completo, roles, updated_at, created_at } =
              item

            const findAdmin = roles.find(
              item => item.nome === 'admin' || item.nome === 'colab'
            )
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
                      {nome_completo}
                    </MenuButton>
                    <MenuList bg="black" borderColor="transparent">
                      <MenuItem
                        _focus={{ bg: 'black' }}
                        onClick={() =>
                          router.push(`/admin/administradores/editar/${id}`)
                        }
                      >
                        Editar Cliente
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
                <Td>{findAdmin.descricao}</Td>
                <Td>
                  <Text>{dateFormatter(created_at)}</Text>
                  <Text>{dateFormatter(updated_at)}</Text>
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
