import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Box,
  Text,
  Stack,
  Divider,
  Input,
  RadioGroup,
  Radio,
  Button,
  Flex,
  FormLabel,
  useToast
} from '@chakra-ui/react'
import { api } from '../../../../../services/apiClient'

const Form = () => {
  const router = useRouter()

  const toast = useToast()

  const [ativo, setAtivo] = useState('1')
  const [nome, setNome] = useState('')
  const [error, setError] = useState(false)

  const handleSubmitMarca = async () => {
    if (nome === '') {
      return setError(true)
    } else {
      setError(false)
    }

    await api
      .post('/marcas', {
        ativo,
        nome
      })
      .then(() => {
        toast({
          title: 'Marca criada com sucesso.',
          description: 'Cadastro realizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true
        })
        router.push('/admin/marcas')
      })
      .catch(err => {
        toast({
          title: 'Erro ao cadastrar.',
          description: 'Cadastro não realizado.',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
  }

  return (
    <Flex w="50%" direction="column">
      <Divider m="40px 0px" />

      <Stack>
        <FormLabel>Ativo:</FormLabel>
        <RadioGroup onChange={setAtivo} value={ativo}>
          <Stack direction="row">
            <Radio value="1">Ativo</Radio>
            <Radio value="2">Inativo</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      <Divider m="40px 0px" />

      <Stack>
        <FormLabel>Nome:</FormLabel>
        {error && (
          <Text color="red" fontSize={10}>
            Preencha o campo corretamente.
          </Text>
        )}
        <Input value={nome} onChange={e => setNome(e.target.value)} />
      </Stack>

      <Box position="fixed" bottom={20}>
        <Button onClick={handleSubmitMarca} colorScheme="pink">
          GRAVAR
        </Button>
      </Box>
    </Flex>
  )
}

export default Form
