import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Box,
  Text,
  Stack,
  WrapItem,
  Wrap,
  Divider,
  FormControl,
  Input,
  Button,
  Radio,
  RadioGroup,
  FormLabel,
  useToast
} from '@chakra-ui/react'

import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'
import { celularMask, cpfMask, dataMask } from '../../../../../../utils/masks'

type Usuario = {
  tipo: number
  ativo: number
  nome_completo: string
  email: string
  celular: string
  telefone: string
  senha: string
  cpf: string
  nascimento: string
  genero: string
  ie: string
  im: string
  cnpj: string
  newsletter: number
}

const Form = () => {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario>({
    ativo: 1,
    celular: '',
    cnpj: '',
    cpf: '',
    email: '',
    genero: 'male',
    senha: '',
    ie: '',
    im: '',
    nascimento: '',
    nome_completo: '',
    newsletter: 1,
    tipo: 1,
    telefone: ''
  })

  const toast = useToast()

  const addClient = useMutation(
    async (newValuesObj: Usuario) => {
      try {
        const response = await api.post(`/usuario`, newValuesObj)

        toast({
          title: 'Sucesso ao alterar.',
          description: 'Cliente foi alterado com sucesso',
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
        queryClient.invalidateQueries('clientes')
      }
    }
  )

  const handleAddClient = async () => {
    const nascimento = new Date(usuario.nascimento).getTime().toString()
    const celForm = usuario.celular
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('-', '')
      .replaceAll(' ', '')
    const telForm = usuario.telefone
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('-', '')
      .replaceAll(' ', '')
    const cpfFor = usuario.cpf.replaceAll('.', '').replaceAll('-', '')

    const newObj = {
      ...usuario,
      nascimento,
      celular: celForm,
      telefone: telForm,
      cpf: cpfFor
    }

    await addClient.mutateAsync(newObj)

    router.push('/admin/clientes')
  }

  return (
    <Stack w="50%">
      <FormControl mt={5} mb={100}>
        <Divider m="40px 0px" />
        <Stack>
          <FormLabel>Ativo:</FormLabel>
          <RadioGroup
            onChange={e => setUsuario({ ...usuario, ativo: parseInt(e) })}
            value={usuario.ativo}
          >
            <Stack direction="row">
              <Radio value={1}>Ativo</Radio>
              <Radio value={2}>Inativo</Radio>
            </Stack>
          </RadioGroup>
        </Stack>

        <Divider m="40px 0px" />

        <Stack>
          <FormLabel>Email:</FormLabel>
          <Input
            id="email"
            value={usuario.email}
            onChange={e => setUsuario({ ...usuario, email: e.target.value })}
          />
          <FormLabel>Senha:</FormLabel>
          <Input
            id="password"
            type="password"
            value={usuario.senha}
            onChange={e => setUsuario({ ...usuario, senha: e.target.value })}
          />
        </Stack>

        <Divider m="40px 0px" />

        <Wrap spacing={5} direction="column">
          <Text>Dados:</Text>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Tipo:</FormLabel>
            <RadioGroup
              id="tipo"
              onChange={e => setUsuario({ ...usuario, tipo: parseInt(e) })}
              value={usuario.tipo}
            >
              <Stack direction="row">
                <Radio value={1}>Pessoa Física</Radio>
                <Radio value={2}>Pessoa Jurídica</Radio>
              </Stack>
            </RadioGroup>
          </WrapItem>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Nome Completo:</FormLabel>
            <Input
              id="nome_completo"
              value={usuario.nome_completo}
              onChange={e =>
                setUsuario({ ...usuario, nome_completo: e.target.value })
              }
            />
            <FormLabel>CPF:</FormLabel>
            <Input
              id="cpf"
              value={usuario.cpf}
              maxLength={14}
              onChange={e =>
                setUsuario({ ...usuario, cpf: cpfMask(e.target.value) })
              }
            />
          </WrapItem>
          <WrapItem flexDirection="row" w="100%">
            <Stack>
              <FormLabel>Data de Nascimento:</FormLabel>
              <Input
                value={usuario.nascimento}
                maxLength={10}
                id="nascimento"
                onChange={e =>
                  setUsuario({
                    ...usuario,
                    nascimento: dataMask(e.target.value)
                  })
                }
              />
            </Stack>
            <Stack>
              <FormLabel>Celular:</FormLabel>
              <Input
                value={usuario.celular}
                maxLength={15}
                id="celular"
                onChange={e =>
                  setUsuario({
                    ...usuario,
                    celular: celularMask(e.target.value)
                  })
                }
              />
            </Stack>
            <Stack>
              <FormLabel>Telefone:</FormLabel>
              <Input
                value={usuario.telefone}
                id="telefone"
                maxLength={15}
                onChange={e =>
                  setUsuario({
                    ...usuario,
                    telefone: celularMask(e.target.value)
                  })
                }
              />
            </Stack>
          </WrapItem>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Gênero:</FormLabel>
            <RadioGroup
              onChange={e => setUsuario({ ...usuario, genero: e })}
              value={usuario.genero}
            >
              <Stack direction="row">
                <Radio value="male">Masculino</Radio>
                <Radio value="female">Feminino</Radio>
              </Stack>
            </RadioGroup>
          </WrapItem>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Recebe Newsletter:</FormLabel>
            <RadioGroup
              onChange={e =>
                setUsuario({ ...usuario, newsletter: parseInt(e) })
              }
              value={usuario.newsletter}
            >
              <Stack direction="row">
                <Radio value={1}>Sim</Radio>
                <Radio value={0}>Não</Radio>
              </Stack>
            </RadioGroup>
          </WrapItem>
        </Wrap>

        <Divider m="40px 0px" />

        <Wrap spacing={5} direction="column">
          <Text>Dados Empresa:</Text>
          <WrapItem flexDirection="row" w="100%">
            <Stack>
              <FormLabel>CNPJ:</FormLabel>
              <Input
                id="cnpj"
                value={usuario.cnpj}
                onChange={e => setUsuario({ ...usuario, cnpj: e.target.value })}
              />
            </Stack>
            <Stack>
              <FormLabel>Inscrição Estadual:</FormLabel>
              <Input
                id="ie"
                value={usuario.ie}
                onChange={e => setUsuario({ ...usuario, ie: e.target.value })}
              />
            </Stack>
            <Stack>
              <FormLabel>Inscrição Municipal:</FormLabel>
              <Input
                id="im"
                value={usuario.im}
                onChange={e => setUsuario({ ...usuario, im: e.target.value })}
              />
            </Stack>
          </WrapItem>
        </Wrap>

        <Box position="fixed" bottom={20}>
          <Button onClick={() => handleAddClient()} colorScheme="pink">
            GRAVAR
          </Button>
        </Box>
      </FormControl>
    </Stack>
  )
}

export default Form
