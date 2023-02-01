import React from 'react'

import {
  Flex,
  Text,
  Divider,
  HStack,
  VStack,
  ListItem,
  UnorderedList,
  Icon,
  Stack
} from '@chakra-ui/react'
import { BsTruck } from 'react-icons/bs'

interface IProductDTO {
  product: {
    altura: string
    ativo: number
    categoria_id: number
    comprimento: string
    created_at: string
    descricao: null
    fornecedor_id: null
    id: number
    largura: string
    marca_id: number
    ncm: string
    nome: string
    referencia: string
    slug: string
    tipo_produto_id: number
    updated_at: string
    desconto: {
      tipo: number
      valor: number
    }
    variantes: {
      idSku: number
      sku_referencia: string
      preco: number
      preco_desconto: number
      var1: string
      var1Foto: string
      var2: string
      estoque: number
      fotos: string[]
      peso: number
    }[]
  }
}

const ProductDetails = ({ product }: IProductDTO) => {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      w="100%"
      h={{ base: '100%', lg: '500px' }}
      my="20px"
      px={{ base: '10px', lg: '0px' }}
      spacing={10}
    >
      <VStack align="start" w={{ base: '100%', lg: '70%' }} h="100%">
        <Text fontSize={{ base: '14px', lg: '18px' }} fontWeight="bold">
          Descrição
        </Text>
        <Divider colorScheme="black" />
        <Flex direction="column" fontSize={{ base: '12px', lg: '14px' }}>
          <Text dangerouslySetInnerHTML={{ __html: product.descricao }}></Text>
          <Text>A modelo veste tamanho P</Text>
        </Flex>
      </VStack>
      <VStack
        align="start"
        w={{ base: '100%', lg: '30%' }}
        h="100%"
        marginBottom="auto"
      >
        <Text fontSize={{ base: '14px', lg: '18px' }} fontWeight="bold">
          Frete e Devoluções
        </Text>
        <Divider colorScheme="black" />
        <HStack bg="#F6F5F3" p="10px">
          <Icon as={BsTruck} fontSize={30} />
          <Text fontSize="12px">
            Selecione o tamanho para entender prazos e disponibilidade de
            entrega.
          </Text>
        </HStack>
        <Flex>
          <UnorderedList fontSize="12px">
            <ListItem>Entregamos para todo o Brasil.</ListItem>
            <ListItem>
              Você tem 30 dias para devolver seu pedido gratuitamente.
            </ListItem>
          </UnorderedList>
        </Flex>
      </VStack>
    </Stack>
  )
}

export default ProductDetails
