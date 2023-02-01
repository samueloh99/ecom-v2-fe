import React, { useState, useEffect } from 'react'

import * as yup from 'yup'

import { useRouter } from 'next/router'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Stack,
  WrapItem,
  RadioGroup,
  Radio,
  FormErrorMessage,
  Divider,
  FormControl,
  Input,
  useToast,
  Button,
  FormLabel,
  Select
} from '@chakra-ui/react'

import { useCategorias } from '../../../../../services/hooks/useCategorias'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    nome: yup.string().required('Campo Obrigatório')
  })
  .required()

type CategoryUpdateFormData = {
  nome: string
}

type Categoria = {
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

  const [categoria, setCategoria] = useState(0)

  const { data: categoriasData, isSuccess: categoriasSuccess } = useCategorias()

  const filteredCategory =
    categoriasSuccess &&
    categoriasData.find(item => item.id === parseInt(slug[0]))

  useEffect(() => {
    if (categoriasSuccess) {
      setAtivoValue(String(filteredCategory.ativo))
      setCategoria(filteredCategory.pai_id)
    }
  }, [categoriasData])

  const addCategoria = useMutation(
    async (newCategory: Categoria) => {
      try {
        const response = await api.patch(
          `/categorias/editar/${filteredCategory.id}`,
          newCategory
        )

        toast({
          title: 'Sucesso ao atualizar.',
          description: 'Categoria foi atualizado com sucesso',
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
        queryClient.invalidateQueries('categorias')
        router.push('/admin/categorias')
      }
    }
  )

  const handleUpdateCategoria: SubmitHandler<
    CategoryUpdateFormData
  > = async values => {
    const newCategory = {
      ...values,
      ativo: parseInt(ativoValue),
      pai_id: categoria
    }

    await addCategoria.mutateAsync(newCategory)
  }

  return (
    <Stack w="50%">
      <form onSubmit={handleSubmit(handleUpdateCategoria)}>
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
            <FormLabel htmlFor="nome">Nome Categoria</FormLabel>
            <Input
              defaultValue={filteredCategory.nome}
              id="nome"
              {...register('nome')}
            />
            {!!errors && <FormErrorMessage>Campo Obrigatório</FormErrorMessage>}
          </FormControl>
        </Stack>

        <Divider m="40px 0px" />

        <WrapItem flexDirection="column" w="45%">
          <FormLabel>SubCategoria de:</FormLabel>
          <Select
            value={categoria}
            onChange={e => setCategoria(parseInt(e.target.value))}
          >
            <option value={0}>Escolher</option>

            {categoriasData &&
              categoriasData.map((item, index) => {
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
