import React from 'react'

import NextLink from 'next/link'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Td,
  Portal,
  Link,
  Button,
  Tr
} from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { AiFillCheckCircle } from 'react-icons/ai'

const TableContent = () => {
  return (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Ativo</Th>
            <Th>Foto</Th>
            <Th>Código</Th>
            <Th>Título</Th>
            <Th>Desconto</Th>
            <Th>Produtos</Th>
            <Th>Válido de</Th>
            <Th>Válido até</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* {data &&
            data.map((item, index) => {
              const { nome, id, referencia, atualizado, estoque } = item
              return (
                <Tr key={index}>
                  <Td>
                    <AiFillCheckCircle size={20} />
                  </Td>
                  <Td>Sku</Td>
                  <Td>Foto</Td>
                  <Td>{id}</Td>
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
                            <NextLink href={`/admin/produtos/editar/${id}`}>
                              <Button>Editar</Button>
                            </NextLink>
                            <NextLink href={`/admin/produtos/editar/${id}`}>
                              <Button>Vizualizar na Loja</Button>
                            </NextLink>
                            <NextLink href={`/admin/produtos/editar/${id}`}>
                              <Button>Duplicar</Button>
                            </NextLink>
                            <NextLink href={`/admin/produtos/editar/${id}`}>
                              <Button>Excluir</Button>
                            </NextLink>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </Td>
                  <Td>{referencia}</Td>
                  <Td>Variação 1</Td>
                  <Td>Variação 2</Td>
                  <Td>{estoque}</Td>
                  <Td>custo</Td>
                  <Td>venda</Td>
                  <Td>peso</Td>
                </Tr>
              )
            })} */}
        </Tbody>
      </Table>
      {/* <Pagination /> */}
    </Flex>
  )
}

export default TableContent
