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
  const [field, setField] = useState({
    ativo: '1',
    nome: '',
    email: '',
    telefone: '',
    observacoes: '',
    site: ''
  })
  const [error, setError] = useState(false)

  const handleSubmitMarca = async () => {
    if (field.nome === '' || field.email === '') {
      return setError(true)
    } else {
      setError(false)
    }

    await api
      .post('/fornecedores', {
        ...field
      })
      .then(() => {
        toast({
          title: 'Fornecedor criado com sucesso.',
          description: 'Cadastro realizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true
        })
        router.push('/admin/fornecedores')
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
        <Input
          value={field.nome}
          onChange={e => setField({ ...field, nome: e.target.value })}
        />
      </Stack>

      <Stack>
        <FormLabel>Site:</FormLabel>
        {error && (
          <Text color="red" fontSize={10}>
            Preencha o campo corretamente.
          </Text>
        )}
        <Input
          value={field.site}
          onChange={e => setField({ ...field, site: e.target.value })}
        />
      </Stack>

      <Stack>
        <FormLabel>Email:</FormLabel>
        {error && (
          <Text color="red" fontSize={10}>
            Preencha o campo corretamente.
          </Text>
        )}
        <Input
          value={field.email}
          onChange={e => setField({ ...field, email: e.target.value })}
        />
      </Stack>

      <Stack>
        <FormLabel>Telefone:</FormLabel>
        {error && (
          <Text color="red" fontSize={10}>
            Preencha o campo corretamente.
          </Text>
        )}
        <Input
          value={field.telefone}
          onChange={e => setField({ ...field, telefone: e.target.value })}
        />
      </Stack>

      <Stack>
        <FormLabel>Observacoes:</FormLabel>
        {error && (
          <Text color="red" fontSize={10}>
            Preencha o campo corretamente.
          </Text>
        )}
        <Input
          value={field.observacoes}
          onChange={e => setField({ ...field, observacoes: e.target.value })}
        />
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
