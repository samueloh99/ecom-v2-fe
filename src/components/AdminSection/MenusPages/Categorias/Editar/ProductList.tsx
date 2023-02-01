import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import {
  Flex,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Spinner,
  Icon,
  Button,
  useDisclosure
} from '@chakra-ui/react'

import { AiFillCheckCircle, AiFillDelete } from 'react-icons/ai'

import { useSkus } from '../../../../../services/hooks/useSkus'
import { useProdutos } from '../../../../../services/hooks/useProdutos'
import AddProductModal from './AddProductModal'

type Product = {
  produto_id: number
  nome: string
  ativo: number
  referencia: string
  estoque: number
  img: string
  preco: number
  updated_at: Date
}

const ProductList = () => {
  const { query } = useRouter()

  const { data: dataProdutos } = useProdutos('', 1, 9999999999999)
  const { data: dataSkus } = useSkus('', 1, 9999999999999)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [products, setProducts] = useState<Product[]>()

  useEffect(() => {
    if (dataProdutos && dataSkus) {
      const filterProductsSubCategory = dataProdutos.produtos
        .filter(
          item =>
            item.sub_categorias_ids &&
            item.sub_categorias_ids.includes(parseInt(query['slug'] as string))
        )
        .map(item => {
          const estoqueTotal = dataSkus.skus
            .filter(skus => skus.produto_id === item.id)
            .map(skus => skus.estoque)
            .reduce((a, b) => a + b, 0)

          const skuFiltered = dataSkus.skus.filter(
            skus => skus.produto_id === item.id
          )

          return {
            img: skuFiltered[0].foto1 ? skuFiltered[0].foto1 : '',
            produto_id: item.id,
            ativo: item.ativo,
            referencia: item.referencia,
            nome: item.nome,
            preco: skuFiltered[0].preco_venda,
            estoque: estoqueTotal,
            updated_at: item.updated_at,
            sub_cats: item.sub_categorias_ids
          }
        })

      const filterProductsMainCategory = dataProdutos.produtos
        .filter(item => item.categoria_id === parseInt(query['slug'] as string))
        .map(item => {
          const estoqueTotal = dataSkus.skus
            .filter(skus => skus.produto_id === item.id)
            .map(skus => skus.estoque)
            .reduce((a, b) => a + b, 0)

          const skuFiltered = dataSkus.skus.filter(
            skus => skus.produto_id === item.id
          )

          return {
            img: skuFiltered[0] ? skuFiltered[0].foto1 : '',
            produto_id: item.id,
            ativo: item.ativo,
            referencia: item.referencia,
            nome: item.nome,
            preco: skuFiltered[0] ? skuFiltered[0].preco_venda : 0,
            estoque: estoqueTotal,
            updated_at: item.updated_at,
            sub_cats: item.sub_categorias_ids
          }
        })

      setProducts([...filterProductsMainCategory, ...filterProductsSubCategory])
    }
  }, [dataProdutos, dataSkus])

  const handleDelteItemOnSubCat = item => {
    console.log(item)
  }
  return (
    <VStack direction="column" align="start" w="100%">
      <HStack w="100%" justify="space-between" align="center">
        <Text>Lista de Produtos - {products && products.length} Produtos</Text>
        <Button colorScheme="pink" onClick={onOpen}>
          Adicionar mais Produtos
        </Button>

        <AddProductModal
          products={products}
          onClose={onClose}
          isOpen={isOpen}
        />
      </HStack>
      {products ? (
        <SimpleGrid w="100%" columns={4} spacing={10}>
          {products
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((item, index) => {
              return (
                <Flex
                  key={index}
                  position="relative"
                  direction="column"
                  w="200px"
                  h="340px"
                >
                  {/* <Flex
                    position="absolute"
                    top="0px"
                    left="0"
                    onClick={() => handleDelteItemOnSubCat(item)}
                  >
                    <Icon as={AiFillDelete} fontSize={20} />
                  </Flex> */}
                  <Flex justify="center" h="200px">
                    {item.img && (
                      <NextImage src={item.img} width="150px" height="200px" />
                    )}
                  </Flex>
                  <Flex direction="column" mt="10px">
                    <HStack>
                      <Icon
                        fontSize={20}
                        color={item.ativo === 1 ? 'green' : 'red'}
                        as={AiFillCheckCircle}
                      />
                      <Text>{item.referencia}</Text>
                    </HStack>
                    <Text>{item.produto_id}</Text>
                    <Text>{item.nome}</Text>
                    <Text>{item.preco}</Text>
                    <Text>{item.estoque}</Text>
                  </Flex>
                </Flex>
              )
            })}
        </SimpleGrid>
      ) : (
        <Spinner />
      )}
    </VStack>
  )
}

export default ProductList
