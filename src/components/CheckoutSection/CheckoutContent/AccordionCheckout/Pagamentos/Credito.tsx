import React, { useEffect, useRef, useState } from 'react'

import {
  AccordionPanel,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Text,
  Flex,
  Select,
  Stack,
  Img,
  Icon,
  HStack,
  Button,
  FormLabel,
  useToast
} from '@chakra-ui/react'

import { FcSimCardChip } from 'react-icons/fc'

import {
  cartaoMask,
  verifyCardFlag,
  cpfMask,
  validadeCartaoMask,
  cpfValidator
} from '../../../../../../utils/masks'

import { useParcelaContext } from '../../../../../contexts/ParcelaContext'
import { useCartContext } from '../../../../../contexts/CartContext'
import { useParcelas } from '../../../../../services/hooks/useConfiguracoes'
import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { api } from '../../../../../services/apiClient'

type Parcela = {
  parcela: number
  tipo: string
  valido: boolean
  valor: number
}

const Credito = () => {
  const toast = useToast()

  const { data: dataParcela, isSuccess: isSuccessParcela } = useParcelas()

  const { calcParcela } = useParcelaContext()

  const {
    checkoutEntrega,
    step,
    checkoutUsuario,
    setCheckoutPagamento,
    setStep
  } = useCheckoutContext()

  const { totalCart } = useCartContext()

  const {
    isOpen: isOpenCartao,
    onOpen: onOpenCartao,
    onClose: onCloseCartao
  } = useDisclosure()

  const btnRef = useRef()

  const [fields, setFields] = useState({
    number: '',
    name: '',
    expiration: '',
    cv: '',
    cpf: '',
    nickanme: '',
    parcelas: -1
  })

  const [validate, setValidate] = useState({
    cpfV: false,
    numberV: false,
    expirationV: false,
    parcelaV: false,
    cvV: false,
    cardError: false
  })

  const [flag, setFlag] = useState({
    url: '',
    index: false
  })

  const [opcoesParcelas, setOpcoesParcelas] = useState<Parcela[]>([
    {
      parcela: 1,
      tipo: 'Sem Juros',
      valido: true,
      valor: 0.0
    }
  ])

  useEffect(() => {
    if (isSuccessParcela && step === 2) {
      const total = (
        checkoutEntrega.checkoutDataEnderecoDTO.frete_valor + totalCart()
      ).toFixed(2)
      const optParcelas = calcParcela(parseFloat(total), dataParcela)
      setOpcoesParcelas(optParcelas)
    }
  }, [dataParcela, isSuccessParcela, step])

  const onChangeCardNumber = value => {
    const flagurl = verifyCardFlag(value)
    if (flagurl !== false) {
      return setFlag({
        index: true,
        url: flagurl
      })
    } else {
      return setFlag({
        ...flag,
        index: false
      })
    }
  }

  const onSubmit = async () => {
    const currentYear = String(new Date().getFullYear()).slice(2)
    const inputYear = fields.expiration.split('/')[1]
    const inputMonth = fields.expiration.split('/')[0]

    if (fields.number.length < 12) {
      return setValidate({ ...validate, numberV: true })
    }

    if (
      fields.expiration === '' ||
      inputMonth > String(12) ||
      inputYear < currentYear
    ) {
      return setValidate({ ...validate, expirationV: true })
    }

    if (fields.cv === '') {
      return setValidate({ ...validate, cvV: true })
    }

    if (!cpfValidator(fields.cpf)) {
      return setValidate({ ...validate, cpfV: true })
    }

    if (fields.parcelas === -1) {
      return setValidate({ ...validate, parcelaV: true })
    }

    setValidate({
      cpfV: false,
      expirationV: false,
      numberV: false,
      parcelaV: false,
      cvV: false,
      cardError: false
    })

    const newObj = {
      billing_address: {
        city: checkoutEntrega.checkoutDataEnderecoDTO.entrega_cidade,
        country: checkoutEntrega.checkoutDataEnderecoDTO.entrega_pais,
        line_1: `${checkoutEntrega.checkoutDataEnderecoDTO.entrega_numero}, ${checkoutEntrega.checkoutDataEnderecoDTO.entrega_endereco}`,
        line_2: checkoutEntrega.checkoutDataEnderecoDTO.entrega_complemento,
        state: checkoutEntrega.checkoutDataEnderecoDTO.entrega_estado,
        zip_code: checkoutEntrega.checkoutDataEnderecoDTO.entrega_cep
      },
      brand: 'MasterCard',
      customer_id: checkoutUsuario.pagarmeRes.id,
      cvv: fields.cv,
      exp_month: parseInt(inputMonth),
      exp_year: parseInt(inputYear),
      holder_document: fields.cpf.replaceAll('.', '').replaceAll('-', ''),
      holder_name: fields.name,
      label: '',
      number: fields.number.replaceAll(' ', '')
    }

    try {
      const response = await api.post(`/checkout/users_card_pagarme`, newObj)

      if (response.status !== 200) {
        setValidate({
          ...validate,
          cardError: true
        })

        return toast({
          title: 'Cartão não cadastrado.',
          description: response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
      if (response.data.errors) {
        setValidate({
          ...validate,
          cardError: true
        })

        return toast({
          title: 'Cartão não cadastrado.',
          description: response.data.errors.card[0],
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }

      setCheckoutPagamento({
        pagamento_nome: 'pagarme_credito',
        pagamento_titulo: 'Cartão de Crédito',
        pagamento_valor: '0.00',
        pagamento_link: '',
        desconto_id: null,
        parcela_numero: opcoesParcelas[fields.parcelas].parcela,
        parcela_valor: opcoesParcelas[fields.parcelas].valor,
        parcela_desconto: 0.0,
        cartao_nsu: '566998574',
        cartao_bandeira: 'visa', // AQUI MUDAR
        afiliado_usuario_id: '0',
        card_id_pagarme: response.data.id,
        card_cv: fields.cv
      })

      setStep(3)
      onCloseCartao()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AccordionPanel bg="white" pb={4} px={10}>
      <Flex
        p="10px"
        borderRadius="5px"
        bg="black"
        w="300px"
        direction="column"
        color="white"
        cursor="pointer"
        onClick={onOpenCartao}
      >
        <Text fontWeight="bold">Cartão de Crédito</Text>
        <Text fontSize="12px">Parcele em até 6x sem juros.</Text>
      </Flex>
      <Drawer
        isOpen={isOpenCartao}
        placement="right"
        onClose={onCloseCartao}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent overflow="scroll">
          <DrawerCloseButton />
          <Flex
            borderRadius={10}
            bg="black"
            p="10px"
            direction="column"
            h="250px"
            color="white"
            m="20px auto"
            w="350px"
          >
            <Flex
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid black"
            >
              <HStack>
                <Icon as={FcSimCardChip} fontSize={50} />
                <Text
                  p="2px 10px"
                  h="20px"
                  w="150px"
                  borderRadius="50px"
                  bg="#333333"
                  fontSize={11}
                >
                  {fields.nickanme}
                </Text>
              </HStack>
              {flag.index === true && (
                <Img src={flag.url} alt="masterCard" w="50px" />
              )}
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="center"
              border="1px solid black"
              m="30px 0px 30px 0px"
              p="2px 10px"
              w="200px"
              h="30px"
              borderRadius="50px"
              bg="#333333"
            >
              <Text>{fields.number}</Text>
            </Flex>
            <Flex
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid black"
            >
              <Stack direction="column">
                <Text
                  p="2px 10px"
                  w="200px"
                  h="30px"
                  alignContent="center"
                  borderRadius="50px"
                  bg="#333333"
                >
                  {fields.name}
                </Text>
                <Text
                  p="2px 10px"
                  w="140px"
                  h="30px"
                  textAlign="center"
                  alignContent="center"
                  borderRadius="50px"
                  bg="#333333"
                >
                  {fields.cpf}
                </Text>
              </Stack>
              <Stack direction="column">
                <Text
                  p="2px 10px"
                  w="80px"
                  h="30px"
                  textAlign="center"
                  alignContent="center"
                  borderRadius="50px"
                  bg="#333333"
                >
                  {fields.expiration}
                </Text>
                <Text
                  p="2px 10px"
                  w="50px"
                  h="30px"
                  textAlign="center"
                  alignContent="center"
                  borderRadius="50px"
                  bg="#333333"
                >
                  {fields.cv}
                </Text>
              </Stack>
            </Flex>
          </Flex>

          <Stack w="100%" direction="column" p="10px 20px 20px 20px">
            <Flex direction="column">
              <FormLabel>
                Numero{' '}
                {validate.numberV && (
                  <span style={{ fontSize: '10px', color: 'red' }}>
                    Preencha Corretamente.
                  </span>
                )}
              </FormLabel>{' '}
              <Input
                value={fields.number}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                onChange={e => (
                  setFields({
                    ...fields,
                    number: cartaoMask(e.target.value)
                  }),
                  onChangeCardNumber(e.target.value)
                )}
              />
            </Flex>

            <Flex direction="row" justifyContent="space-between">
              <Flex direction="column">
                <FormLabel>
                  Validade{' '}
                  {validate.expirationV && (
                    <span style={{ fontSize: '10px', color: 'red' }}>
                      Validade Inválida
                    </span>
                  )}
                </FormLabel>
                <Input
                  value={fields.expiration}
                  placeholder="00/00"
                  maxLength={5}
                  borderColor={validate.expirationV === true ? 'red' : 'black'}
                  onChange={e =>
                    setFields({
                      ...fields,
                      expiration: validadeCartaoMask(e.target.value)
                    })
                  }
                />
              </Flex>
              <Flex direction="column">
                <FormLabel>
                  CV{' '}
                  {validate.cvV && (
                    <span style={{ fontSize: '10px', color: 'red' }}>
                      Preencha corretamento o campo.
                    </span>
                  )}
                </FormLabel>
                <Input
                  value={fields.cv}
                  placeholder="000"
                  borderColor={validate.cvV === true ? 'red' : 'black'}
                  maxLength={3}
                  onChange={e =>
                    setFields({
                      ...fields,
                      cv: cartaoMask(e.target.value)
                    })
                  }
                />
              </Flex>
            </Flex>

            <Flex direction="column">
              <FormLabel>Nome do Titular</FormLabel>
              <Input
                value={fields.name}
                placeholder="Nome completo"
                onChange={e => setFields({ ...fields, name: e.target.value })}
              />
            </Flex>

            <Flex direction="column">
              <FormLabel>
                CPF{' '}
                {validate.cpfV && (
                  <span style={{ fontSize: '10px', color: 'red' }}>
                    CPF Inválido
                  </span>
                )}
              </FormLabel>
              <Input
                borderColor={validate.cpfV === true ? 'red' : 'black'}
                value={fields.cpf}
                placeholder="000.000.000-00"
                onChange={e =>
                  setFields({ ...fields, cpf: cpfMask(e.target.value) })
                }
              />
            </Flex>

            <Flex direction="column">
              <FormLabel>Apelido do Cartão (Opcional)</FormLabel>
              <Input
                value={fields.nickanme}
                placeholder="Nome"
                onChange={e =>
                  setFields({ ...fields, nickanme: e.target.value })
                }
              />
            </Flex>

            <Flex direction="column">
              <FormLabel>Parcelas</FormLabel>
              <Select
                value={fields.parcelas}
                borderColor={validate.parcelaV === true ? 'red' : 'black'}
                onChange={e =>
                  setFields({ ...fields, parcelas: parseInt(e.target.value) })
                }
              >
                <option value={-1}>Selecione uma opção...</option>
                {opcoesParcelas.map((item, key) => {
                  return (
                    <option
                      key={key}
                      value={key}
                    >{`${item.parcela}x ${item.tipo} de R$${item.valor}`}</option>
                  )
                })}
              </Select>
            </Flex>

            <Button bg="black" color="white" onClick={() => onSubmit()}>
              Cadastrar
            </Button>
          </Stack>
        </DrawerContent>
      </Drawer>
    </AccordionPanel>
  )
}

export default Credito
