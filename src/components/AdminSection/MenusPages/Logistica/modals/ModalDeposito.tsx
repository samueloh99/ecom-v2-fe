import React, { useEffect, useState } from 'react'

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
  RadioGroup,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
  FormErrorMessage,
  Radio,
  Stack,
  Input
} from '@chakra-ui/react'

import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'
import { useDepositos } from '../../../../../services/hooks/useConfiguracoes'

const validationSchema = yup
  .object({
    lembrete: yup.string().required('Campo Obrigatório'),
    cep_deposito: yup.string().required('Campo Obrigatório'),
    cep_minimo: yup.string().required('Campo Obrigatório'),
    cep_maximo: yup.string().required('Campo Obrigatório')
  })
  .required()

type addDepositoFormData = {
  lembrete: string
  cep_deposito: string
  cep_minimo: string
  cep_maximo: string
}

const ModalDeposito = ({ onClose, isOpen }) => {
  const toast = useToast()

  const { data, isSuccess, isLoading } = useDepositos()

  const [ativo, setAtivo] = useState('1')

  useEffect(() => {
    isSuccess && data.length > 0 && setAtivo(String(data[0].ativo))
  }, [data, isSuccess])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const addDeposito = useMutation(
    async (newValuesObj: addDepositoFormData) => {
      try {
        const checkIfDataExists = isSuccess && data.length >= 1
        if (checkIfDataExists) {
          const response = await api.patch(
            `/configuracoes/depositos/editar/${data[0].id}`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao atualizar.',
            description: 'Deposito foi atualizado com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        } else {
          const response = await api.post(
            `/configuracoes/depositos`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao criar.',
            description: 'Deposito foi criado com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        }
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
        queryClient.invalidateQueries('erps')
      }
    }
  )

  const handleAddDeposito: SubmitHandler<
    addDepositoFormData
  > = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ativo: parseInt(ativo),
      ...values
    }

    await addDeposito.mutateAsync(newObj)
  }

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(handleAddDeposito)}>
            <ModalHeader>Depósito</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column">
                <Stack direction="column">
                  <RadioGroup onChange={setAtivo} value={ativo}>
                    <Stack direction="row">
                      <Radio value="1">Ativo</Radio>
                      <Radio value="2">Inativo</Radio>
                    </Stack>
                  </RadioGroup>
                  <Stack>
                    <FormControl isInvalid={!!errors.lembrete}>
                      <FormLabel htmlFor="lembrete">Nome Lembrete</FormLabel>
                      <Input
                        id="lembrete"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].lembrete : ''
                        }
                        {...register('lembrete')}
                      />
                      {!!errors.lembrete && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.cep_deposito}>
                      <FormLabel htmlFor="cep_deposito">Cep Deposito</FormLabel>
                      <Input
                        id="cep_deposito"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].cep_deposito
                            : ''
                        }
                        {...register('cep_deposito')}
                      />
                      {!!errors.cep_deposito && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.cep_minimo}>
                      <FormLabel htmlFor="cep_minimo">
                        Entrega Cep Minimo
                      </FormLabel>
                      <Input
                        id="cep_minimo"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].cep_minimo : ''
                        }
                        {...register('cep_minimo')}
                      />
                      {!!errors.cep_minimo && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.cep_maximo}>
                      <FormLabel htmlFor="cep_maximo">
                        Entrega Cep Maximo
                      </FormLabel>
                      <Input
                        id="cep_maximo"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].cep_maximo : ''
                        }
                        {...register('cep_maximo')}
                      />
                      {!!errors.cep_maximo && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                </Stack>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button bg="black" color="white" onClick={onClose} mr="5">
                Fechar
              </Button>
              <Button
                bg="pink.500"
                color="white"
                onClick={onClose}
                type="submit"
                isLoading={isSubmitting}
              >
                Salvar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalDeposito
