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
  FormControl,
  FormLabel,
  Stack,
  Divider,
  Input,
  useToast
} from '@chakra-ui/react'

import { useSeoSociais } from '../../../../../services/hooks/useConfiguracoes'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

const validationSchema = yup
  .object({
    google_analytics: yup.string(),
    gtm: yup.string(),
    google_ads: yup.string(),
    ads_campanha: yup.string(),
    facebook_pixel: yup.string(),
    pinterest_tag: yup.string(),
    tiktok_tag: yup.string()
  })
  .required()

type addIntegracaoFormData = {
  google_analytics: string
  gtm: string
  google_ads: string
  ads_campanha: string
  facebook_pixel: string
  pinterest_tag: string
  tiktok_tag: string
}

const ModalIntegracoes = ({ onClose, isOpen }) => {
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
          <ModalHeader>Integracoes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <Stack direction="column" spacing={10}>
                <Stack>
                  <Text fontWeight="bold">GOOGLE</Text>
                  <Divider />
                  <Stack>
                    <FormControl isInvalid={!!errors.google_analytics}>
                      <FormLabel htmlFor="google_analytics">
                        Google Analytics
                      </FormLabel>
                      <Input
                        id="google_analytics"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].google_analytics
                            : ''
                        }
                        {...register('google_analytics')}
                      />
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.gtm}>
                      <FormLabel htmlFor="gtm">GTM</FormLabel>
                      <Input
                        id="gtm"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].gtm : ''
                        }
                        {...register('gtm')}
                      />
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.google_ads}>
                      <FormLabel htmlFor="google_ads">Google Ads</FormLabel>
                      <Input
                        id="google_ads"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].google_ads : ''
                        }
                        {...register('google_ads')}
                      />
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl isInvalid={!!errors.ads_campanha}>
                      <FormLabel htmlFor="ads_campanha">Ads Campanha</FormLabel>
                      <Input
                        id="ads_campanha"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].ads_campanha
                            : ''
                        }
                        {...register('ads_campanha')}
                      />
                    </FormControl>
                  </Stack>
                </Stack>

                <Stack direction="column">
                  <Text fontWeight="bold">FACEBOOK</Text>
                  <Divider />
                  <Stack>
                    <FormControl isInvalid={!!errors.facebook_pixel}>
                      <FormLabel htmlFor="facebook_pixel">PIXEL</FormLabel>
                      <Input
                        id="facebook_pixel"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].facebook_pixel
                            : ''
                        }
                        {...register('facebook_pixel')}
                      />
                    </FormControl>
                  </Stack>
                </Stack>

                <Stack direction="column">
                  <Text fontWeight="bold">PINTEREST</Text>
                  <Divider />
                  <Stack>
                    <FormControl isInvalid={!!errors.pinterest_tag}>
                      <FormLabel htmlFor="pinterest_tag">TAG</FormLabel>
                      <Input
                        id="pinterest_tag"
                        defaultValue={
                          isSuccess && data.length > 0
                            ? data[0].pinterest_tag
                            : ''
                        }
                        {...register('pinterest_tag')}
                      />
                    </FormControl>
                  </Stack>
                </Stack>

                <Stack direction="column">
                  <Text fontWeight="bold">TIKTOK</Text>
                  <Divider />
                  <Stack>
                    <FormControl isInvalid={!!errors.tiktok_tag}>
                      <FormLabel htmlFor="tiktok_tag">TAG</FormLabel>
                      <Input
                        id="tiktok_tag"
                        defaultValue={
                          isSuccess && data.length > 0 ? data[0].tiktok_tag : ''
                        }
                        {...register('tiktok_tag')}
                      />
                    </FormControl>
                  </Stack>
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

export default ModalIntegracoes
