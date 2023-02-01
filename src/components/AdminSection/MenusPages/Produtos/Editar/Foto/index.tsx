import React from 'react'

import { useRouter } from 'next/router'

import {
  Th,
  Table,
  Thead,
  Tbody,
  Td,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tr,
  Button
} from '@chakra-ui/react'

type IProps = {
  produto: {
    id: number
    nome: string
    slug: string
    referencia: string
    ncm: string
    marca_id: number
    fornecedor_id: number
    categoria_id: number
    sub_categorias_ids: number[]
    tags: number[]
    comprimento: string
    altura: string
    largura: string
    descricao: string
    created_at: Date
    updated_at: Date
    ativo: number
    tipo_produto_id: number
    estoque: number
    preco: [number]
    variantes: [
      {
        idSku: number
        preco: number
        preco_desconto: number
        var1: string
        var1Foto: string
        sku_referencia: string
        var2: string
        estoque: number
        peso: number
        fotos: string[]
      }
    ]
    fornecedor: {
      id: number
      nome: string
      site: string
      email: string
      telefone: string
      ativo: number
      observacoes: string
      updated_at: Date
    }
    marca: {
      id: number
      nome: string
      ativo: number
      updated_at: Date
    }
    categoria: {
      id: number
      nome: string
      pai_id: number
      slug: string
      ativo: number
      updated_at: Date
    }
  }
}

const Foto = ({ produto }: IProps) => {
  const { push, query } = useRouter()

  const variantes = Array.from(
    new Set(produto.variantes.map(item => item.var1))
  ).map(item => {
    const findSku = produto.variantes.find(sk => sk.var1 === item)

    return {
      sku_id: findSku.idSku,
      fotos: findSku.fotos,
      var1Name: item
    }
  })

  return (
    <Table colorScheme="whiteAlpha" m="auto" width="100%">
      <Thead>
        <Tr>
          <Th>Tipo/Variação</Th>
          <Th>Foto1</Th>
          <Th>Foto2</Th>
          <Th>Foto3</Th>
          <Th>Foto4</Th>
          <Th>Foto5</Th>
          <Th>Foto6</Th>
          <Th>Atualizado</Th>
        </Tr>
      </Thead>
      <Tbody>
        {variantes.map((item, index) => {
          return (
            <Tr key={index}>
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
                    {item.var1Name}
                  </MenuButton>
                  <MenuList bg="black" borderColor="transparent">
                    <MenuItem
                      _focus={{ bg: 'black' }}
                      onClick={() =>
                        push(
                          `/admin/produtos-fotos/editar/${parseInt(
                            query.slug[0]
                          )}/${item.sku_id}`
                        )
                      }
                    >
                      Editar
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
              {item.fotos.map((varfotos, varIdx) => {
                return (
                  <Td key={varIdx}>
                    <Img w="50px" src={varfotos} />
                  </Td>
                )
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default Foto
