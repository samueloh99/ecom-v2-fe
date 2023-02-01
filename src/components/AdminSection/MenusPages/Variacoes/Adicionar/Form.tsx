import React, { useState } from 'react'

import * as yup from 'yup'

import { useRouter } from 'next/router'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Stack,
  WrapItem,
  Divider,
  FormControl,
  useToast,
  Input,
  Button,
  Radio,
  RadioGroup,
  FormLabel,
  FormErrorMessage,
  Select
} from '@chakra-ui/react'

import { useVariacoes } from '../../../../../services/hooks/useVariacoes'
import { queryClient } from '../../../../../services/queryClient'
import { api } from '../../../../../services/apiClient'
import { useMutation } from 'react-query'

const validationSchema = yup
  .object({
    nome: yup.string().required('Campo Obrigatório')
  })
  .required()

type VariacaoAddFormData = {
  nome: string
}

type Variacao = {
  nome: string
  pai_id: number
  ativo: number
}

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const toast = useToast()

  const router = useRouter()

  const [ativoValue, setAtivoValue] = useState('1')

  const [variacoes, setVariacoes] = useState(0)

  const { data, isSuccess } = useVariacoes()

  const addVariacao = useMutation(
    async (newVariacao: Variacao) => {
      try {
        const response = await api.post(`/variacoes`, newVariacao)

        toast({
          title: 'Sucesso ao criar.',
          description: 'Variacao foi criado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao criar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('variacoes')
        router.push('/admin/variacoes')
      }
    }
  )

  const handleAddVariacao: SubmitHandler<
    VariacaoAddFormData
  > = async values => {
    const newVariacao = {
      ...values,
      ativo: parseInt(ativoValue),
      pai_id: variacoes
    }

    await addVariacao.mutateAsync(newVariacao)
  }

  return (
    <Stack w="50%">
      <form onSubmit={handleSubmit(handleAddVariacao)}>
        <Divider m="40px 0px" />
        <Stack>
          <FormLabel>Ativo:</FormLabel>
          <RadioGroup onChange={setAtivoValue} value={ativoValue}>
            <Stack direction="row">
              <Radio value="1">Ativo</Radio>
              <Radio value="2">Inativo</Radio>
            </Stack>
          </RadioGroup>
        </Stack>

        <Divider m="40px 0px" />

        <Stack>
          <FormControl isInvalid={!!errors.nome}>
            <FormLabel htmlFor="nome">Nome</FormLabel>
            <Input id="nome" {...register('nome')} />
            {!!errors.nome && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
        </Stack>

        <Divider m="40px 0px" />

        <WrapItem flexDirection="column" w="45%">
          <FormLabel>SubVariação de:</FormLabel>
          <Select
            value={variacoes}
            onChange={e => setVariacoes(parseInt(e.target.value))}
          >
            <option value={0} style={{ color: 'black' }}>
              Escolher
            </option>

            {isSuccess &&
              data.map((item, index) => {
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
        </WrapItem>

        <Box position="fixed" bottom={20}>
          <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
            GRAVAR
          </Button>
        </Box>
      </form>
    </Stack>
  )
}

export default Form
