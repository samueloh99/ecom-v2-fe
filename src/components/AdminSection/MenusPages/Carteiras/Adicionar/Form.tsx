import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  PopoverTrigger as OrigPopoverTrigger,
  Divider,
  FormControl,
  Input,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Box,
  useToast,
  Button
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

type Carteira = {
  movimentacao: string
  valor_carteira: string
  usuario_id: string
}

const Form = () => {
  const [carteira, setCarteira] = useState<Carteira>({
    movimentacao: '',
    usuario_id: '',
    valor_carteira: ''
  })

  const { push } = useRouter()

  const toast = useToast()

  const addCarteira = useMutation(
    async (newValuesObj: Carteira) => {
      try {
        const response = await api.post(`/carteiras`, newValuesObj)

        if (response.data.status === 'error') {
          return toast({
            title: 'Erro ao adicionar.',
            description: response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }

        toast({
          title: 'Sucesso ao adicionar.',
          description: 'Carteira foi adicionado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao adicionar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('carteiras')
      }
    }
  )

  const handleAddCarteira = async () => {
    await addCarteira.mutateAsync(carteira)

    push('/admin/carteiras')
  }

  return (
    <Stack w="50%">
      <FormControl mt={5} mb={100}>
        <Divider m="40px 0px" />
        <Stack>
          <FormLabel>Tipo:</FormLabel>
          <RadioGroup
            onChange={e => setCarteira({ ...carteira, movimentacao: e })}
            value={carteira.movimentacao}
          >
            <Stack direction="row">
              <Radio value="entrada">Entrada</Radio>
              <Radio value="saida">Saída</Radio>
            </Stack>
          </RadioGroup>
        </Stack>

        <Divider m="40px 0px" />

        <Stack>
          <FormLabel>Valor:</FormLabel>
          <Input
            id="valor_carteira"
            value={carteira.valor_carteira}
            onChange={e =>
              setCarteira({ ...carteira, valor_carteira: e.target.value })
            }
          />
          <FormLabel>Código Cliente:</FormLabel>
          <Input
            id="usuario_id"
            value={carteira.usuario_id}
            onChange={e =>
              setCarteira({ ...carteira, usuario_id: e.target.value })
            }
          />
        </Stack>

        <Box position="fixed" bottom={20}>
          <Button onClick={() => handleAddCarteira()} colorScheme="pink">
            GRAVAR
          </Button>
        </Box>
      </FormControl>
    </Stack>
  )
}

export default Form
