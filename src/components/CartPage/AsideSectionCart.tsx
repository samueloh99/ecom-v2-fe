import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import NextLink from 'next/link'

import {
  Flex,
  Text,
  VStack,
  Button,
  Icon,
  HStack,
  RadioGroup,
  Radio,
  Input,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import { IoPricetagsOutline } from 'react-icons/io5'
import { GoLocation } from 'react-icons/go'
import { AiOutlineCheck } from 'react-icons/ai'

import { useCartContext } from '../../contexts/CartContext'

import { cepMask } from '../../../utils/masks'
import { api } from '../../services/apiClient'

type ICorreiosResponse = {
  prazo: string
  valor: string
  cod_servico: string
  frete_gratis: boolean
  error: boolean
  frete_nome: string
  errorMsg: string
}

const AsideSectionCart = () => {
  const { push } = useRouter()
  const { isOpen, onClose } = useDisclosure()

  const {
    cartCupom,
    totalQtd,
    totalCart,
    totalPeso,
    handleApplyCupom,
    reaplyCupom
  } = useCartContext()

  const [totalCartValue, setTotalCartValue] = useState({
    frete: 0.0,
    total: 0.0,
    cupom: 0.0
  })

  const [cepValue, setCepValue] = useState('')

  const [cepValidate, setCepValidate] = useState({
    loading: false,
    validate: false
  })

  const [cupomInput, setCupomInput] = useState({
    cupomValue: '',
    valido: true
  })

  const [shippingOpt, setShippingOpt] = useState<ICorreiosResponse[]>()

  const [shippingOptSelected, setShippingOptSelected] = useState(0)

  useEffect(() => {
    if (cepValue.length === 9) {
      setCepValidate({ ...cepValidate, loading: true })
      handleCalculateShipping()
    }
  }, [cepValue])

  useEffect(() => {
    let valor: number = totalCart()
    let cupomValor: number = 0
    let valorFrete: number = 0

    if (shippingOpt) {
      valorFrete = parseFloat(
        shippingOpt[shippingOptSelected].valor.replace(',', '.')
      )
      valor =
        totalCart() +
        parseFloat(shippingOpt[shippingOptSelected].valor.replace(',', '.'))
    }

    if (cartCupom.valido === 1) {
      if (cartCupom.desconto_tipo === 'P') {
        valor = parseFloat(
          (valor - totalCart() * (cartCupom.desconto_valor / 100)).toFixed(2)
        )
        cupomValor = parseFloat(
          (totalCart() * (cartCupom.desconto_valor / 100)).toFixed(2)
        )
      }

      if (cartCupom.desconto_tipo === 'F') {
        valor = parseFloat((valor - cartCupom.desconto_valor).toFixed(2))
        cupomValor = parseFloat(cartCupom.desconto_valor.toFixed(2))
      }
    }

    setTotalCartValue({
      total: valor,
      cupom: cupomValor,
      frete: valorFrete
    })
  }, [shippingOpt, cartCupom, totalCart()])

  const handleCalculateShipping = async () => {
    const response = await api.post('/correios/frete_produto', {
      nCdFormato: 1,
      nVlPeso: String(totalPeso() / 1000),
      sCepDestino: cepValue,
      totalCarrinho: String(totalCart())
    })

    if (response.status === 200) {
      setCepValidate({ ...cepValidate, loading: false })
      setShippingOpt(response.data)
    } else {
      setCepValidate({ ...cepValidate, validate: true })
    }
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

  const handleClickCheckout = () => {
    reaplyCupom()
    push({
      pathname: '/checkout/identificacao'
    })
  }

  return (
    <Flex p={{ base: '10px', md: '0px' }} w={{ base: '100%', md: '70%' }}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>O Produto Vestido Linda acabou :(</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack
        p="10px"
        align="start"
        spacing={10}
        h="100%"
        bg="white"
        borderRadius="5px"
        w="100%"
        m="0 auto"
      >
        <VStack w="100%" align="start">
          <HStack align="center">
            <Icon as={GoLocation} />
            <Text>Calcular Frete</Text>
          </HStack>
          {!shippingOpt && (
            <VStack align="Start">
              <Input
                maxLength={9}
                value={cepValue}
                onChange={e => setCepValue(cepMask(e.target.value))}
                placeholder="Insira seu CEP"
                w="100%"
                h="40px"
                p="0"
                borderRadius={0}
                _focus={{ border: '0px 0px 1px 0px' }}
                border="0px 0px 1px 0px"
                borderBottom="1px solid gray"
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                style={{
                  textDecoration: 'underline',
                  color: 'blue.200'
                }}
              >
                Não sei meu CEP
              </a>
            </VStack>
          )}

          <VStack w="100%">
            {shippingOpt && (
              <HStack position="relative" w="100%">
                <Icon as={AiOutlineCheck} color="green" />
                <Text>{cepValue}</Text>
                <Text
                  position="absolute"
                  top="0"
                  right="10px"
                  color="red.300"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShippingOpt(undefined)}
                >
                  Alterar
                </Text>
              </HStack>
            )}
            <VStack w="100%">
              {cepValidate.loading === true ? (
                <Flex>
                  <Spinner />
                </Flex>
              ) : (
                shippingOpt &&
                shippingOpt.map((item, index) => {
                  return (
                    <RadioGroup
                      key={index}
                      w="100%"
                      onChange={() => setShippingOptSelected(index)}
                      value={shippingOptSelected}
                    >
                      <Flex
                        w="100%"
                        p="5px 10px"
                        position="relative"
                        border="1px solid"
                        borderColor={
                          shippingOptSelected === index ? 'green.500' : 'black'
                        }
                        borderRadius="5px"
                        onClick={() => setShippingOptSelected(index)}
                        cursor="pointer"
                      >
                        <Radio value={index} />
                        <Flex direction="column" ml="10px">
                          <Text>{item.frete_nome}</Text>
                          <Text>Em até {item.prazo} dias úteis.</Text>
                        </Flex>
                        <Text
                          position="absolute"
                          top="5px"
                          bottom="0"
                          right="10px"
                        >
                          {item.frete_gratis ? 'GRÁTIS' : `R$${item.valor}`}
                        </Text>
                      </Flex>
                    </RadioGroup>
                  )
                })
              )}
            </VStack>
          </VStack>
        </VStack>
        <VStack w="100%" align="start">
          <HStack align="center">
            <Icon as={IoPricetagsOutline} />
            <Text>Cupom de Desconto</Text>
          </HStack>
          {cartCupom.valido !== 1 && (
            <HStack align="Start">
              <Input
                placeholder="Digite o cupom"
                w="100%"
                h="40px"
                p="0"
                borderRadius={0}
                _focus={{ border: '0px 0px 1px 0px' }}
                border="0px 0px 1px 0px"
                borderBottom="1px solid gray"
                value={cupomInput.cupomValue}
                onChange={e =>
                  setCupomInput({ ...cupomInput, cupomValue: e.target.value })
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
            </HStack>
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
          {cupomInput.valido === false && (
            <span style={{ color: 'red', fontSize: '10px' }}>
              Código Inválido
            </span>
          )}
        </VStack>
        <Flex direction="column" w="100%">
          <Text fontWeight="bold">Resumo de compra</Text>
          <Flex justifyContent="space-between" mb="20px">
            <VStack align="start" justify="space-between">
              <Text>Subtotal</Text>
              {shippingOpt && <Text>Frete</Text>}
              {cartCupom.valido === 1 && (
                <Flex justifyContent="space-between">
                  <Text color="green.300">Cupom ({cartCupom.cupomName})</Text>
                </Flex>
              )}
              <Text fontSize={18} fontWeight="bold">
                Total
              </Text>
            </VStack>
            <VStack h="100%" align="end" justify="space-between">
              <Text>R${totalCart().toFixed(2).replace('.', ',')}</Text>
              {shippingOpt && (
                <Text>
                  {' '}
                  R${totalCartValue.frete.toFixed(2).replace('.', ',')}
                </Text>
              )}
              {cartCupom.valido === 1 && (
                <Text color="green.300">
                  -R$
                  {totalCartValue.cupom.toFixed(2).replace('.', ',')}
                </Text>
              )}
              <Text fontSize={18} fontWeight="bold">
                R${totalCartValue.total.toFixed(2).replace('.', ',')}
              </Text>
            </VStack>
          </Flex>
          <Button
            bg="black"
            color="white"
            onClick={() => handleClickCheckout()}
          >
            Avançar
          </Button>
        </Flex>
      </VStack>
    </Flex>
  )
}

export default AsideSectionCart
