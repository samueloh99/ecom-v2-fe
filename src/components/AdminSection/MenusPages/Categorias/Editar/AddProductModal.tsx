import React, { useEffect, useRef, useState } from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import {
  Flex,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useToast
} from '@chakra-ui/react'

import { AiFillCheckCircle, AiOutlineClose } from 'react-icons/ai'
import { useProdutos } from '../../../../../services/hooks/useProdutos'
import { useSkus } from '../../../../../services/hooks/useSkus'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

type Product = {
  nome: string
  referencia: string
  estoque: number
  id: number
}

type IProps = {
  onClose: () => void
  isOpen: boolean
  products: {
    produto_id: number
    nome: string
    ativo: number
    referencia: string
    estoque: number
    img: string
    preco: number
  }[]
}

const AddProductModal = ({ onClose, isOpen, products }: IProps) => {
  const { query } = useRouter()
  const toast = useToast()
  const [inputSearch, setInputSearch] = useState('')
  const [skusOptions, setSkusOptions] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number[]>([])

  const { data } = useProdutos('', 1, 9999999999)
  const { data: dataSkus } = useSkus('', 1, 9999999999)

  const handleChangeInput = e => {
    const searchWord = e.target.value
    setInputSearch(searchWord)

    const filterProduct = data.produtos
      .filter(item => !selectedProduct.includes(item.id))
      .filter(item => products.every(prod => prod.produto_id !== item.id))
      .filter(item => {
        return (
          item.nome
            .toLocaleLowerCase()
            .includes(searchWord.toLocaleLowerCase()) ||
          item.referencia.includes(searchWord)
        )
      })

    if (searchWord === '') {
      setSkusOptions([])
    } else {
      setSkusOptions(filterProduct)
    }
  }

  const handleAddProduct = async () => {
    await api
      .patch('/produtos/adicionar_produto_categoria', {
        product_ids: selectedProduct,
        categoria_id: query['slug']
      })
      .then(res => {
        queryClient.invalidateQueries('skus')
        queryClient.invalidateQueries('produtos')
        onClose()
        setSelectedProduct([])
        setInputSearch('')
        setSkusOptions([])
        return toast({
          title: 'SUCESSO',
          description: 'Produto cadastrado.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      })
      .catch(err => {
        return toast({
          title: 'ERRO.',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Produtos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack h="100%" align="start">
            <VStack w="50%" align="start" position="relative">
              <Text>Procurar por Produto Código:</Text>
              <Input
                type="text"
                value={inputSearch}
                onChange={handleChangeInput}
              />
              {skusOptions.length !== 0 && (
                <Flex
                  direction="column"
                  align="start"
                  w="100%"
                  h="500px"
                  overflow="scroll"
                  position="absolute"
                  top="65px"
                  border="1px solid gray"
                >
                  {skusOptions
                    .filter(item => !selectedProduct.includes(item.id))
                    .map((item, index) => {
                      return (
                        <Flex
                          key={index}
                          w="100%"
                          direction="column"
                          cursor="pointer"
                          _hover={{ background: 'gray.100' }}
                          borderBottom="1px solid black"
                          onClick={() => {
                            setSelectedProduct(prev => [...prev, item.id])
                          }}
                        >
                          <Text>Nome: {item.nome}</Text>
                          <Text>Referencia: {item.referencia}</Text>
                          <Text>Estoque: {item.estoque}</Text>
                        </Flex>
                      )
                    })}
                </Flex>
              )}
            </VStack>

            <VStack align="start" w="100%">
              <Text>Produtos para adicionar:</Text>
              <SimpleGrid columns={4} spacing={10} h="100%" w="100%">
                {dataSkus &&
                  selectedProduct.map((item, index) => {
                    const findSku = dataSkus.skus.filter(
                      sku => sku.produto_id === item
                    )

                    const totalStock = dataSkus.skus
                      .filter(sku => sku.produto_id === item)
                      .map(sku => sku.estoque)
                      .reduce((a, b) => a + b, 0)

                    return (
                      <Flex
                        key={index}
                        direction="column"
                        w="200px"
                        h="340px"
                        border="1px solid #ccc"
                        position="relative"
                      >
                        <Icon
                          as={AiOutlineClose}
                          position="absolute"
                          right="0px"
                          cursor="pointer"
                          onClick={() => {
                            let newArr = [...selectedProduct]
                            const idxRemove = newArr.indexOf(item)
                            newArr.splice(idxRemove, 1)
                            setSelectedProduct(newArr)
                          }}
                        />
                        <Flex justify="center" h="200px">
                          {findSku[0].foto1 && (
                            <NextImage
                              src={findSku[0].foto1}
                              width="150px"
                              height="200px"
                            />
                          )}
                        </Flex>
                        <Flex direction="column" mt="10px">
                          <HStack>
                            <Icon
                              fontSize={20}
                              color={
                                findSku[0].produto.ativo === 1 ? 'green' : 'red'
                              }
                              as={AiFillCheckCircle}
                            />
                            <Text>{findSku[0].produto.referencia}</Text>
                          </HStack>
                          <Text>{findSku[0].produto.nome}</Text>
                          <Text>{findSku[0].preco_venda}</Text>
                          <Text>{totalStock}</Text>
                        </Flex>
                      </Flex>
                    )
                  })}
              </SimpleGrid>
            </VStack>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          <Button
            disabled={selectedProduct.length === 0 ? true : false}
            onClick={handleAddProduct}
            ml="10px"
            colorScheme="green"
          >
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddProductModal
