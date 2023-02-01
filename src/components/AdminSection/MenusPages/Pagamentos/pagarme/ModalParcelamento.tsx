import React, { useState } from 'react'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  Stack,
  useToast,
  Input,
  HStack,
  Box,
  Select,
  Icon,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Th,
  Td
} from '@chakra-ui/react'

import { AiFillCheckCircle, AiFillDelete } from 'react-icons/ai'
import { useParcelas } from '../../../../../services/hooks/useConfiguracoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    taxa: yup.number().required('Campo Obrigatório'),
    valor: yup.number().required('Campo Obrigatório')
  })
  .required()

type ParcelamentoFormData = {
  id: number
  ativo: number
  parcela: number
  tipo: number
  taxa: number
  valor: number
}

type UpdateParcelaFormData = {
  id: number
  ativo: number
}

const ModalParcelamento = ({ onClose, isOpen }) => {
  const toast = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  let countParcelas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const [ativoValue, setAtivoValue] = useState('1')

  const [qtdParcelas, setQtdParcelas] = useState(0)
  const [tipoJuros, setTipoJuros] = useState(0)

  const {
    data: dataParcela,
    isSuccess: isSuccessParcela,
    isLoading: isLoadingParcela
  } = useParcelas()

  dataParcela &&
    dataParcela.map(item => {
      const index = countParcelas.indexOf(item.parcela)
      if (countParcelas.includes(item.parcela)) {
        countParcelas.splice(index, 1)
      }
    })

  const addParcelamento = useMutation(
    async (newValuesObj: ParcelamentoFormData) => {
      try {
        const response = await api.post(`/configuracoes/parcelas`, newValuesObj)

        toast({
          title: 'Sucesso ao adicionar.',
          description: 'Parcela foi adicionado com sucesso',
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
        queryClient.invalidateQueries('parcelas_config')
      }
    }
  )

  const removeParcela = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(
          `/configuracoes/parcelas/deletar/${id}`
        )

        toast({
          title: 'Sucesso ao remover.',
          description: 'Parcela foi removido com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao remover.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('parcelas_config')
      }
    }
  )

  const updateParcela = useMutation(
    async (values: UpdateParcelaFormData) => {
      try {
        const response = await api.patch(
          `/configuracoes/parcelas/editar/${values.id}`,
          { ativo: values.ativo }
        )

        return response.data
      } catch (err) {
        console.log(err)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('parcelas_config')
      }
    }
  )

  const handleRemoveParcela = async (id: number) => {
    await removeParcela.mutateAsync(id)
  }

  const handleUpdateParcela = async (value: UpdateParcelaFormData) => {
    console.log(value)
    let obj
    if (value.ativo === 1) {
      obj = {
        id: value.id,
        ativo: 0
      }
    } else {
      obj = {
        id: value.id,
        ativo: 1
      }
    }
    await updateParcela.mutateAsync(obj)
  }

  const handleAddParcela: SubmitHandler<
    ParcelamentoFormData
  > = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ...values,
      ativo: parseInt(ativoValue),
      parcela: qtdParcelas,
      tipo: tipoJuros
    }

    await addParcelamento.mutateAsync(newObj)
  }
  return isLoadingParcela ? (
    <Spinner />
  ) : (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Parcelamento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleAddParcela)}>
            <Flex direction="column">
              <Box borderWidth="1px" borderRadius="lg" p="10px">
                <HStack alignItems="center">
                  <Stack>
                    <Text>Ativo:</Text>
                    <RadioGroup onChange={setAtivoValue} value={ativoValue}>
                      <Stack direction="row">
                        <Radio value="1">Ativo</Radio>
                        <Radio value="0">Inativo</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                  <Stack w="140px">
                    <FormLabel>Parcela:</FormLabel>
                    <Select
                      value={qtdParcelas}
                      onChange={e => setQtdParcelas(parseInt(e.target.value))}
                    >
                      <option value={0}>Escolher</option>
                      {countParcelas.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}x
                          </option>
                        )
                      })}
                    </Select>
                  </Stack>

                  <Stack w="200px">
                    <FormLabel>Tipo:</FormLabel>
                    <Select
                      value={tipoJuros}
                      onChange={e => setTipoJuros(parseInt(e.target.value))}
                    >
                      <option value={0}>Sem Juros</option>
                      <option value={1}>Desconto</option>
                      <option value={2}>Juros Composto</option>
                      <option value={3}>Juros Simples</option>
                    </Select>
                  </Stack>
                </HStack>

                <HStack alignItems="end">
                  <Stack>
                    <FormControl isInvalid={!!errors.valor}>
                      <FormLabel htmlFor="valor">Valor</FormLabel>
                      <Input
                        w="100px"
                        id="valor"
                        type="number"
                        {...register('valor')}
                      />
                      {!!errors.valor && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>

                  <Stack>
                    <FormControl isInvalid={!!errors.taxa}>
                      <FormLabel htmlFor="taxa">Taxa</FormLabel>
                      <Input
                        w="100px"
                        id="taxa"
                        type="number"
                        {...register('taxa')}
                      />
                      {!!errors.taxa && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <Button
                      bg="pink.500"
                      color="white"
                      w="100px"
                      type="submit"
                      colorScheme="pink"
                      isLoading={isSubmitting}
                    >
                      Adicionar
                    </Button>
                  </Stack>
                </HStack>
              </Box>
            </Flex>

            <Box borderWidth="1px" borderRadius="lg" mt="50px" mb="50px">
              <Table size="sm" colorScheme="whiteAlpha" width="100%" m="auto">
                <Thead>
                  <Tr>
                    <Th>Ativo</Th>
                    <Th>Parcela</Th>
                    <Th>Tipo</Th>
                    <Th>Taxa</Th>
                    <Th>Valor</Th>
                    <Th>Apagar</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataParcela.length > 0 &&
                    dataParcela.map((item, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <Icon
                              as={AiFillCheckCircle}
                              size={20}
                              cursor="pointer"
                              onClick={() =>
                                handleUpdateParcela({
                                  id: item.id,
                                  ativo: item.ativo
                                })
                              }
                              color={item.ativo === 1 ? 'green' : 'red'}
                            />
                          </Td>
                          <Td>{item.parcela}</Td>
                          <Td>{item.tipo}</Td>
                          <Td>{item.taxa}</Td>
                          <Td>{item.valor}</Td>
                          <Td>
                            <Icon
                              as={AiFillDelete}
                              size={20}
                              color="red"
                              cursor="pointer"
                              onClick={() => handleRemoveParcela(item.id)}
                            />
                          </Td>
                        </Tr>
                      )
                    })}
                </Tbody>
              </Table>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ModalParcelamento
