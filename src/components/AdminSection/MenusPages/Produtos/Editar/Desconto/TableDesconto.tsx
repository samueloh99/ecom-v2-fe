import React, { useState, useEffect } from 'react'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { useRouter } from 'next/router'

import {
  Th,
  Table,
  Thead,
  Tbody,
  useDisclosure,
  useToast,
  Td,
  Flex,
  Spinner,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  FormLabel,
  Select,
  Button,
  FormControl,
  Text
} from '@chakra-ui/react'

import { useDescontos } from '../../../../../../services/hooks/useDescontos'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'
import { dataMask, validateDesconto } from '../../../../../../../utils/masks'

type DescontoAddFormData = {
  desconto_tipo: number
  desconto_valor: number
  data_desconto_1: Date
  data_desconto_2: Date
}

const TableDesconto = () => {
  const router = useRouter()

  const toast = useToast()

  const { slug } = router.query

  const { data, isLoading } = useDescontos()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [invalidate, setInvalidate] = useState(false)

  const [descontoForm, setDescontoForm] = useState({
    desconto_tipo: 0,
    desconto_valor: '',
    data_desconto_1: '',
    data_desconto_2: ''
  })

  useEffect(() => {
    try {
      const filteredDesconto = data.filter(
        item => item.produto_id === parseInt(slug[0])
      )
      if (filteredDesconto.length > 0) {
        setDescontoForm({
          ...descontoForm,
          desconto_tipo: filteredDesconto[0].desconto_tipo
        })
      }
    } catch (err) {}
  }, [data])

  const updateDesconto = useMutation(
    async (descontoToAdd: DescontoAddFormData) => {
      try {
        const response = await api.patch(
          `/descontos/editar/${
            data.filter(item => item.produto_id === parseInt(slug[0]))[0].id
          }`,
          descontoToAdd
        )

        toast({
          title: 'Sucesso ao atualizar Desconto.',
          description: 'Desconto foi atualizado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao Atualizar o Desconto.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('descontos')
      }
    }
  )

  const deleteDesconto = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/descontos/apagar/${id}`)

        toast({
          title: 'Apagado com Sucesso.',
          description: 'O desconto foi apagado.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao Apagar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('descontos')
      }
    }
  )

  const handleUpdate = async () => {
    if (descontoForm.desconto_tipo === 0) {
      return setInvalidate(true)
    }

    if (parseFloat(descontoForm.desconto_valor) < 0) {
      return setInvalidate(true)
    }

    const date1Splitted = descontoForm.data_desconto_1.split('/')
    const date2Splitted = descontoForm.data_desconto_2.split('/')

    if (validateDesconto(descontoForm.data_desconto_1) === false) {
      return setInvalidate(true)
    }

    if (validateDesconto(descontoForm.data_desconto_2) === false) {
      return setInvalidate(true)
    }

    const date1 = new Date(
      `${date1Splitted[1]}/${date1Splitted[0]}/${date1Splitted[2]}`
    ).getTime()

    const date2 = new Date(
      `${date2Splitted[1]}/${date2Splitted[0]}/${date2Splitted[2]}`
    ).getTime()

    if (date1 == date2) {
      return setInvalidate(true)
    }

    if (date1 > date2 || date2 < date1) {
      return setInvalidate(true)
    }

    setInvalidate(false)

    const descontoToUpdate = {
      produto_id: parseInt(slug[0]),
      desconto_tipo: descontoForm.desconto_tipo,
      desconto_valor: parseFloat(descontoForm.desconto_valor),
      data_desconto_1: new Date(
        `${date1Splitted[1]}/${date1Splitted[0]}/${date1Splitted[2]}`
      ),
      data_desconto_2: new Date(
        `${date2Splitted[1]}/${date2Splitted[0]}/${date2Splitted[2]}`
      )
    }

    await updateDesconto.mutateAsync(descontoToUpdate)

    onClose()
  }

  const handleDelete = async (id: number) => {
    await deleteDesconto.mutateAsync(id)
  }

  const handleClickOnEdit = (id: number) => {
    onOpen()
    const desconto = data.find(item => item.id === id)

    const date1d = String(
      new Date(desconto.data_desconto_1).getDate()
    ).padStart(2, '0')
    const date1m = String(
      new Date(desconto.data_desconto_1).getMonth()
    ).padStart(2, '0')
    const date1y = String(new Date(desconto.data_desconto_1).getFullYear())

    const date2d = String(
      new Date(desconto.data_desconto_2).getDate()
    ).padStart(2, '0')
    const date2m = String(
      new Date(desconto.data_desconto_2).getMonth()
    ).padStart(2, '0')
    const date2y = String(new Date(desconto.data_desconto_2).getFullYear())

    const date1 = `${date1d}/${date1m}/${date1y}`
    const date2 = `${date2d}/${date2m}/${date2y}`

    setDescontoForm({
      data_desconto_1: date1,
      data_desconto_2: date2,
      desconto_tipo: desconto.desconto_tipo,
      desconto_valor: String(desconto.desconto_valor)
    })
  }

  return isLoading ? (
    <Flex justifyContent="center" paddingTop="5">
      <Spinner />
    </Flex>
  ) : (
    <Table colorScheme="whiteAlpha" m="auto" mt="10" width="100%">
      <Thead>
        <Tr>
          <Th>Desconto</Th>
          <Th>Válido de</Th>
          <Th>Válido até</Th>
          <Th>Atualizado</Th>
          <Th>Apagar</Th>
          <Th>Editar</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data
          .filter(item => item.produto_id === parseInt(slug[0]))
          .map((item, index) => {
            return (
              <Tr key={index}>
                <Td>
                  {item.desconto_tipo === 1
                    ? `R$${item.desconto_valor}`
                    : `${item.desconto_valor}%`}
                </Td>
                <Td>
                  {new Date(item.data_desconto_1).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Td>
                <Td>
                  {new Date(item.data_desconto_2).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Td>
                <Td>
                  {new Date(item.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Td>
                <Td>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    colorScheme="pink"
                  >
                    Apagar
                  </Button>
                </Td>
                <Td>
                  <Button
                    onClick={() => handleClickOnEdit(item.id)}
                    colorScheme="pink"
                  >
                    Editar
                  </Button>
                  <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Editar Desconto</ModalHeader>

                      <ModalCloseButton />
                      <ModalBody>
                        <Flex
                          flexDirection="column"
                          justifyContent="space-between"
                        >
                          {invalidate && (
                            <Text color="red" mt="10px">
                              Desconto Inválido
                            </Text>
                          )}
                          <Stack>
                            <FormControl>
                              <FormLabel>Desconto Tipo</FormLabel>
                              <Select
                                value={descontoForm.desconto_tipo}
                                onChange={e =>
                                  setDescontoForm({
                                    ...descontoForm,
                                    desconto_tipo: parseInt(e.target.value)
                                  })
                                }
                              >
                                <option value={0}>Escolher</option>
                                <option value={1}>Valor R$</option>
                                <option value={2}>Porcentagem %</option>
                              </Select>
                            </FormControl>
                          </Stack>
                          <Stack>
                            <FormControl>
                              <FormLabel>Desconto Valor</FormLabel>
                              <Input
                                id="desconto_valor"
                                maxLength={6}
                                value={descontoForm.desconto_valor}
                                onChange={e =>
                                  setDescontoForm({
                                    ...descontoForm,
                                    desconto_valor: e.target.value
                                  })
                                }
                              />
                            </FormControl>
                          </Stack>
                          <Stack>
                            <FormControl>
                              <FormLabel>Desde</FormLabel>
                              <Input
                                id="data_desconto_1"
                                w="200px"
                                maxLength={10}
                                value={descontoForm.data_desconto_1}
                                onChange={e =>
                                  setDescontoForm({
                                    ...descontoForm,
                                    data_desconto_1: dataMask(e.target.value)
                                  })
                                }
                              />
                            </FormControl>
                          </Stack>
                          <Stack>
                            <FormControl>
                              <FormLabel>Até</FormLabel>
                              <Input
                                id="data_desconto_2"
                                w="200px"
                                maxLength={10}
                                value={descontoForm.data_desconto_2}
                                onChange={e =>
                                  setDescontoForm({
                                    ...descontoForm,
                                    data_desconto_2: dataMask(e.target.value)
                                  })
                                }
                              />
                            </FormControl>
                          </Stack>
                          <Flex
                            mt="50px"
                            alignContent="center"
                            w="100%"
                            justifyContent="space-between"
                          >
                            <Button colorScheme="pink" onClick={handleUpdate}>
                              Editar
                            </Button>
                            <Button colorScheme="pink" mr={3} onClick={onClose}>
                              Close
                            </Button>
                          </Flex>
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Td>
              </Tr>
            )
          })}
      </Tbody>
    </Table>
  )
}

export default TableDesconto
