import React from 'react'

import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
  FormErrorMessage,
  Stack,
  Input,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Icon
} from '@chakra-ui/react'

import { AiFillCheckCircle, AiFillDelete } from 'react-icons/ai'
import { useFretes } from '../../../../../services/hooks/useConfiguracoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const fretes = [
  {
    ativo: 0,
    lembrete: 'Frete gratis',
    cepMin: '01141-000',
    cepMax: '01132-000',
    compraMin: 'R$100,00',
    compraMax: 'R$10000,00',
    validoAte: '01/01/22',
    valideDe: '01/01/22',
    atualizado: '02/03/21 12:32'
  }
]

const validationSchema = yup
  .object({
    lembrete: yup.string().required('Campo Obrigatório'),
    cep_minimo: yup.string().required('Campo Obrigatório'),
    cep_maximo: yup.string().required('Campo Obrigatório'),
    compra_minima: yup.string().required('Campo Obrigatório'),
    compra_maxima: yup.string().required('Campo Obrigatório'),
    valido_de: yup.string().required('Campo Obrigatório'),
    valido_ate: yup.string().required('Campo Obrigatório')
  })
  .required()

type addFreteFormData = {
  id: number
  ativo: number
  lembrete: string
  cep_minimo: string
  cep_maximo: string
  compra_minima: string
  compra_maxima: string
  valido_de: string
  valido_ate: string
}

type updateFreteFormData = {
  ativo: number
  id: number
}

const ModalFretes = ({ onClose, isOpen }) => {
  const toast = useToast()

  const { data, isLoading, isSuccess } = useFretes()

  const {
    isOpen: isOpenFrete,
    onOpen: onOpenFrete,
    onClose: onCloseFrete
  } = useDisclosure()

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const addFrete = useMutation(
    async (newValuesObj: addFreteFormData) => {
      try {
        const response = await api.post(`/configuracoes/fretes`, newValuesObj)
        toast({
          title: 'Sucesso ao criar.',
          description: 'Frete foi criado com sucesso',
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
        queryClient.invalidateQueries('fretes')
      }
    }
  )

  const updateFrete = useMutation(
    async (newValuesObj: updateFreteFormData) => {
      try {
        const response = await api.patch(
          `/configuracoes/fretes/editar/${newValuesObj.id}`,
          { ativo: newValuesObj.ativo }
        )
        toast({
          title: 'Sucesso ao atualizar.',
          description: 'Frete foi atualizado com sucesso',
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
        queryClient.invalidateQueries('fretes')
      }
    }
  )

  const deleteFrete = useMutation(
    async (id: number) => {
      try {
        const response = await api.delete(`/configuracoes/fretes/deletar/${id}`)
        toast({
          title: 'Sucesso ao apagar.',
          description: 'Frete foi apagado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao apagar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fretes')
      }
    }
  )

  const handleDeleteFrete = async (id: number) => {
    await deleteFrete.mutateAsync(id)
  }

  const handleChangeAtivoValue = async (id: number) => {
    const findFreteById = data.find(item => item.id === id)

    const newObj = {
      ativo: findFreteById.ativo === 1 ? 2 : 1,
      id: id
    }

    await updateFrete.mutateAsync(newObj)
  }

  const handleAddFrete: SubmitHandler<addFreteFormData> = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ativo: 1,
      ...values
    }

    await addFrete.mutateAsync(newObj)
    resetField('valido_de')
    resetField('valido_ate')
    resetField('cep_minimo')
    resetField('cep_maximo')
    resetField('compra_minima')
    resetField('compra_maxima')
    resetField('lembrete')
  }

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent maxWidth="80%">
        <ModalHeader>Fretes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column">
            <form onSubmit={handleSubmit(handleAddFrete)}>
              <Stack direction="row">
                <Stack>
                  <FormControl isInvalid={!!errors.valido_de}>
                    <FormLabel htmlFor="valido_de">Validade de</FormLabel>
                    <Input id="valido_de" {...register('valido_de')} />
                    {!!errors.valido_de && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.valido_ate}>
                    <FormLabel htmlFor="valido_ate">Validade até</FormLabel>
                    <Input id="valido_ate" {...register('valido_ate')} />
                    {!!errors.valido_ate && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>

              <Stack direction="row">
                <Stack>
                  <FormControl isInvalid={!!errors.cep_minimo}>
                    <FormLabel htmlFor="cep_minimo">
                      Entrega CEP Mínimo
                    </FormLabel>
                    <Input id="cep_minimo" {...register('cep_minimo')} />
                    {!!errors.cep_minimo && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.cep_maximo}>
                    <FormLabel htmlFor="cep_maximo">
                      Entrega CEP Máximo
                    </FormLabel>
                    <Input id="cep_maximo" {...register('cep_maximo')} />
                    {!!errors.cep_maximo && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>

              <Stack direction="row">
                <Stack>
                  <FormControl isInvalid={!!errors.compra_minima}>
                    <FormLabel htmlFor="compra_minima">Compra Mínima</FormLabel>
                    <Input id="compra_minima" {...register('compra_minima')} />
                    {!!errors.compra_minima && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.compra_maxima}>
                    <FormLabel htmlFor="compra_maxima">Compra Máxima</FormLabel>
                    <Input id="compra_maxima" {...register('compra_maxima')} />
                    {!!errors.compra_maxima && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
              <Stack>
                <FormControl isInvalid={!!errors.lembrete}>
                  <FormLabel htmlFor="lembrete">Lembrete</FormLabel>
                  <Input id="lembrete" {...register('lembrete')} />
                  {!!errors.lembrete && (
                    <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>

              <Button
                mt="10px"
                bg="pink.500"
                color="white"
                w="200px"
                type="submit"
                isLoading={isSubmitting}
              >
                Adicionar
              </Button>
            </form>

            <Divider margin="30px 0px 30px 0px" />

            <Table variant="simple" size="sm" fontSize="10px">
              <Thead>
                <Tr>
                  <Th fontSize={8}>Ativo</Th>
                  <Th fontSize={8}>Lembrete</Th>
                  <Th fontSize={8}>Cep Mín.</Th>
                  <Th fontSize={8}>Cep Máx.</Th>
                  <Th fontSize={8}>Compra Mín.</Th>
                  <Th fontSize={8}>Compra Máx.</Th>
                  <Th fontSize={8}>Válido de</Th>
                  <Th fontSize={8}>Válido até</Th>
                  <Th fontSize={8}>Atualizado</Th>
                  <Th fontSize={8}>Apagar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Spinner />
                ) : (
                  data.map((item, index) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Icon
                            color={item.ativo === 1 ? 'green' : 'red'}
                            fontSize={16}
                            as={AiFillCheckCircle}
                            cursor="pointer"
                            onClick={() => handleChangeAtivoValue(item.id)}
                          />
                        </Td>
                        <Td
                          fontSize={11}
                          w="200px"
                          onClick={() => onOpenFrete()}
                        >
                          {item.lembrete}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.cep_minimo}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.cep_maximo}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.cep_minimo}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.cep_maximo}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.valido_de}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.valido_ate}
                        </Td>
                        <Td fontSize={11} w="150px">
                          {item.updated_at.toString()}
                        </Td>
                        <Td>
                          <Icon
                            color="red"
                            fontSize={16}
                            as={AiFillDelete}
                            cursor="pointer"
                            onClick={() => handleDeleteFrete(item.id)}
                          />
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button bg="black" color="white" onClick={onClose} mr="5">
            Fechar
          </Button>
          <Button bg="pink.500" color="white" onClick={onClose}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>

      <Modal onClose={onCloseFrete} size="sm" isOpen={isOpenFrete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Frete:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <Stack direction="row">
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Validade de
                  </Text>
                  <Input w="100%" />
                </Stack>
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Validade até
                  </Text>
                  <Input w="100%" />
                </Stack>
              </Stack>

              <Stack direction="row">
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Entrega CEP Mínimo
                  </Text>
                  <Input w="100%" />
                </Stack>
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Entrega CEP Máximo
                  </Text>
                  <Input w="100%" />
                </Stack>
              </Stack>

              <Stack direction="row">
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Compra Mínima
                  </Text>
                  <Input w="100%" />
                </Stack>
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Compra Máxima
                  </Text>
                  <Input w="100%" />
                </Stack>
              </Stack>
              <Stack>
                <Text fontSize={13} fontWeight="bold">
                  Lembrete
                </Text>
                <Input w="100%" />
              </Stack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button bg="black" color="white" onClick={onCloseFrete} mr="5">
              Cancelar
            </Button>
            <Button bg="pink.500" color="white" onClick={onCloseFrete}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  )
}

export default ModalFretes
