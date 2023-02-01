import React, { useState } from 'react'

import { useRouter } from 'next/router'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Flex,
  Spinner,
  Stack,
  Input,
  FormLabel,
  Select,
  Button,
  FormControl,
  useToast
} from '@chakra-ui/react'

import { useVariacoes } from '../../../../../../services/hooks/useVariacoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'

const validationSchema = yup
  .object({
    referencia: yup.string().required('Campo Obrigatório'),
    estoque: yup.number().required('Campo Obrigatório'),
    preco_custo: yup.number().required('Campo Obrigatório'),
    preco_venda: yup.number().required('Campo Obrigatório'),
    peso: yup.number().required('Campo Obrigatório')
  })
  .required()

type SkuAddFormData = {
  id: number
  nome: string
  referencia: string
  ativo: number
  preco_custo: number
  preco_venda: number
  peso: number
  estoque: number
  variacao1: number
  variacao2: number
}

const SkuAdd = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const toast = useToast()

  const router = useRouter()

  const { slug } = router.query

  const { data, isLoading } = useVariacoes()

  const [ativo, setAtivo] = useState(1)
  const [variacao1, setVariacao1] = useState(0)
  const [variacao2, setVariacao2] = useState(0)
  const [invalidate, setInvalidate] = useState(false)

  const var1PaiId = data && data.find(item => item.nome === 'Cor').id
  const var2PaiId = data && data.find(item => item.nome === 'Tamanho').id

  const addSku = useMutation(
    async (skuToAdd: SkuAddFormData) => {
      try {
        const response = await api.post(`/skus`, skuToAdd)

        toast({
          title: 'Criado com Sucesso.',
          description: 'Sku criado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao Criar SKU.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('skus')
      }
    }
  )

  const handleAddSku: SubmitHandler<SkuAddFormData> = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (variacao2 === 0 && variacao2 === 0) {
      return setInvalidate(true)
    } else {
      setInvalidate(false)
    }
    const skuToAdd = {
      ...values,
      var1_id: variacao1,
      var2_id: variacao2,
      ativo: ativo,
      produto_id: parseInt(slug[0])
    }

    await addSku.mutateAsync(skuToAdd)
  }

  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <form onSubmit={handleSubmit(handleAddSku)}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Stack>
          <FormControl>
            <FormLabel>Ativo</FormLabel>
            <Select
              value={ativo}
              borderColor={invalidate && `#E53E3E`}
              onChange={e => setAtivo(parseInt(e.target.value))}
            >
              <option value={0}>Escolher</option>
              <option value="1">Sim</option>
              <option value="2">Não</option>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl isInvalid={!!errors.referencia}>
            <FormLabel>Referência</FormLabel>
            <Input id="referencia" type="text" {...register('referencia')} />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Variação 1</FormLabel>
            <Select
              borderColor={invalidate && `#E53E3E`}
              value={variacao1}
              onChange={e => setVariacao1(parseInt(e.target.value))}
              w="200px"
            >
              <option value={0}>Escolher</option>
              {data
                .filter(item => item.pai_id === var1PaiId)
                .map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item.id}
                      style={{ color: 'black' }}
                    >
                      {item.nome}
                    </option>
                  )
                })}
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Variação 2</FormLabel>
            <Select
              borderColor={invalidate && `#E53E3E`}
              value={variacao2}
              onChange={e => setVariacao2(parseInt(e.target.value))}
              w="200px"
            >
              <option value={0}>Escolher</option>
              {data
                .filter(item => item.pai_id === var2PaiId)
                .map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item.id}
                      style={{ color: 'black' }}
                    >
                      {item.nome}
                    </option>
                  )
                })}
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl isInvalid={!!errors.estoque}>
            <FormLabel>Estoque</FormLabel>
            <Input
              id="estoque"
              type="number"
              {...register('estoque')}
              w="100px"
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl isInvalid={!!errors.preco_venda}>
            <FormLabel>Preço Venda</FormLabel>
            <Input
              id="preco_venda"
              type="number"
              {...register('preco_venda')}
              w="100px"
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl isInvalid={!!errors.preco_custo}>
            <FormLabel>Preço Custo</FormLabel>
            <Input
              type="number"
              id="preco_custo"
              {...register('preco_custo')}
              w="100px"
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl isInvalid={!!errors.peso}>
            <FormLabel>Peso</FormLabel>
            <Input id="peso" type="number" {...register('peso')} w="100px" />
          </FormControl>
        </Stack>
        <Stack alignContent="center" justifyContent="end">
          <Button isLoading={isSubmitting} type="submit" colorScheme="pink">
            Gravar
          </Button>
        </Stack>
      </Flex>
    </form>
  )
}

export default SkuAdd
