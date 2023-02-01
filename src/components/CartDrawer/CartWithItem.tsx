import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Stack,
  Text,
  Flex,
  Divider,
  Box,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Img,
  Button,
  HStack,
  Input,
  DrawerBody,
  DrawerFooter,
  useToast,
  Spinner,
  Badge,
  VStack
} from '@chakra-ui/react'

import {
  AiOutlineClose,
  AiFillTags,
  AiOutlineCheck,
  AiOutlinePlus,
  AiOutlineMinus
} from 'react-icons/ai'

import { TbAlertCircle } from 'react-icons/tb'
import { useCartContext } from '../../contexts/CartContext'
import { api } from '../../services/apiClient'
import { useCartDrawer } from '../../contexts/CartDrawerContext'

interface ISkuWithDiscountHook {
  id: number
  tipo: number
  valor: number
  preco_original: number
}
interface IProductSkuDTO {
  idProd: number
  nome: string
  referencia: string
  ncm: string
  variante1: string
  variante2: string
  foto: string
  quantidade: number
  sku_referencia: string
  preco: number
  idSku: number
}

const CartWithItem = () => {
  const toast = useToast()

  const { onClose: onCloseCartDrawer } = useCartDrawer()

  const { push, prefetch } = useRouter()

  const {
    cartCupom,
    handleApplyCupom,
    cart,
    decreaseCart,
    incrementCart,
    deleteItemOnCart,
    totalCart,
    setCart,
    totalQtd
  } = useCartContext()

  const [cupomInput, setCupomInput] = useState({
    cupomValue: '',
    valido: true
  })

  const [loading, setLoading] = useState(false)
  const [disabledSkus, setDisabledSkus] = useState<number[]>([])
  const [skusWithDiscount, setSkuWithDiscount] = useState<
    ISkuWithDiscountHook[]
  >([])

  const getSkuIdApi = async (id: number, quantidade: number, index: number) => {
    await api
      .get(`/skus/buscar/${id}`)
      .then(res => {
        if (res.data.preco_desconto !== 0) {
          let newArr = [...cart]
          newArr[index].preco = res.data.preco_desconto
          setCart(newArr)
          setSkuWithDiscount(prev => [
            ...prev,
            {
              id: res.data.id,
              tipo: res.data.desconto.tipo,
              valor: res.data.desconto.valor,
              preco_original: res.data.preco_venda
            }
          ])
        }

        if (res.data.estoque === quantidade) {
          return setDisabledSkus(prev => [...prev, id])
        }

        if (res.data.estoque < quantidade) {
          let newArr = [...cart]
          newArr[index].quantidade = res.data.estoque
          setCart(newArr)

          return setDisabledSkus(prev => [...prev, id])
        }
      })
      .catch(err => {
        setLoading(false)
        return toast({
          title: 'Erro.',
          description: 'Não foi possível atualizar o estoque do carrinho.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  useEffect(() => {
    prefetch('/carrinho')

    setLoading(true)
    cart.map((item, index) => {
      getSkuIdApi(item.idSku, item.quantidade, index)
    })
    setLoading(false)
  }, [])

  const handleDecreaseCart = async (
    id: number,
    quantidade: number,
    index: number
  ) => {
    setLoading(true)
    await api
      .get(`/skus/buscar/${id}`)
      .then(res => {
        if (quantidade > res.data.estoque) {
          let newArr = [...cart]
          newArr[index].quantidade = res.data.estoque
          setCart(newArr)
          setLoading(false)
          return setDisabledSkus([...disabledSkus, id])
        }
        decreaseCart(index)
        setDisabledSkus(disabledSkus.filter(item => item !== id))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        return toast({
          title: 'Erro.',
          description: 'Não foi possível dimunuir a quantidade.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  const handleIncreaseCart = async (
    id: number,
    quantidade: number,
    index: number
  ) => {
    setLoading(true)
    await api
      .get(`/skus/buscar/${id}`)
      .then(res => {
        if (quantidade > res.data.estoque) {
          setLoading(false)
          let newArr = [...cart]
          newArr[index].quantidade = res.data.estoque
          setCart(newArr)
          return setDisabledSkus([...disabledSkus, id])
        }
        if (quantidade + 1 === res.data.estoque) {
          incrementCart(index)

          setLoading(false)
          return setDisabledSkus([...disabledSkus, id])
        }
        incrementCart(index)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)

        return toast({
          title: 'Erro.',
          description: 'Não foi possível adicionar.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  const applyCupom = async () => {
    const responseValidateCupom = await api.post(`/cupons/validar`, {
      codigo: cupomInput.cupomValue,
      qtd_carrinho: totalQtd(),
      valor_carrinho: totalCart()
    })

    if (responseValidateCupom.status !== 200) {
      return setCupomInput({
        ...cupomInput,
        valido: false
      })
    }

    if (responseValidateCupom.data.valido === false) {
      return setCupomInput({
        ...cupomInput,
        valido: false
      })
    }

    if (responseValidateCupom.data.valido === true) {
      setCupomInput({
        cupomValue: responseValidateCupom.data.cupom_codigo,
        valido: true
      })

      return handleApplyCupom({
        cupom_id: responseValidateCupom.data.cupom_id,
        valido: 1,
        cupomName: responseValidateCupom.data.cupom_codigo,
        desconto_tipo: responseValidateCupom.data.tipo,
        desconto_valor: responseValidateCupom.data.valor
      })
    }

    return handleApplyCupom({
      cupom_id: null,
      valido: 0,
      cupomName: '',
      desconto_tipo: '',
      desconto_valor: 0
    })
  }

  const handleDeleteCupom = () => {
    return handleApplyCupom({
      cupom_id: null,
      valido: 0,
      cupomName: '',
      desconto_tipo: '',
      desconto_valor: 0
    })
  }

  const handleGoToCheckout = () => {
    onCloseCartDrawer()
    push({
      pathname: '/carrinho'
    })
  }

  return (
    <>
      <DrawerBody p="2">
        {loading && (
          <Flex
            bg="gray"
            opacity="0.5"
            w="100%"
            h="100%"
            borderRadius="5px"
            position="absolute"
            top="0"
            left="0"
            zIndex={9999}
            right="0"
            justify="center"
            align="center"
          >
            <Spinner />
          </Flex>
        )}
        {cart.map((item: IProductSkuDTO, index: number) => {
          const {
            nome,
            variante1,
            variante2,
            foto,
            preco,
            quantidade,
            idSku,
            idProd
          } = item

          const findSkuDiscount = skusWithDiscount.find(sk => sk.id === idSku)
          return (
            <Stack
              key={index}
              flexDirection="column"
              mt="5"
              align="start"
              borderBottom="1px solid #ccc"
              pb="10px"
            >
              {disabledSkus.includes(idSku) && (
                <Flex
                  justify="start"
                  align="start"
                  bg="#FFEAD6"
                  w="100%"
                  borderRadius="5px"
                  p="2px 5px"
                >
                  <Icon as={TbAlertCircle} fontSize="15px" color="red" />
                  <Text fontSize="12px">
                    Temos apenas {quantidade} unidades deste item!
                  </Text>
                </Flex>
              )}
              <Box
                position="relative"
                display="flex"
                flexDirection="row"
                w="100%"
              >
                <Flex position="relative">
                  <Img w="120px" src={foto} />
                  {findSkuDiscount && (
                    <Flex position="absolute" top="5px">
                      <Badge
                        borderRadius="10px"
                        ml="1"
                        fontSize="10px"
                        colorScheme="green"
                      >
                        {findSkuDiscount.tipo === 1 ? (
                          <Text color="#088208">
                            {(
                              100 -
                              (preco * 100) / findSkuDiscount.preco_original
                            ).toFixed(2)}
                            % OFF
                          </Text>
                        ) : (
                          <Text color="#088208">
                            ({findSkuDiscount.valor}% OFF)
                          </Text>
                        )}
                      </Badge>
                    </Flex>
                  )}
                </Flex>
                <Stack m="0px 10px">
                  <Text fontSize="15px" textTransform="uppercase">
                    {nome}
                  </Text>
                  <Text fontSize="10px" textTransform="uppercase">
                    Cor: {variante1}
                  </Text>
                  <Text fontSize="10px" textTransform="uppercase">
                    Tam: {variante2}
                  </Text>

                  <HStack align="end" w="140px" h="100%">
                    <Flex
                      p="5px"
                      borderRadius="50%"
                      border="1px solid #ccc"
                      cursor="pointer"
                      onClick={() =>
                        handleDecreaseCart(idSku, quantidade, index)
                      }
                    >
                      <Icon as={AiOutlineMinus} fontSize="10px" />
                    </Flex>
                    <Text fontSize="15px">{quantidade}</Text>
                    <Flex
                      bg={
                        disabledSkus.includes(idSku)
                          ? 'gray.100'
                          : 'transparent'
                      }
                      p="5px"
                      borderRadius="50%"
                      border="1px solid #ccc"
                      cursor={disabledSkus.includes(idSku) ? 'auto' : 'pointer'}
                      onClick={() =>
                        disabledSkus.includes(idSku) !== true &&
                        handleIncreaseCart(idSku, quantidade, index)
                      }
                    >
                      <Icon as={AiOutlinePlus} fontSize="10px" />
                    </Flex>
                  </HStack>
                </Stack>
                <Stack w="80px" align="center" justify="end">
                  {findSkuDiscount ? (
                    <VStack w="100%">
                      <Text
                        color="gray.300"
                        textDecoration="line-through"
                        fontSize="14px"
                        textTransform="uppercase"
                      >
                        R${' '}
                        {findSkuDiscount.preco_original
                          .toFixed(2)
                          .replace('.', ',')}
                      </Text>
                      <Text
                        fontSize="16px"
                        color="#088208"
                        textTransform="uppercase"
                      >
                        R$ {preco.toFixed(2).replace('.', ',')}
                      </Text>
                    </VStack>
                  ) : (
                    <Text fontSize="16px" textTransform="uppercase">
                      R$ {preco.toFixed(2).replace('.', ',')}
                    </Text>
                  )}
                </Stack>
                <Icon
                  position="absolute"
                  right="0"
                  margin="0"
                  top="0"
                  as={AiOutlineClose}
                  fontSize="20px"
                  onClick={() => deleteItemOnCart(index)}
                />
              </Box>
              <Text
                fontSize="12px"
                textDecoration="underline"
                onClick={() => {
                  onCloseCartDrawer()
                  push({ pathname: `/produto/${idProd}` })
                }}
              >
                Editar
              </Text>
            </Stack>
          )
        })}

        <Accordion
          mt="20"
          w="100%"
          allowToggle
          defaultIndex={[0]}
          allowMultiple
        >
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={AiFillTags} color="black" mr="2" fontSize={20} />
                Cupom de Desconto
                {cupomInput.valido === false && (
                  <span style={{ color: 'red', fontSize: '10px' }}>
                    {' '}
                    Código Inválido
                  </span>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              display="flex"
              flexDirection="row"
              justifyContent="start"
            >
              {cartCupom.valido !== 1 && (
                <Flex>
                  <Input
                    w="100%"
                    h="40px"
                    p="0"
                    placeholder="Digite o cupom"
                    borderRadius={0}
                    _focus={{ border: '0px 0px 1px 0px' }}
                    border="0px 0px 1px 0px"
                    borderBottom="1px solid gray"
                    value={cupomInput.cupomValue}
                    onChange={e =>
                      setCupomInput({
                        ...cupomInput,
                        cupomValue: e.target.value
                      })
                    }
                  />
                  <Button
                    bg="white"
                    border="1px solid black"
                    _active={{ background: 'none' }}
                    _hover={{ background: 'black', color: 'white' }}
                    _focus={{ boxShadow: 'none' }}
                    onClick={() => applyCupom()}
                  >
                    Aplicar
                  </Button>
                </Flex>
              )}
              {cartCupom.valido === 1 && (
                <HStack position="relative" w="100%">
                  <Icon as={AiOutlineCheck} color="green" />
                  <Text>{cartCupom.cupomName}</Text>
                  <Text
                    position="absolute"
                    top="0"
                    right="10px"
                    color="red.300"
                    cursor="pointer"
                    textDecoration="underline"
                    onClick={() => handleDeleteCupom()}
                  >
                    Remover
                  </Text>
                </HStack>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </DrawerBody>
      <DrawerFooter borderTop="1px solid gray" flexDirection="column">
        <Stack w="100%">
          <Text color="black" fontWeight="bold">
            Resumo da compra
          </Text>
          <Flex w="100%" justifyContent="space-between">
            <Text color="gray.300">Subtotal</Text>
            <Text>R$ {totalCart().toFixed(2).replace('.', ',')}</Text>
          </Flex>
          {cartCupom.valido === 1 && (
            <Flex justifyContent="space-between">
              <Text color="green.300">Cupom ({cartCupom.cupomName})</Text>
              <Text color="green.300">
                -R$
                {cartCupom.desconto_tipo === 'F'
                  ? cartCupom.desconto_valor
                  : cartCupom.desconto_tipo === 'P'
                  ? (totalCart() * (cartCupom.desconto_valor / 100))
                      .toFixed(2)
                      .replace('.', ',')
                  : totalCart().toFixed(2).replace('.', ',')}
              </Text>
            </Flex>
          )}
        </Stack>
        <Divider m="15px 0px" />
        <Stack w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Text color="black" fontWeight="bold">
              Total a pagar
            </Text>
            <Flex direction="column" align="end">
              <Text>
                R${' '}
                {cartCupom.valido === 1
                  ? cartCupom.desconto_tipo === 'P'
                    ? (
                        totalCart() -
                        totalCart() * (cartCupom.desconto_valor / 100)
                      ).toFixed(2)
                    : (totalCart() - cartCupom.desconto_valor)
                        .toFixed(2)
                        .replace('.', ',')
                  : totalCart().toFixed(2).replace('.', ',')}
              </Text>
            </Flex>
          </Flex>
          <Button bg="black" color="white" onClick={() => handleGoToCheckout()}>
            Avançar
          </Button>
        </Stack>
      </DrawerFooter>
    </>
  )
}

export default CartWithItem
