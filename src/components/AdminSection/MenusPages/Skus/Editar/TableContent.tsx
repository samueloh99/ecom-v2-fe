import React, { useState, useEffect } from 'react'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { useRouter } from 'next/router'

import {
  Text,
  Stack,
  WrapItem,
  RadioGroup,
  Radio,
  Wrap,
  Divider,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  Th,
  Table,
  Thead,
  Box,
  Tbody,
  useToast,
  Tr,
  Td,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  Button,
  FormErrorMessage,
  FormLabel,
  Select,
  Flex,
  Spinner
} from '@chakra-ui/react'

import { useSkus } from '../../../../../services/hooks/useSkus'
import { useVariacoes } from '../../../../../services/hooks/useVariacoes'
import { useMovimentacoes } from '../../../../../services/hooks/useMovimentacoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup.object({
  referencia: yup.string(),
  preco_custo: yup.number(),
  preco_venda: yup.number(),
  peso: yup.number(),
  gtin: yup.string(),
  mpn: yup.string(),
  estoque: yup.number()
})

type SkusUpdateFormData = {
  var1_id: number
  var2_id: number
  ativo: number
  referencia: string
  preco_custo: number
  preco_venda: number
  produto_id: number
  peso: number
  gtin: null
  mpn: null
}

type MovimentacoesAddData = {
  quantidade: number
  lancamento: string
  sku_id: number
}

const TableContent = () => {
  const router = useRouter()

  const { slug } = router.query

  const { data: skusData, isSuccess: skusSuccess } = useSkus('', 1, 99999999)

  const { data: variacoesData, isSuccess: variacoesSuccess } = useVariacoes()

  const { data: movimentacoesData, isSuccess: movimentacoesSuccess } =
    useMovimentacoes()

  const fetchedAllData = skusSuccess && variacoesSuccess && movimentacoesSuccess
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  const [ativoValue, setAtivoValue] = useState('1')
  const [variacao1, setVariacao1] = useState(0)
  const [variacao2, setVariacao2] = useState(0)
  const [lancamento, setLancamento] = useState('entrada')
  const [estoqueQtd, setEstoqueQtd] = useState('0')

  useEffect(() => {
    if (skusSuccess) {
      const skuFiltered = skusData.skus.find(
        item => item.id === parseInt(slug[0])
      )
      setAtivoValue(skuFiltered.ativo.toString())
      setVariacao1(skuFiltered.var1_id)
      setVariacao2(skuFiltered.var2_id)
    }
  }, [variacoesData, skusData])

  const var1PaiId =
    variacoesData && variacoesData.find(item => item.nome === 'Cor').id
  const var2PaiId =
    variacoesData && variacoesData.find(item => item.nome === 'Tamanho').id

  const skuFiltered =
    fetchedAllData && skusData.skus.find(item => item.id === parseInt(slug[0]))

  const updateSku = useMutation(
    async (newSkuObj: SkusUpdateFormData) => {
      try {
        const response = await api.patch(
          `/skus/editar/${skuFiltered.id}`,
          newSkuObj
        )
        if (response.data) {
          toast({
            title: 'Sucesso ao atualizar.',
            description: 'Sku foi atualizado com sucesso',
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

  const handleUpdate: SubmitHandler<SkusUpdateFormData> = async values => {
    const newSkuObj = {
      ...values,
      ativo: parseInt(ativoValue),
      var1_id: variacao1,
      produto_id: skuFiltered.produto_id,
      var2_id: variacao2
    }

    await updateSku.mutateAsync(newSkuObj)
  }

  const handleAddMovimentacao = async () => {
    const newMovimentacao = {
      quantidade: parseInt(estoqueQtd),
      lancamento: lancamento,
      sku_id: skuFiltered.id
    }
    await addMovimentacao.mutateAsync(newMovimentacao)
    onClose()
  }

  return fetchedAllData === false ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <Flex flexDirection="column">
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
        <Stack flexDirection="row">
          <FormControl isInvalid={!!errors.referencia}>
            <FormLabel htmlFor="referencia">Referência Sku</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.referencia}
              id="referencia"
              {...register('referencia')}
            />
            {!!errors.referencia && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.gtin}>
            <FormLabel htmlFor="gtin">Gtin</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.gtin}
              id="gtin"
              {...register('gtin')}
            />
            {!!errors.gtin && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.mpn}>
            <FormLabel htmlFor="mpn">Mpn</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.mpn}
              id="mpn"
              {...register('mpn')}
            />
            {!!errors.mpn && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
        </Stack>

        <Divider m="40px 0px" />

        <Wrap w="100%" justify="space-between" spacing={5}>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Variação 1:</FormLabel>
            <Select
              value={variacao1}
              onChange={e => setVariacao1(parseInt(e.target.value))}
            >
              <option value={0}>Escolher</option>
              {variacoesData
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
          </WrapItem>

          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Variação 2:</FormLabel>
            <Select
              value={variacao2}
              onChange={e => setVariacao2(parseInt(e.target.value))}
            >
              <option value={0}>Escolher</option>

              {variacoesData
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
          </WrapItem>
        </Wrap>

        <Divider m="40px 0px" />

        <Stack flexDirection="row">
          <FormControl isInvalid={!!errors.preco_custo}>
            <FormLabel htmlFor="nome">Preço Custo</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.preco_custo || 0}
              id="preco_custo"
              {...register('preco_custo')}
            />
            {!!errors.preco_custo && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.preco_venda}>
            <FormLabel htmlFor="nome">Preço Venda</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.preco_venda}
              id="preco_venda"
              {...register('preco_venda')}
            />
            {!!errors.preco_venda && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.peso}>
            <FormLabel htmlFor="nome">Peso</FormLabel>
            <Input
              w="300px"
              defaultValue={skuFiltered.peso}
              id="peso"
              {...register('peso')}
            />
            {!!errors.peso && (
              <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
            )}
          </FormControl>
        </Stack>

        <Divider m="40px 0px" />
        <Flex direction="column" justifyContent="space-between">
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Adicionar Estoque</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex>
                  <FormLabel htmlFor="nome">Quantidade</FormLabel>
                  <Input
                    w="300px"
                    id="quantidade"
                    type="number"
                    onChange={e => setEstoqueQtd(e.target.value)}
                    value={estoqueQtd}
                  />
                </Flex>
                <Flex mt="50px">
                  <FormLabel>Lançamento:</FormLabel>
                  <RadioGroup onChange={setLancamento} value={lancamento}>
                    <Stack direction="row">
                      <Radio value="entrada">Entrada</Radio>
                      <Radio value="saida">Saída</Radio>
                      <Radio value="balanco">Balanço</Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="pink" mr={3} onClick={onClose}>
                  Fechar
                </Button>
                <Button colorScheme="pink" onClick={handleAddMovimentacao}>
                  Adicionar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Flex
            direction="row"
            justifyContent="space-between"
            alignContent="center"
          >
            <Text fontWeight="bold">Estoque: {skuFiltered.estoque}</Text>
            <Button colorScheme="pink" w="100px" onClick={onOpen}>
              Adicionar
            </Button>
          </Flex>

          <Table colorScheme="whiteAlpha" width="100%" m="auto">
            <Thead>
              <Tr>
                <Th>Atualizado</Th>
                <Th>Quantidade</Th>
                <Th>Lançamento</Th>
              </Tr>
            </Thead>
            <Tbody>
              {movimentacoesData.movimentacoes
                .filter(item => item.sku_id === parseInt(slug[0]))
                .map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        {new Date(item.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric'
                        })}
                      </Td>
                      <Td>{item.quantidade}</Td>
                      <Td>{item.lancamento}</Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
        </Flex>

        <Box position="fixed" bottom={20}>
          <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
            GRAVAR
          </Button>
        </Box>
      </Flex>
    </form>
  )
}

export default TableContent
