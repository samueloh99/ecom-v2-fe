import React, { useState, useEffect, useCallback, ChangeEvent } from 'react'

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
  Select,
  Text,
  Img
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

type VariacaoUpdateFormData = {
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

  const { slug } = router.query

  const [ativoValue, setAtivoValue] = useState('1')

  const [variacoes, setVariacoes] = useState(0)

  const { data, isSuccess } = useVariacoes()

  const filteredVariacoes =
    isSuccess && data.find(item => item.id === parseInt(slug[0]))

  useEffect(() => {
    if (isSuccess) {
      setAtivoValue(String(filteredVariacoes.ativo))
      setVariacoes(filteredVariacoes.pai_id)
    }
  }, [data])

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData()
      data.append(`foto`, e.target.files[0])

      console.log(filteredVariacoes.id)
      api
        .post(`/variacoes/foto/${filteredVariacoes.id}`, data)
        .then(() => {
          toast({
            title: 'Foto adicionado.',
            description: 'Foto salvo.',
            status: 'success',
            duration: 4000,
            isClosable: true
          })
          queryClient.invalidateQueries('variacoes')
        })
        .catch(err => console.log(err))
    }
  }, [])

  const updateVariacao = useMutation(
    async (newVariacao: Variacao) => {
      try {
        const response = await api.patch(
          `/variacoes/editar/${slug[0]}`,
          newVariacao
        )

        toast({
          title: 'Sucesso ao atualizar.',
          description: 'Variacao foi atualizado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao atualizar.',
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

  const handleUpdateVariacao: SubmitHandler<
    VariacaoUpdateFormData
  > = async values => {
    const newVariacao = {
      ...values,
      ativo: parseInt(ativoValue),
      pai_id: variacoes
    }

    await updateVariacao.mutateAsync(newVariacao)
  }

  return (
    <Stack w="50%">
      <form onSubmit={handleSubmit(handleUpdateVariacao)}>
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
            <Input
              defaultValue={filteredVariacoes.nome}
              id="nome"
              {...register('nome')}
            />
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
            <option value={0}>Escolher</option>

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

        <Divider m="40px 0px" />

        <Stack w="100%" direction="column">
          <Text>Foto 1</Text>
          <Input
            type="file"
            w="400px"
            value={''}
            onChange={e => handleAvatarChange(e)}
          />
          <Img w="100px" src={filteredVariacoes.foto} />
        </Stack>

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
