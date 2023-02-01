import React, { useState } from 'react'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Button,
  Stack,
  Text,
  Input,
  WrapItem,
  useToast,
  RadioGroup,
  Radio,
  Wrap,
  FormControl,
  FormLabel,
  Divider
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { api } from '../../../../services/apiClient'
import { queryClient } from '../../../../services/queryClient'

const validationSchema = yup.object({
  sku_id: yup.number().required('Campo obrigatório'),
  quantidade: yup.number().required('Campo obrigatório')
})

type MovimentacoesAddData = {
  quantidade: number
  lancamento: string
  sku_id: number
}

const AdicaoRapida = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const toast = useToast()

  const [lancamento, setLancamento] = useState('entrada')

  const addMovimentacao = useMutation(
    async (newMovimentacao: MovimentacoesAddData) => {
      try {
        const response = await api.post(`/movimentacoes`, newMovimentacao)
        toast({
          title: 'Sucesso ao adicionar.',
          description: 'Movimentacao foi criada com sucesso',
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
        queryClient.invalidateQueries('movimentacoes')
        queryClient.resetQueries()
      }
    }
  )

  const handleAddMovimentacao: SubmitHandler<MovimentacoesAddData> =
    async values => {
      const newMovimentacao = {
        ...values,
        lancamento: lancamento
      }
      await addMovimentacao.mutateAsync(newMovimentacao)
    }

  return (
    <form onSubmit={handleSubmit(handleAddMovimentacao)}>
      <FormControl>
        <Wrap w="100%" justify="center" align="end" spacing={10}>
          <WrapItem flexDirection="column">
            <FormControl isInvalid={!!errors.sku_id}>
              <FormLabel htmlFor="sku_id">Sku Id</FormLabel>
              <Input
                w="200px"
                id="sku_id"
                type="number"
                {...register('sku_id')}
              />
            </FormControl>
          </WrapItem>

          <WrapItem flexDirection="column">
            <FormControl isInvalid={!!errors.quantidade}>
              <FormLabel htmlFor="quantidade">Quantidade</FormLabel>
              <Input
                w="200px"
                id="quantidade"
                type="number"
                {...register('quantidade')}
              />
            </FormControl>
          </WrapItem>

          <WrapItem
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <FormLabel>Lançamento:</FormLabel>
            <RadioGroup onChange={setLancamento} value={lancamento}>
              <Stack direction="row">
                <Radio value="entrada">Entrada</Radio>
                <Radio value="saida">Saída</Radio>
                <Radio value="balanco">Balanço</Radio>
              </Stack>
            </RadioGroup>
          </WrapItem>

          <Button type="submit" isLoading={isSubmitting} colorScheme="pink">
            ADICIONAR
          </Button>
        </Wrap>
        <Divider m="40px 0px" />
      </FormControl>
    </form>
  )
}

export default AdicaoRapida
