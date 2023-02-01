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
  Stack,
  Divider,
  Input,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react'

import { useSeoSociais } from '../../../../../services/hooks/useConfiguracoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    facebook_link: yup.string(),
    instagram_link: yup.string(),
    twitter_link: yup.string(),
    youtube_link: yup.string(),
    linkedin_link: yup.string(),
    pinterest_link: yup.string(),
    whatsapp_link: yup.string()
  })
  .required()

type addIntegracaoFormData = {
  facebook_link: string
  instagram_link: string
  twitter_link: string
  youtube_link: string
  linkedin_link: string
  pinterest_link: string
  whatsapp_link: string
}

const ModalSociais = ({ onClose, isOpen }) => {
  const toast = useToast()
  const { data, isSuccess } = useSeoSociais()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const addSeoSociais = useMutation(
    async (newValuesObj: addIntegracaoFormData) => {
      try {
        const checkIfDataExists = isSuccess && data.length >= 1
        if (checkIfDataExists) {
          const response = await api.patch(
            `/configuracoes/seosociais/editar/${data[0].id}`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao atualizar.',
            description: 'Integracao foi atualizado com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        } else {
          const response = await api.post(
            `/configuracoes/seosociais`,
            newValuesObj
          )
          toast({
            title: 'Sucesso ao criar.',
            description: 'Integracao foi criado com sucesso',
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
        queryClient.invalidateQueries('seosociais')
      }
    }
  )

  const handleAddSeoSociais: SubmitHandler<
    addIntegracaoFormData
  > = async values => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newObj = {
      ...values
    }

    await addSeoSociais.mutateAsync(newObj)
  }
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleAddSeoSociais)}>
          <ModalHeader>Sociais</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <Stack>
                <Text fontWeight="bold">Redes Sociais</Text>
                <Divider />
                <Stack>
                  <FormControl isInvalid={!!errors.facebook_link}>
                    <FormLabel htmlFor="facebook_link">facebook.com/</FormLabel>
                    <Input
                      id="facebook_link"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].facebook_link
                          : ''
                      }
                      {...register('facebook_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.instagram_link}>
                    <FormLabel htmlFor="instagram_link">
                      instagram.com/
                    </FormLabel>
                    <Input
                      id="instagram_link"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].instagram_link
                          : ''
                      }
                      {...register('instagram_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.twitter_link}>
                    <FormLabel htmlFor="twitter_link">twitter.com/</FormLabel>
                    <Input
                      id="twitter_link"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].twitter_link : ''
                      }
                      {...register('twitter_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.youtube_link}>
                    <FormLabel htmlFor="youtube_link">youtube.com/</FormLabel>
                    <Input
                      id="youtube_link"
                      defaultValue={
                        isSuccess && data.length > 0 ? data[0].youtube_link : ''
                      }
                      {...register('youtube_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.linkedin_link}>
                    <FormLabel htmlFor="linkedin_link">linkedin.com/</FormLabel>
                    <Input
                      id="linkedin_link"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].linkedin_link
                          : ''
                      }
                      {...register('linkedin_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.pinterest_link}>
                    <FormLabel htmlFor="pinterest_link">
                      pinterest.com/
                    </FormLabel>
                    <Input
                      id="pinterest_link"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].pinterest_link
                          : ''
                      }
                      {...register('pinterest_link')}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isInvalid={!!errors.whatsapp_link}>
                    <FormLabel htmlFor="whatsapp_link">
                      WhatsApp (sem o +) Exemplo: 5511944682441
                    </FormLabel>
                    <Input
                      id="whatsapp_link"
                      defaultValue={
                        isSuccess && data.length > 0
                          ? data[0].whatsapp_link
                          : ''
                      }
                      {...register('whatsapp_link')}
                    />
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
              type="submit"
              isLoading={isSubmitting}
            >
              Ativar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ModalSociais
