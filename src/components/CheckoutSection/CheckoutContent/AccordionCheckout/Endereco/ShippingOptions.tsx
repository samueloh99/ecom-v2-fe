import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import * as fbq from '../../../../../../lib/fpixel'

import {
  Stack,
  Text,
  Button,
  Flex,
  Box,
  Spinner,
  useToast,
  Checkbox,
  Radio,
  HStack,
  RadioGroup,
  VStack
} from '@chakra-ui/react'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { api } from '../../../../../services/apiClient'
import { useCartContext } from '../../../../../contexts/CartContext'

type ICorreiosResponse = {
  prazo: string
  valor: string
  cod_servico: string
  frete_gratis: boolean
  error: boolean
  frete_nome: string
  errorMsg: string
}

const ShippingOptions = () => {
  const toast = useToast()
  const { push } = useRouter()
  const { checkoutEntrega, setCheckoutEntrega, checkoutUsuario, setStep } =
    useCheckoutContext()
  const { totalCart, totalPeso, totalQtd } = useCartContext()

  const [shipping, setShipping] = useState<ICorreiosResponse[]>()
  const [selectShip, setSelectShip] = useState(0)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (checkoutEntrega) {
      setLoading(true)
      handleCalculateShipping(checkoutEntrega.enderecoRes.cep)
    }
  }, [checkoutEntrega])

  const handleCalculateShipping = async (cep: string) => {
    const response = await api.post('/correios/frete_produto', {
      nCdFormato: 1,
      nVlPeso: String(totalPeso() / 1000),
      sCepDestino: cep,
      totalCarrinho: String(totalCart())
    })

    setShipping(response.data)

    setLoading(false)
  }

  const handleNextStep = async () => {
    const selectedShipping = shipping.find(
      (item, index) => index === selectShip
    )

    const newObj = {
      entrega_nome: checkoutEntrega.enderecoRes.destinatario,
      entrega_cep: checkoutEntrega.enderecoRes.cep,
      entrega_endereco: checkoutEntrega.enderecoRes.endereco,
      entrega_numero: checkoutEntrega.enderecoRes.numero,
      entrega_complemento: checkoutEntrega.enderecoRes.complemento,
      entrega_bairro: checkoutEntrega.enderecoRes.bairro,
      entrega_cidade: checkoutEntrega.enderecoRes.cidade,
      entrega_estado: checkoutEntrega.enderecoRes.estado,
      entrega_pais: checkoutEntrega.enderecoRes.pais,
      entrega_lembrete: checkoutEntrega.enderecoRes.lembrete,
      frete_titulo: selectedShipping.cod_servico,
      frete_nome: selectedShipping.frete_nome,
      frete_prazo: parseFloat(selectedShipping.prazo),
      frete_valor: parseFloat(selectedShipping.valor.replace(',', '.')),
      frete_embalagem: 'Comum',
      endereco_id: String(checkoutEntrega.enderecoRes.id),
      endereco_id_pagarme: checkoutEntrega.pagarmeRes.id
    }

    const newenderecoBlingObj = {
      nome: checkoutUsuario.usuarioRes.nome_completo,
      tipoPessoa: 'F', //F, J ou E
      contribuinte: 9,
      cpf_cnpj: checkoutUsuario.usuarioRes.cpf,
      endereco: checkoutEntrega.enderecoRes.endereco,
      numero: checkoutEntrega.enderecoRes.numero,
      complemento: checkoutEntrega.enderecoRes.complemento,
      bairro: checkoutEntrega.enderecoRes.bairro,
      cep: checkoutEntrega.enderecoRes.cep,
      cidade: checkoutEntrega.enderecoRes.cidade,
      uf: checkoutEntrega.enderecoRes.estado,
      fone: checkoutUsuario.usuarioRes.celular,
      celular: checkoutUsuario.usuarioRes.celular,
      email: checkoutUsuario.usuarioRes.email,
      emailNfe: checkoutUsuario.usuarioRes.email,
      paisOrigem: 'BR',
      codigo: checkoutUsuario.usuarioRes.id
    }

    await api
      .post('/checkout/users_bling', newenderecoBlingObj)
      .then(res => {
        if (res.data.retorno.erros) {
          return toast({
            title: 'Erro.',
            description: 'Não foi possível cadastrar na bling.',
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }

        setStep(2)

        push('/checkout/pagamento', undefined, { shallow: true })

        fbq.event('InitiateCheckout', {
          content_type: 'product',
          value: totalCart(),
          num_items: totalQtd(),
          currency: 'BRL',
          step: '2 - Pagamento'
        })

        return setCheckoutEntrega({
          ...checkoutEntrega,
          checkoutDataEnderecoDTO: newObj
        })
      })
      .catch(er => {
        console.log(er)
        return toast({
          title: 'Erro.',
          description: 'Não foi possível cadastrar na bling.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  return (
    <Flex mt="40px" direction="column">
      <Text fontWeight="bold">Opções de Frete:</Text>
      <Stack my={2}>
        {loading === true ? (
          <Spinner />
        ) : (
          <VStack>
            {shipping &&
              shipping.map((item, index) => {
                return (
                  <RadioGroup
                    key={index}
                    w="100%"
                    onChange={() => setSelectShip(index)}
                    value={selectShip}
                  >
                    <Flex
                      w="100%"
                      p="5px 10px"
                      position="relative"
                      border="1px solid"
                      borderColor={selectShip === index ? 'green.500' : 'black'}
                      borderRadius="5px"
                      onClick={() => setSelectShip(index)}
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
              })}
          </VStack>
        )}
      </Stack>
      {selectShip >= 0 && (
        <Button
          bg="black"
          color="white"
          type="submit"
          w="100%"
          mt="5"
          onClick={() => handleNextStep()}
        >
          Continuar
        </Button>
      )}
    </Flex>
  )
}

export default ShippingOptions
