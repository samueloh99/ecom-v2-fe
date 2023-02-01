import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Text,
  Stack,
  WrapItem,
  RadioGroup,
  Radio,
  Wrap,
  Divider,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  FormLabel,
  Select,
  useToast
} from '@chakra-ui/react'

import { useMarcas } from '../../../../../../services/hooks/useMarcas'
import { useFornecedores } from '../../../../../../services/hooks/useFornecedores'
import { useCategorias } from '../../../../../../services/hooks/useCategorias'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'

const validationSchema = yup
  .object({
    nome: yup.string().required('Campo Obrigatório'),
    referencia: yup.string().required('Campo Obrigatório'),
    ncm: yup.string().required('Campo Obrigatório'),
    comprimento: yup.string(),
    largura: yup.string(),
    altura: yup.string()
  })
  .required()

type ProdutoUpdateFormData = {
  id: number
  nome: string
  slug: string
  referencia: string
  ncm: string
  marca_id: number
  fornecedor_id: number
  categoria_id: number
  comprimento: string
  altura: string
  largura: string
  descricao: string //faltou esse
  created_at: Date
  updated_at: Date
  ativo: number //faltou esse
  tipo_produto_id: number //faltou esse
}

type IProps = {
  produto: {
    id: number
    nome: string
    slug: string
    referencia: string
    ncm: string
    marca_id: number
    fornecedor_id: number
    categoria_id: number
    sub_categorias_ids: number[]
    tags: number[]
    comprimento: string
    altura: string
    largura: string
    descricao: string
    created_at: Date
    updated_at: Date
    ativo: number
    tipo_produto_id: number
    estoque: number
    preco: [number]
    fornecedor: {
      id: number
      nome: string
      site: string
      email: string
      telefone: string
      ativo: number
      observacoes: string
      updated_at: Date
    }
    marca: {
      id: number
      nome: string
      ativo: number
      updated_at: Date
    }
    categoria: {
      id: number
      nome: string
      pai_id: number
      slug: string
      ativo: number
      updated_at: Date
    }
  }
}

const Cadastro = ({ produto }: IProps) => {
  const router = useRouter()

  const { slug } = router.query

  const toast = useToast()

  const { data: marcasData } = useMarcas()

  const { data: fornecedoresData } = useFornecedores()

  const { data: categoriasData } = useCategorias()

  const [ativoValue, setAtivoValue] = useState('1')
  const [tipoProduto, setTipoProduto] = useState('1')
  const [categoria, setCategoria] = useState(0)
  const [marca, setMarca] = useState(0)
  const [fornecedor, setFornecedor] = useState(0)

  useEffect(() => {
    if (produto) {
      setAtivoValue(produto.ativo.toString())
      setTipoProduto(produto.tipo_produto_id.toString())
      setCategoria(produto.categoria_id)
      setMarca(produto.marca_id === null ? 0 : produto.marca_id)
      setFornecedor(produto.fornecedor_id === null ? 0 : produto.fornecedor_id)
    }
  }, [produto, slug])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const updateProduto = useMutation(
    async (newValuesObj: ProdutoUpdateFormData) => {
      try {
        const response = await api.patch(
          `/produtos/editar/${produto.id}`,
          newValuesObj
        )
        if (response.data) {
          toast({
            title: 'Atualizado com Sucesso.',
            description: 'O Produto foi atualizado.',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        }
      } catch (err) {
        toast({
          title: 'Erro ao atualizar.',
          description: err.response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('produto_by_id')
        router.back()
      }
    }
  )

  const handleUpdate: SubmitHandler<ProdutoUpdateFormData> = async values => {
    const newValuesObj = {
      ...values,
      ativo: parseInt(ativoValue),
      tipo_produto_id: parseInt(tipoProduto),
      categoria_id: categoria === 0 ? null : categoria,
      marca_id: marca === 0 ? null : marca,
      fornecedor_id: fornecedor === 0 ? null : fornecedor
    }

    await updateProduto.mutateAsync(newValuesObj)
  }

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <Stack>
        <FormLabel>Ativo:</FormLabel>
        <RadioGroup onChange={setAtivoValue} value={ativoValue}>
          <Stack direction="row">
            <Radio value="1">Ativo</Radio>
            <Radio value="0">Inativo</Radio>
          </Stack>
        </RadioGroup>
      </Stack>
      <Divider m="40px 0px" />
      <Stack>
        <FormLabel>Tipo Produto:</FormLabel>
        <RadioGroup onChange={setTipoProduto} value={tipoProduto}>
          <Stack direction="row">
            <Radio value="1">Produto Físico</Radio>
            <Radio value="2">Vale Presente</Radio>
            <Radio value="3">Ingresso</Radio>
            <Radio value="4">Embalagem Presente</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      <Divider m="40px 0px" />

      <Stack>
        <FormControl isInvalid={!!errors.nome}>
          <FormLabel htmlFor="nome">Nome Produto</FormLabel>
          <Input defaultValue={produto.nome} id="nome" {...register('nome')} />
          {!!errors.message && (
            <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.referencia}>
          <FormLabel htmlFor="referencia">Referência</FormLabel>
          <Input
            defaultValue={produto.referencia}
            id="referencia"
            {...register('referencia')}
          />
          {!!errors.referencia && (
            <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.ncm}>
          <FormLabel htmlFor="ncm">NCM</FormLabel>
          <Input defaultValue={produto.ncm} id="ncm" {...register('ncm')} />
          {!!errors.ncm && (
            <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
          )}
        </FormControl>
      </Stack>

      <Divider m="40px 0px" />

      <Wrap w="100%" justify="space-between" spacing={5}>
        <WrapItem flexDirection="column" w="45%">
          <FormLabel>Marca:</FormLabel>
          <Select
            value={marca}
            onChange={e => setMarca(parseInt(e.target.value))}
          >
            <option value={0}>Escolher</option>
            {marcasData &&
              marcasData.map((item, index) => {
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

        <WrapItem flexDirection="column" w="45%">
          <FormLabel>Fornecedor:</FormLabel>
          <Select
            value={fornecedor}
            onChange={e => setFornecedor(parseInt(e.target.value))}
          >
            <option value={0}>Escolher</option>

            {fornecedoresData &&
              fornecedoresData.map((item, index) => {
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

        <WrapItem flexDirection="column" w="45%">
          <FormLabel>Categoria Principal:</FormLabel>
          <Select
            value={categoria}
            onChange={e => setCategoria(parseInt(e.target.value))}
          >
            <option>Escolher</option>

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
      </Wrap>

      <Divider m="40px 0px" />

      <FormLabel>Embalagem:</FormLabel>
      <Wrap>
        <WrapItem flexDirection="column" w="30%">
          <FormLabel>Comprimento:</FormLabel>
          <Input
            defaultValue={produto.comprimento || 0}
            {...register('comprimento')}
          />
          <Text>cm</Text>
        </WrapItem>
        <WrapItem flexDirection="column" w="30%">
          <FormLabel>Largura:</FormLabel>
          <Input defaultValue={produto.largura || 0} {...register('largura')} />
          <Text>cm</Text>
        </WrapItem>
        <WrapItem flexDirection="column" w="30%">
          <FormLabel>Altura:</FormLabel>
          <Input defaultValue={produto.altura || 0} {...register('altura')} />
          <Text>cm</Text>
        </WrapItem>
      </Wrap>

      <Box position="fixed" bottom={20}>
        <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
          GRAVAR
        </Button>
      </Box>
    </form>
  )
}

export default Cadastro
