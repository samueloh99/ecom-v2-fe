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
  Button,
  Radio,
  RadioGroup,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { api } from '../../../../../services/apiClient'
import { queryClient } from '../../../../../services/queryClient'

type Usuario = {
  id: number
  tipo: number
  ativo: number
  nome_completo: string
  email: string
  celular: string
  telefone: string
  cpf: string
  nascimento: string
  genero: string
  created_at: Date
  updated_at: Date
  ie: string
  im: string
  cnpj: string
  newsletter: number
  data_acesso: Date
  total_pedidos: number
  estrangeiro: number
}

const Form = ({ cliente, clienteCarteira }) => {
  const router = useRouter()

  const toast = useToast()
  const [usuario, setUsuario] = useState<Usuario>(cliente)
  const [totalCarteira, setTotalCarteira] = useState(clienteCarteira.total)
  const [novaSenha, setNovaSenha] = useState({
    nova_senha: '',
    confirmar_senha: ''
  })

  const editClient = useMutation(
    async (newValuesObj: {
      celular: string
      telefone: string
      nome_completo: string
      cpf: string
      genero: string
      newsletter: number
      cnpj: string
      ie: string
      im: string
      tipo: number
      email: string
      nascimento: string
    }) => {
      try {
        const response = await api.put(
          `/usuarios/editar/${usuario.id}`,
          newValuesObj
        )

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

  const handleEditClient = async () => {
    if (novaSenha.nova_senha !== novaSenha.confirmar_senha) {
      console.log('senha incorreta')
    }

    const newObj = {
      celular: usuario.celular,
      telefone: usuario.telefone,
      nome_completo: usuario.nome_completo,
      cpf: usuario.cpf,
      genero: usuario.genero,
      newsletter: usuario.newsletter,
      cnpj: usuario.cnpj,
      ie: usuario.ie,
      im: usuario.im,
      tipo: usuario.tipo,
      email: usuario.email,
      nascimento: usuario.nascimento
    }

    await editClient.mutateAsync(newObj)

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
          <Text>Saldo Carteira: R${totalCarteira}</Text>
        </Stack>

        <Divider m="40px 0px" />

        <Stack>
          <FormLabel>Email:</FormLabel>
          <Input
            value={usuario.email}
            id="email"
            onChange={e => setUsuario({ ...usuario, email: e.target.value })}
          />
          <FormLabel>Senha:</FormLabel>
          <Input
            id="nova_senha"
            type="password"
            value={novaSenha.nova_senha}
            onChange={e =>
              setNovaSenha({ ...novaSenha, nova_senha: e.target.value })
            }
          />
          <FormLabel>Repetir senha:</FormLabel>
          <Input
            type="password"
            id="confirmar_senha"
            value={novaSenha.confirmar_senha}
            onChange={e =>
              setNovaSenha({ ...novaSenha, confirmar_senha: e.target.value })
            }
          />
        </Stack>

        <Divider m="40px 0px" />

        <Wrap spacing={5} direction="column">
          <Text>Dados:</Text>
          <WrapItem flexDirection="column" w="45%">
            <FormLabel>Tipo:</FormLabel>
            <RadioGroup
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
              value={usuario.nome_completo}
              id="nome_completo"
              onChange={e =>
                setUsuario({ ...usuario, nome_completo: e.target.value })
              }
            />
            <FormLabel>CPF:</FormLabel>
            <Input
              id="cpf"
              value={usuario.cpf}
              onChange={e => setUsuario({ ...usuario, cpf: e.target.value })}
            />
          </WrapItem>
          <WrapItem flexDirection="row" w="100%">
            <Stack>
              <FormLabel>Data de Nascimento:</FormLabel>
              <Input
                id="nascimento"
                value={new Date(usuario.nascimento)
                  .toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                  .toString()}
                onChange={e =>
                  setUsuario({ ...usuario, nascimento: e.target.value })
                }
              />
            </Stack>
            <Stack>
              <FormLabel>Celular:</FormLabel>
              <Input
                id="celular"
                value={usuario.celular}
                onChange={e =>
                  setUsuario({ ...usuario, celular: e.target.value })
                }
              />
            </Stack>
            <Stack>
              <FormLabel>Telefone:</FormLabel>
              <Input
                id="telefone"
                value={usuario.telefone}
                onChange={e =>
                  setUsuario({ ...usuario, telefone: e.target.value })
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
                <Radio value="Masculino">Masculino</Radio>
                <Radio value="Feminino">Feminino</Radio>
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
          <Button onClick={() => handleEditClient()} colorScheme="pink">
            GRAVAR
          </Button>
        </Box>
      </FormControl>
    </Stack>
  )
}

export default Form
