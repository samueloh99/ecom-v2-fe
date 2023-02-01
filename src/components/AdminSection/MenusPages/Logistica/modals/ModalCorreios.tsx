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
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Divider,
  useToast,
  Select,
  Stack,
  Input
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { useCorreios } from '../../../../../services/hooks/useConfiguracoes'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    cnpj: yup.string().required('Campo Obrigatório'),
    cartao_postagem: yup.string().required('Campo Obrigatório'),
    codigo_adm: yup.string().required('Campo Obrigatório'),
    titular: yup.string().required('Campo Obrigatório'),
    central: yup.string().required('Campo Obrigatório'),
    usuario_sigep: yup.string().required('Campo Obrigatório'),
    senha_sigep: yup.string().required('Campo Obrigatório')
  })
  .required()

type addCorreiosFormData = {
  cnpj: string
  cartao_postagem: string
  codigo_adm: string
  titular: string
  central: string
  usuario_sigep: string
  senha_sigep: string
}

const ModalCorreios = ({ onClose, isOpen }) => {
  const toast = useToast()

  const [ativo, setAtivo] = useState('1')
  const [servicoPac, setServicoPac] = useState(0)
  const [servicoSedex, setServicoSedex] = useState(0)

  const { data, isSuccess, isLoading } = useCorreios()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if (isSuccess) {
      data.length > 0 && setAtivo(String(data[0].ativo))
      data.length > 0 && setServicoPac(parseInt(data[0].pac_cod))
      data.length > 0 && setServicoSedex(parseInt(data[0].sedex_cod))
    }
  }, [data, isSuccess])

  const addCorreios = useMutation(
    async (newValuesObj: addCorreiosFormData) => {
      try {
        const checkIfDataExists = isSuccess && data.length >= 1
        if (checkIfDataExists) {
          const response = await api.patch(
            `/configuracoes/correios/editar/${data[0].id}`,
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
            `/configuracoes/correios`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao criar.',
            description: 'Correios foi criado com sucesso',
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
        queryClient.invalidateQueries('correios_config')
      }
    }
  )

  const handleAddCorreios: SubmitHandler<
    addCorreiosFormData
  > = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ativo: parseInt(ativo),
      ...values,
      pac_cod: String(servicoPac),
      sedex_cod: String(servicoSedex)
    }
    await addCorreios.mutateAsync(newObj)
  }

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleAddCorreios)}>
          <ModalHeader>Correios</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <RadioGroup mb="20px" onChange={setAtivo} value={ativo}>
                <Stack direction="row">
                  <Radio value="1">Ativo</Radio>
                  <Radio value="2">Inativo</Radio>
                </Stack>
              </RadioGroup>
              <Stack>
                <Text fontWeight="bold">DADOS CONTRATO</Text>
                <Divider />
                <Stack>
                  <FormControl isInvalid={!!errors.cnpj}>
                    <FormLabel htmlFor="cnpj">CNPJ</FormLabel>
                    <Input
                      id="cnpj"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].cnpj : ''
                      }
                      {...register('cnpj')}
                    />
                    {!!errors.cnpj && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.cartao_postagem}>
                    <FormLabel htmlFor="cartao_postagem">
                      CARTAO DE POSTAGEM
                    </FormLabel>
                    <Input
                      id="cartao_postagem"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].cartao_postagem
                          : ''
                      }
                      {...register('cartao_postagem')}
                    />
                    {!!errors.cartao_postagem && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.codigo_adm}>
                    <FormLabel htmlFor="codigo_adm">CODIGO ADM</FormLabel>
                    <Input
                      id="codigo_adm"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].codigo_adm : ''
                      }
                      {...register('codigo_adm')}
                    />
                    {!!errors.codigo_adm && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.titular}>
                    <FormLabel htmlFor="titular">TITULAR</FormLabel>
                    <Input
                      id="titular"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].titular : ''
                      }
                      {...register('titular')}
                    />
                    {!!errors.titular && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.central}>
                    <FormLabel htmlFor="central">CENTRAL</FormLabel>
                    <Input
                      id="central"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].central : ''
                      }
                      {...register('central')}
                    />
                    {!!errors.central && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.usuario_sigep}>
                    <FormLabel htmlFor="usuario_sigep">
                      USUARIO SIGEPWEB
                    </FormLabel>
                    <Input
                      id="usuario_sigep"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].usuario_sigep
                          : ''
                      }
                      {...register('usuario_sigep')}
                    />
                    {!!errors.usuario_sigep && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.senha_sigep}>
                    <FormLabel htmlFor="senha_sigep">SENHA SIGEPWEB</FormLabel>
                    <Input
                      id="senha_sigep"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].senha_sigep : ''
                      }
                      {...register('senha_sigep')}
                    />
                    {!!errors.senha_sigep && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
              <Stack mt="50px" direction="column">
                <Text fontWeight="bold">SERVICOS</Text>
                <Divider />
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    PAC
                  </Text>
                  <Select
                    value={servicoPac}
                    onChange={e => setServicoPac(parseInt(e.target.value))}
                  >
                    <option value={0}>Escolher</option>
                    <option value={4669}>4669 (Padrao)</option>
                    <option value={3085}>3085</option>
                    <option value={3298}>3298</option>
                    <option value={4510}>4510</option>
                    <option value={4596}>4596</option>
                  </Select>
                </Stack>
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    SEDEX
                  </Text>
                  <Select
                    value={servicoSedex}
                    onChange={e => setServicoSedex(parseInt(e.target.value))}
                  >
                    <option value={0}>Escolher</option>
                    <option value={4162}>4162 (Padrao)</option>
                    <option value={3050}>3050</option>
                    <option value={3220}>3220</option>
                    <option value={4014}>4014</option>
                    <option value={4553}>4553</option>
                  </Select>
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
              type="submit"
              isLoading={isSubmitting}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ModalCorreios
