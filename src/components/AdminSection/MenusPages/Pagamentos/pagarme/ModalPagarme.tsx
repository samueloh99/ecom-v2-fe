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
  Stack,
  useToast,
  Divider,
  Input,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner
} from '@chakra-ui/react'

import { usePagamentos } from '../../../../../services/hooks/useConfiguracoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    public_key: yup.string().required('Campo Obrigatório'),
    secret_key: yup.string().required('Campo Obrigatório'),
    prazo_boleto: yup.number().required('Campo Obrigatório'),
    prazo_pix: yup.number().required('Campo Obrigatório'),
    boleto_desconto: yup.number().required('Campo Obrigatório'),
    pix_desconto: yup.number().required('Campo Obrigatório')
  })
  .required()

type PagamentoFormData = {
  id: number
  ativo: number
  public_key: string
  secret_key: string
  prazo_boleto: number
  prazo_pix: number
  boleto_ativo: number
  pix_ativo: number
  boleto_desconto: number
  pix_desconto: number
}

const ModalPagarme = ({ onClose, isOpen }) => {
  const toast = useToast()

  const {
    data: dataPagamento,
    isSuccess: isSuccessPagamento,
    isLoading: isLoadingPagamento
  } = usePagamentos()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const [ativoValue, setAtivoValue] = useState('1')
  const [pixAtivo, setPixAtivo] = useState('1')
  const [boletoAtivo, setBoletoAtivo] = useState('1')

  useEffect(() => {
    if (isSuccessPagamento) {
      setAtivoValue(String(dataPagamento.ativo))
      setPixAtivo(String(dataPagamento.pix_ativo))
      setBoletoAtivo(String(dataPagamento.boleto_ativo))
    }
  }, [dataPagamento])

  const addPagamento = useMutation(
    async (newValuesObj: PagamentoFormData) => {
      try {
        if (dataPagamento) {
          const response = await api.patch(
            `/configuracoes/pagamentos/editar/${dataPagamento[0].id}`,
            newValuesObj
          )

          toast({
            title: 'Sucesso ao salvar.',
            description: 'Pagamento foi salvo com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
          return response.data
        } else {
          const response = await api.post(
            `/configuracoes/pagamentos`,
            newValuesObj
          )

          toast({
            title: 'Sucesso ao salvar.',
            description: 'Pagamento foi salvo com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
          return response.data
        }
      } catch (err) {
        toast({
          title: 'Erro ao salvar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pagamentos_config')
      }
    }
  )

  const handleAddPagamento: SubmitHandler<PagamentoFormData> = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ...values,
      ativo: parseInt(ativoValue),
      boleto_ativo: parseInt(boletoAtivo),
      pix_ativo: parseInt(pixAtivo)
    }

    await addPagamento.mutateAsync(newObj)
    onClose()
  }

  return isLoadingPagamento ? (
    <Spinner />
  ) : (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pagarme: Versão API V5.0</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleAddPagamento)}>
            <Flex direction="column">
              <Stack mb="20px">
                <Text>Ativo:</Text>
                <RadioGroup onChange={setAtivoValue} value={ativoValue}>
                  <Stack direction="row">
                    <Radio value="1">Ativo</Radio>
                    <Radio value="0">Inativo</Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="bold">DADOS DA PRODUCAO</Text>
                <Divider />
                <Stack>
                  <FormControl isInvalid={!!errors.public_key}>
                    <FormLabel htmlFor="public_key">Public Key</FormLabel>
                    <Input
                      w="300px"
                      id="public_key"
                      defaultValue={dataPagamento.public_key}
                      {...register('public_key')}
                    />
                    {!!errors.public_key && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.secret_key}>
                    <FormLabel htmlFor="secret_key">Secret Key</FormLabel>
                    <Input
                      w="300px"
                      id="secret_key"
                      defaultValue={dataPagamento.secret_key}
                      {...register('secret_key')}
                    />
                    {!!errors.secret_key && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
              <Stack mt="50px" direction="column">
                <Text fontWeight="bold">PRAZOS</Text>
                <Divider />
                <Stack>
                  <FormControl isInvalid={!!errors.prazo_boleto}>
                    <FormLabel htmlFor="prazo_boleto">
                      Prazo Boleto: dias(s) corridos
                    </FormLabel>
                    <Input
                      w="300px"
                      id="prazo_boleto"
                      defaultValue={dataPagamento.prazo_boleto}
                      type="number"
                      {...register('prazo_boleto')}
                    />
                    {!!errors.prazo_boleto && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.prazo_pix}>
                    <FormLabel htmlFor="prazo_pix">
                      Prazo PIX: hora(s)
                    </FormLabel>
                    <Input
                      w="300px"
                      id="prazo_pix"
                      type="number"
                      defaultValue={dataPagamento.prazo_pix}
                      {...register('prazo_pix')}
                    />
                    {!!errors.prazo_pix && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
              <Stack mt="50px" direction="column" spacing={10}>
                <Text fontWeight="bold">CONFIGURACOES</Text>
                <Divider />
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    Boleto
                  </Text>
                  <RadioGroup onChange={setBoletoAtivo} value={boletoAtivo}>
                    <Stack direction="row">
                      <Radio value="1">Ativo</Radio>
                      <Radio value="0">Inativo</Radio>
                    </Stack>
                  </RadioGroup>
                  <FormControl isInvalid={!!errors.boleto_desconto}>
                    <FormLabel htmlFor="boleto_desconto">Desconto %</FormLabel>
                    <Input
                      w="300px"
                      id="boleto_desconto"
                      type="number"
                      defaultValue={dataPagamento.boleto_desconto}
                      {...register('boleto_desconto')}
                    />
                    {!!errors.boleto_desconto && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <Text fontSize={13} fontWeight="bold">
                    PIX
                  </Text>
                  <RadioGroup onChange={setPixAtivo} value={pixAtivo}>
                    <Stack direction="row">
                      <Radio value="1">Ativo</Radio>
                      <Radio value="0">Inativo</Radio>
                    </Stack>
                  </RadioGroup>
                  <FormControl isInvalid={!!errors.pix_desconto}>
                    <FormLabel htmlFor="pix_desconto">Desconto %</FormLabel>
                    <Input
                      w="300px"
                      id="pix_desconto"
                      defaultValue={dataPagamento.pix_desconto}
                      type="number"
                      {...register('pix_desconto')}
                    />
                    {!!errors.pix_desconto && (
                      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
            </Flex>
            <Flex mt="30px">
              <Button bg="black" color="white" onClick={onClose} mr="5">
                Fechar
              </Button>
              <Button
                bg="pink.500"
                color="white"
                type="submit"
                colorScheme="pink"
                isLoading={isSubmitting}
              >
                Ativar
              </Button>
            </Flex>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalPagarme
