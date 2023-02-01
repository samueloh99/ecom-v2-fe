import React, { useState, useEffect } from 'react'

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
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Divider,
  RadioGroup,
  Radio,
  Input
} from '@chakra-ui/react'

import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'
import { useErps } from '../../../../../services/hooks/useConfiguracoes'

const validationSchema = yup
  .object({
    api_key: yup.string().required('Campo Obrigatório'),
    codigo_deposito: yup.string().required('Campo Obrigatório')
  })
  .required()

type AddErpFormData = {
  api_key: string
  codigo_deposito: string
}

const ModalBling = ({ onClose, isOpen }) => {
  const toast = useToast()
  const { data, isSuccess, isLoading } = useErps()
  const [ativoValue, setAtivoValue] = useState('1')

  useEffect(() => {
    isSuccess && data.length > 0 && setAtivoValue(String(data[0].ativo))
  }, [data, isSuccess])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const addErp = useMutation(
    async (newValuesObj: AddErpFormData) => {
      try {
        const checkIfDataExists = isSuccess && data.length >= 1
        if (checkIfDataExists) {
          const response = await api.patch(
            `/configuracoes/erps/editar/${data[0].id}`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao atualizar.',
            description: 'Erp foi atualizado com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        } else {
          const response = await api.post(`/configuracoes/erps`, newValuesObj)
          toast({
            title: 'Sucesso ao criar.',
            description: 'Erp foi criado com sucesso',
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

  const handleAddErp: SubmitHandler<AddErpFormData> = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ativo: parseInt(ativoValue),
      ...values
    }

    await addErp.mutateAsync(newObj)
  }
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(handleAddErp)}>
            <ModalHeader>Bling</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column">
                <Stack direction="column">
                  <Text fontWeight="bold">DADOS DA PRODUCAO</Text>
                  <Divider />
                  <Stack>
                    <RadioGroup onChange={setAtivoValue} value={ativoValue}>
                      <Stack direction="row">
                        <Radio value="1">Ativo</Radio>
                        <Radio value="2">Inativo</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.api_key}>
                      <FormLabel htmlFor="api_key">Api Key</FormLabel>
                      <Input
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].api_key : ''
                        }
                        id="api_key"
                        {...register('api_key')}
                      />
                      {!!errors && (
                        <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.codigo_deposito}>
                      <FormLabel htmlFor="codigo_deposito">
                        Codigo Deposito
                      </FormLabel>
                      <Input
                        id="codigo_deposito"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].codigo_deposito
                            : ''
                        }
                        {...register('codigo_deposito')}
                      />
                      {!!errors && (
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
                Ativar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalBling
