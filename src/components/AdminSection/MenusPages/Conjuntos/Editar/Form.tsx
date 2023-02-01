import React, { useCallback, useState } from 'react'

import { ErrorMessage } from '@hookform/error-message'

import * as yup from 'yup'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import {
  Box,
  Text,
  Stack,
  WrapItem,
  Wrap,
  Textarea,
  Divider,
  FormControl,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Select
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        })

        return {
          values,
          errors: {}
        }
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message
              }
            }),
            {}
          )
        }
      }
    },
    [validationSchema]
  )

const validationSchema = yup.object({
  nome: yup.string().required('Required'),
  referencia: yup.string().required('Required'),
  ativo: yup.number().required('Required'),
  tipo_produto: yup.number().required('Required'),
  ncm: yup.string().required('Required'),
  link_youtube: yup.string(),
  categoria_id: yup.number(),
  marca_id: yup.number(),
  fornecedor_id: yup.number(),
  tabela_id: yup.number(),
  deduzir: yup.number(),
  mostrar_busca: yup.number(),
  mostrar_esgotado: yup.number(),
  mostrar_feed_xml: yup.number(),
  saida_entrega: yup.number(),
  comprimento: yup.string(),
  largura: yup.string(),
  profundidade: yup.string()
})

const Form = () => {
  const resolver = useYupValidationResolver(validationSchema)
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSizeClick = () => {
    onOpen()
  }

  return (
    <Stack w="50%">
      <form onSubmit={handleSubmit(data => console.log(data))}>
        <FormControl mt={5} mb={100}>
          <Divider m="40px 0px" />
          <Stack>
            <FormLabel>Ativo:</FormLabel>
            <Stack direction="row" alignItems="center">
              <input {...register('ativo')} type="radio" value={1} />
              <FormLabel>Sim</FormLabel>

              <input {...register('ativo')} type="radio" value={2} />
              <FormLabel>Não</FormLabel>
            </Stack>
          </Stack>
          <Divider m="40px 0px" />

          <Stack direction="row">
            <Stack w="50%">
              <FormLabel>Válido de:</FormLabel>
              <Input {...register('nome')} />
            </Stack>
            <Stack w="50%">
              <FormLabel>Válido até:</FormLabel>
              <Input {...register('referencia')} />
            </Stack>
          </Stack>

          <Divider m="40px 0px" />

          <Stack>
            <FormLabel>Nome:</FormLabel>
            <Input {...register('nome')} />
            <Text color="red">
              <ErrorMessage errors={errors} name="nome" />
            </Text>
            <FormLabel>Desconto: (em %)</FormLabel>
            <Input {...register('referencia')} />
            <Text color="red">
              <ErrorMessage errors={errors} name="referencia" />
            </Text>
          </Stack>

          <Divider m="40px 0px" />

          <Wrap w="100%" justify="space-between" spacing={5}>
            <WrapItem flexDirection="column" w="45%">
              <FormLabel>Categoria Principal:</FormLabel>
              <Select {...register('categoria_id')}>
                <option value="1">Belara</option>
                <option value="2">Nike</option>
                <option value="3">Adidas</option>
              </Select>
            </WrapItem>
          </Wrap>

          <Divider m="40px 0px" />

          <Wrap w="100%" justify="space-between" spacing={5}>
            <WrapItem flexDirection="column" w="45%">
              <Button
                onClick={() => handleSizeClick()}
                key="xl"
                colorScheme="pink"
              >
                Adicionar Produto
              </Button>

              <Modal onClose={onClose} size="xl" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Adicionar Produtos</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Wrap>
                      <Stack w="30%">
                        <FormLabel>Cód. 1:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 2:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 3:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 4:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 5:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 6:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 7:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 8:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                      <Stack w="30%">
                        <FormLabel>Cód. 9:</FormLabel>
                        <Input {...register('referencia')} />
                      </Stack>
                    </Wrap>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onClose} colorScheme="pink">
                      Gravar
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </WrapItem>
            <Wrap
              bg="gray.700"
              borderRadius={8}
              w="100%"
              direction="row"
              p="4"
              spacing={10}
              justify="center"
            >
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
              <WrapItem
                bg="gray.600"
                borderRadius={8}
                flexDirection="column"
                p="3"
              >
                <Text>Ativo</Text>
                <Text>Produto 1</Text>
                <Text>Cod. Produto</Text>
                <Text>Referencia</Text>
                <Text>Estoque</Text>
              </WrapItem>
            </Wrap>
          </Wrap>

          <Divider m="40px 0px" />

          <Stack>
            <FormLabel>Descrição:</FormLabel>
            <Textarea placeholder="Here is a sample placeholder" />
          </Stack>

          <Box position="fixed" bottom={20}>
            <Button type="submit" colorScheme="pink">
              GRAVAR
            </Button>
          </Box>
        </FormControl>
      </form>
    </Stack>
  )
}

export default Form
