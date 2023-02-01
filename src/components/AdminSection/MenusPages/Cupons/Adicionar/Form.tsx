import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import {
  Box,
  Text,
  Stack,
  WrapItem,
  Wrap,
  Divider,
  FormControl,
  Button,
  Radio,
  RadioGroup,
  FormLabel,
  Input,
  useToast,
  HStack
} from '@chakra-ui/react'

import { dataMask } from '../../../../../../utils/masks'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

type Cupom = {
  tipo: number
  ativo: number
  data_1: Date
  data_2: Date
  nome: string
  codigo: string
  quantidade: string
  desconto_tipo: string
  desconto_valor: string
  minimo_item: string
  minimo_compra: string
  frete_gratis: number
  desconto_produto: number
  desconto_pagamento: number
  reutilizavel: number
}

const Form = () => {
  const router = useRouter()

  const toast = useToast()
  const [fields, setFields] = useState<Cupom>({
    tipo: 1,
    ativo: 1,
    data_1: new Date(),
    data_2: new Date(),
    nome: '',
    codigo: '',
    quantidade: '',
    desconto_tipo: '',
    desconto_valor: '',
    minimo_item: '',
    minimo_compra: '',
    frete_gratis: 1,
    desconto_produto: 1,
    desconto_pagamento: 1,
    reutilizavel: 1
  })
  const [datas, setDatas] = useState({
    data1: '',
    data2: ''
  })

  const editCupom = useMutation(
    async (newValuesObj: {
      tipo: number
      ativo: number
      data_1: Date
      data_2: Date
      nome: string
      codigo: string
      quantidade: number
      desconto_tipo: string
      desconto_valor: number
      minimo_item: number
      minimo_compra: number
      frete_gratis: number
      desconto_produto: number
      desconto_pagamento: number
      reutilizavel: number
    }) => {
      try {
        const response = await api.post(`/cupons`, newValuesObj)

        toast({
          title: 'Sucesso ao adicionar.',
          description: 'Cupom foi adicionado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao adicionar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cupons')
      }
    }
  )

  const handleEditCupom = async () => {
    const data1 = datas.data1.split('/')
    const data2 = datas.data2.split('/')
    const data1Formatted = new Date(
      parseInt(data1[2]),
      parseInt(data1[1]),
      parseInt(data1[0])
    )
    const data2Formatted = new Date(
      parseInt(data2[2]),
      parseInt(data2[1]),
      parseInt(data2[0])
    )

    const newObj = {
      tipo: 1,
      ativo: fields.ativo,
      data_1: data1Formatted,
      data_2: data2Formatted,
      codigo: fields.codigo,
      desconto_tipo: fields.desconto_tipo,
      desconto_valor: parseFloat(fields.desconto_valor),
      quantidade: parseInt(fields.quantidade),
      frete_gratis: fields.frete_gratis,
      desconto_produto: fields.desconto_produto,
      desconto_pagamento: fields.desconto_pagamento,
      minimo_compra: parseFloat(fields.minimo_compra),
      minimo_item: parseFloat(fields.minimo_item),
      nome: fields.nome,
      reutilizavel: fields.reutilizavel
    }
    await editCupom.mutateAsync(newObj)
    router.push('/admin/descontos')
  }

  return (
    <Stack w="50%">
      <FormControl mt={5} mb={100}>
        <Divider m="40px 0px" />
        <Stack>
          <FormLabel>Ativo:</FormLabel>
          <RadioGroup
            onChange={e => setFields({ ...fields, ativo: parseInt(e) })}
            value={fields.ativo}
          >
            <Stack direction="row">
              <Radio value={1}>Ativo</Radio>
              <Radio value={2}>Inativo</Radio>
            </Stack>
          </RadioGroup>
        </Stack>

        <Divider m="40px 0px" />

        <HStack justifyContent="space-between">
          <Stack>
            <FormLabel>Validade de:</FormLabel>
            <Input
              id="data1"
              value={datas.data1}
              maxLength={10}
              onChange={e =>
                setDatas({ ...datas, data1: dataMask(e.target.value) })
              }
            />
          </Stack>
          <Stack>
            <FormLabel>Validade até:</FormLabel>
            <Input
              id="data2"
              value={datas.data2}
              maxLength={10}
              onChange={e =>
                setDatas({ ...datas, data2: dataMask(e.target.value) })
              }
            />
          </Stack>
        </HStack>

        <Divider m="40px 0px" />

        <Stack spacing={10}>
          <Stack>
            <FormLabel>Nome</FormLabel>
            <Input
              id="codigo"
              value={fields.nome}
              maxLength={20}
              onChange={e => setFields({ ...fields, nome: e.target.value })}
            />
          </Stack>
          <Stack>
            <FormLabel>Código</FormLabel>
            <Input
              id="codigo"
              value={fields.codigo}
              maxLength={20}
              onChange={e => setFields({ ...fields, codigo: e.target.value })}
            />
          </Stack>

          <Stack>
            <FormLabel>Tipo de desconto:</FormLabel>
            <RadioGroup
              onChange={e => setFields({ ...fields, desconto_tipo: e })}
              value={fields.desconto_tipo}
            >
              <Stack direction="row">
                <Radio value="F">R$</Radio>
                <Radio value="P">%</Radio>
              </Stack>
            </RadioGroup>
          </Stack>

          <Stack>
            <FormLabel>Valor do Desconto R$</FormLabel>
            <Input
              id="desconto_valor"
              value={fields.desconto_valor}
              maxLength={10}
              type="number"
              onChange={e =>
                setFields({
                  ...fields,
                  desconto_valor: e.target.value
                })
              }
            />
          </Stack>

          <Stack>
            <FormLabel>Mínimo de Compra R$</FormLabel>
            <Input
              id="minimo_compra"
              value={fields.minimo_compra}
              maxLength={10}
              type="number"
              onChange={e =>
                setFields({
                  ...fields,
                  minimo_compra: e.target.value
                })
              }
            />
          </Stack>

          <Stack>
            <FormLabel>Mínimo de Itens</FormLabel>
            <Input
              id="minimo_item"
              value={fields.minimo_item}
              maxLength={10}
              type="number"
              onChange={e =>
                setFields({
                  ...fields,
                  minimo_item: e.target.value
                })
              }
            />
          </Stack>

          <Stack>
            <FormLabel>Quantidade</FormLabel>
            <Input
              id="quantidade"
              value={fields.quantidade}
              type="number"
              onChange={e =>
                setFields({ ...fields, quantidade: e.target.value })
              }
            />
          </Stack>

          <Stack>
            <FormLabel>Frete-Grátis:</FormLabel>
            <RadioGroup
              onChange={e =>
                setFields({ ...fields, frete_gratis: parseInt(e) })
              }
              value={fields.frete_gratis}
            >
              <Stack direction="row">
                <Radio value={1}>Ativar Frete-Grátis do Desconto</Radio>
                <Radio value={0}>
                  Quando tiver regras de Frete Grátis na Loja
                </Radio>
              </Stack>
            </RadioGroup>
          </Stack>

          <Stack>
            <FormLabel>Usar desconto de Produtos:</FormLabel>
            <RadioGroup
              onChange={e =>
                setFields({ ...fields, desconto_produto: parseInt(e) })
              }
              value={fields.desconto_produto}
            >
              <Stack direction="row">
                <Radio value={1}>Ativo</Radio>
                <Radio value={0}>Inativo</Radio>
              </Stack>
            </RadioGroup>
          </Stack>

          <Stack>
            <FormLabel>Usar desconto de Pagamentos:</FormLabel>
            <RadioGroup
              onChange={e =>
                setFields({ ...fields, desconto_pagamento: parseInt(e) })
              }
              value={fields.desconto_pagamento}
            >
              <Stack direction="row">
                <Radio value={1}>Ativo</Radio>
                <Radio value={0}>Inativo</Radio>
              </Stack>
            </RadioGroup>
          </Stack>

          <Stack>
            <FormLabel>Reutilizável:</FormLabel>
            <RadioGroup
              onChange={e =>
                setFields({ ...fields, reutilizavel: parseInt(e) })
              }
              value={fields.reutilizavel}
            >
              <Stack direction="row">
                <Radio value={1}>Sim</Radio>
                <Radio value={0}>Não</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        </Stack>

        <Box position="fixed" bottom={20}>
          <Button onClick={() => handleEditCupom()} colorScheme="pink">
            GRAVAR
          </Button>
        </Box>
      </FormControl>
    </Stack>
  )
}

export default Form
