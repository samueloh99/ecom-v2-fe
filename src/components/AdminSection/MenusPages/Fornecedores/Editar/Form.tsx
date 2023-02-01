import React, { useEffect, useState } from 'react'

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
import { useFornecedores } from '../../../../../services/hooks/useFornecedores'
import { queryClient } from '../../../../../services/queryClient'

const Form = () => {
  const router = useRouter()

  const toast = useToast()

  const { data, isSuccess } = useFornecedores()

  const [field, setField] = useState({
    ativo: '1',
    nome: '',
    email: '',
    telefone: '',
    observacoes: '',
    site: ''
  })
  const [error, setError] = useState(false)

  useEffect(() => {
    const slug = router.query.slug[0]
    if (isSuccess) {
      const fornecedor = data.find(item => item.id === parseInt(slug))
      setField({
        ...field,
        nome: fornecedor.nome,
        email: fornecedor.email,
        site: fornecedor.site,
        telefone: fornecedor.telefone,
        observacoes: fornecedor.observacoes,
        ativo: String(fornecedor.ativo)
      })
    }
  }, [data])

  const handleSubmitFornecedor = async () => {
    await api
      .put(`/fornecedores/editar/${router.query.slug[0]}`, {
        ...field
      })
      .then(() => {
        toast({
          title: 'Atualizado com sucesso.',
          description: 'Cadastro atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true
        })
        router.push('/admin/fornecedores')
        queryClient.invalidateQueries('fornecedores')
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
        <RadioGroup
          onChange={e => setField({ ...field, ativo: e })}
          value={field.ativo}
        >
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
        <Button onClick={handleSubmitFornecedor} colorScheme="pink">
          GRAVAR
        </Button>
      </Box>
    </Flex>
  )
}

export default Form
