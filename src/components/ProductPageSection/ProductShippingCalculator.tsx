import React, { useState } from 'react'

import {
  Flex,
  Button,
  Text,
  useToast,
  HStack,
  Input,
  VStack
} from '@chakra-ui/react'

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

interface IProductSkuDTO {
  skuSelected: {
    idSku: number
    preco: number
    preco_desconto: number
    var1: string
    var2: string
    estoque: number
    fotos: string[]
    peso: number
  }
}

const ProductShippingCalculator = ({ skuSelected }: IProductSkuDTO) => {
  const [shipOptions, setShipOptions] = useState<ICorreiosResponse[]>()
  const [cep, setCep] = useState('')
  const [cepError, setCepError] = useState(false)

  const toast = useToast()

  const calculateShipping = async () => {
    if (cep.length !== 9) {
      return setCepError(true)
    }
    setCepError(false)

    const res = await api.post('/correios/frete_produto', {
      nCdFormato: '1',
      nVlPeso: skuSelected.peso / 1000,
      sCepDestino: cep,
      totalCarrinho: skuSelected.preco
    })

    if (res.data.status === 'error') {
      return toast({
        title: 'Erro.',
        description: res.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    setShipOptions(res.data)
  }

  return (
    <Flex direction="column" mb="20px" borderRadius={5}>
      <HStack>
        <Input
          value={cep}
          maxLength={9}
          onChange={e => setCep(cepMask(e.target.value))}
          w="60%"
        />
        <Button
          onClick={() => calculateShipping()}
          fontWeight="medium"
          bg="black"
          color="white"
          w="40%"
          fontSize={{ base: '12px', lg: '16px' }}
        >
          CALCULAR FRETE
        </Button>
      </HStack>
      {cepError && (
        <Text textTransform="uppercase" color="red" fontSize={10}>
          Preencha o CEP.
        </Text>
      )}
      <VStack spacing={5} align="start" m="20px 10px 5px 10px">
        {shipOptions &&
          shipOptions.map((item, index) => {
            if (item.frete_gratis === true) {
              return (
                <Flex align="start" direction="column" key={index}>
                  <Text fontWeight="bold">
                    Frete Grátis - {item.frete_nome}
                  </Text>
                  <Flex>
                    <Text>R$ {item.valor}-</Text>
                    <Text>Prazo em até {item.prazo} dias úteis.</Text>
                  </Flex>
                </Flex>
              )
            }
            return (
              <Flex align="start" direction="column" key={index}>
                <Text fontWeight="bold">{item.frete_nome}</Text>
                <Flex>
                  <Text>R$ {item.valor}-</Text>
                  <Text>Prazo em até {item.prazo} dias úteis.</Text>
                </Flex>
              </Flex>
            )
          })}
      </VStack>
    </Flex>
  )
}

export default ProductShippingCalculator
