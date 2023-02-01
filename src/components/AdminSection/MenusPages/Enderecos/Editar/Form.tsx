import React, { useState } from 'react'

import { useRouter } from 'next/router'
import {
  Box,
  Stack,
  Divider,
  FormControl,
  Button,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

type Enderecos = {
  id: number
  usuario_id: number
  ativo: number
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  lembrete: string
  destinatario: string
  created_at: Date
  updated_at: Date
}

const Form = ({ endereco }) => {
  const router = useRouter()

  const toast = useToast()
  const [fields, setFields] = useState<Enderecos>(endereco)

  const editEndereco = useMutation(
    async (newValuesObj: {
      cep: string
      endereco: string
      numero: string
      complemento: string
      bairro: string
      destinatario: string
    }) => {
      try {
        const response = await api.patch(
          `/enderecos/editar/${fields.id}`,
          newValuesObj
        )

        toast({
          title: 'Sucesso ao alterar.',
          description: 'Endereço foi alterado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao alterar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('enderecos')
      }
    }
  )

  const handleEditClient = async () => {
    const newObj = {
      destinatario: fields.destinatario,
      cep: fields.cep,
      endereco: fields.endereco,
      numero: fields.numero,
      complemento: fields.complemento,
      bairro: fields.bairro,
      cidade: fields.cidade
    }
    await editEndereco.mutateAsync(newObj)
    router.push('/admin/enderecos')
  }

  return (
    <Stack w="50%">
      <FormControl mt={5} mb={100}>
        <Divider m="40px 0px" />

        <Stack>
          <FormLabel>Destinatário:</FormLabel>
          <Input
            value={fields.destinatario}
            id="destinatario"
            onChange={e =>
              setFields({ ...fields, destinatario: e.target.value })
            }
          />
          <FormLabel>CEP:</FormLabel>
          <Input
            id="cep"
            value={fields.cep}
            onChange={e => setFields({ ...fields, cep: e.target.value })}
          />
          <FormLabel>Endereço:</FormLabel>
          <Input
            id="endereco"
            value={fields.endereco}
            onChange={e => setFields({ ...fields, endereco: e.target.value })}
          />
          <FormLabel>Número:</FormLabel>
          <Input
            id="numero"
            value={fields.numero}
            onChange={e => setFields({ ...fields, numero: e.target.value })}
          />
          <FormLabel>Complemento:</FormLabel>
          <Input
            id="complemento"
            value={fields.complemento}
            onChange={e =>
              setFields({ ...fields, complemento: e.target.value })
            }
          />
          <FormLabel>Bairro:</FormLabel>
          <Input
            id="bairro"
            value={fields.bairro}
            onChange={e => setFields({ ...fields, bairro: e.target.value })}
          />
          <FormLabel>Cidade:</FormLabel>
          <Input
            id="cidade"
            value={fields.cidade}
            onChange={e => setFields({ ...fields, cidade: e.target.value })}
          />
        </Stack>

        <Box position="fixed" bottom={20}>
          <Button onClick={() => handleEditClient()} colorScheme="pink">
            GRAVAR
          </Button>
        </Box>
      </FormControl>
    </Stack>
  )
}

export default Form
