import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Stack,
  Icon,
  Input,
  Text,
  Flex,
  Grid,
  HStack,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  Spinner,
  FormLabel,
  Button
} from '@chakra-ui/react'

import { IoMdArrowBack } from 'react-icons/io'
import { useAuthContext } from '../../../contexts/AuthContext'
import {
  celularMask,
  cpfMask,
  dateFormatterField,
  dataMask,
  generoFormatterToNumber
} from '../../../../utils/masks'
import { api } from '../../../services/apiClient'
import { useClientes } from '../../../services/hooks/useClientes'
import { queryClient } from '../../../services/queryClient'

interface UserDTO {
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
  ie: string
  im: string
  cnpj: string
  newsletter: number
  estrangeiro: number
}

export const UserInfoCadastro = () => {
  const { data, isSuccess } = useClientes()
  const { userData } = useAuthContext()
  const { push } = useRouter()

  const [fields, setFields] = useState<UserDTO>()
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    if (isSuccess && userData) {
      const findUserById = data.usuarios.filter(
        item => item.id === userData.id
      )[0]
      setFields({
        ...findUserById,
        nascimento: dateFormatterField(findUserById.nascimento),
        celular: celularMask(findUserById.celular),
        telefone: celularMask(findUserById.telefone),
        cpf: cpfMask(findUserById.cpf),
        genero: String(generoFormatterToNumber(findUserById.genero))
      })
    }
  }, [userData, data, isSuccess])

  const undefinedFormat = (value: string) => {
    if (value === undefined) {
      return ''
    } else {
      value
    }
  }

  const onSubmit = async () => {
    const newObj = {
      ie: undefinedFormat(fields.ie),
      tipo: fields.tipo,
      im: undefinedFormat(fields.im),
      nome_completo: fields.nome_completo,
      cnpj: undefinedFormat(fields.cnpj),
      estrangeiro: fields.estrangeiro,
      newsletter: fields.newsletter,
      cpf: fields.cpf.replaceAll('.', '').replace('-', ''),
      nascimento: fields.nascimento.split('/').reverse().join('-'),
      celular: fields.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      telefone: fields.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      genero: generoFormatterToNumber(fields.genero) as string
    }

    await api.patch('/perfil/editar', newObj).then(res => {
      if (res.status === 200) {
        setSuccess(true)
        push({ pathname: '/userinfo' })
        queryClient.invalidateQueries('clientes')
      } else {
        setSuccess(false)
      }
    })
  }

  return fields === undefined ? (
    <Spinner />
  ) : (
    <Flex direction="column" h="100%" w="70%">
      <Flex alignItems="center">
        <HStack
          cursor="pointer"
          onClick={() => push({ pathname: '/userinfo' })}
        >
          <Icon as={IoMdArrowBack} fontSize={20} />
          <Text>Voltar</Text>
        </HStack>
      </Flex>

      <Flex direction="column">
        <Text fontWeight="bold" fontSize={20}>
          Meus Dados
        </Text>
        {success === false && (
          <Text m="20px 0px" color="red">
            Dados não atualizados !
          </Text>
        )}
      </Flex>

      <RadioGroup
        onChange={e => setFields({ ...fields, tipo: parseInt(e) })}
        value={fields.tipo}
      >
        <FormLabel fontSize="14px">Tipo*</FormLabel>
        <Stack direction="row">
          <Radio value={1}>Físico</Radio>
          <Radio value={2}>Jurídico</Radio>
        </Stack>
      </RadioGroup>
      <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
        <Flex direction="column">
          <FormLabel fontSize="14px">Nome Completo*</FormLabel>
          <Input
            id={fields.nome_completo}
            value={fields.nome_completo}
            onChange={e =>
              setFields({ ...fields, nome_completo: e.target.value })
            }
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">Email*</FormLabel>
          <Input
            id={fields.email}
            value={fields.email}
            onChange={e => setFields({ ...fields, email: e.target.value })}
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">Nascimento*</FormLabel>
          <Input
            id={fields.nascimento}
            value={fields.nascimento}
            maxLength={10}
            onChange={e =>
              setFields({
                ...fields,
                nascimento: dataMask(e.target.value)
              })
            }
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">Genero*</FormLabel>
          <Select
            value={fields.genero}
            onChange={e => setFields({ ...fields, genero: e.target.value })}
          >
            <option value={1}>Masculino</option>
            <option value={2}>Feminino</option>
          </Select>
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">Celular*</FormLabel>
          <Input
            id={fields.celular}
            value={fields.celular}
            maxLength={15}
            onChange={e =>
              setFields({ ...fields, celular: celularMask(e.target.value) })
            }
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">Outro Telefone*</FormLabel>
          <Input
            id={fields.telefone}
            value={fields.telefone}
            maxLength={14}
            onChange={e =>
              setFields({ ...fields, telefone: celularMask(e.target.value) })
            }
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>

        <Flex direction="column">
          <FormLabel fontSize="14px">CPF*</FormLabel>
          <Input
            id={fields.cpf}
            value={fields.cpf}
            maxLength={13}
            onChange={e =>
              setFields({ ...fields, cpf: cpfMask(e.target.value) })
            }
            _focus={{ boxShadow: 'none' }}
          />
        </Flex>
      </Grid>
      {fields.tipo === 2 && (
        <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
          <Flex direction="column">
            <FormLabel fontSize="14px">CNPJ*</FormLabel>
            <Input
              id={fields.cnpj}
              value={fields.cnpj}
              onChange={e => setFields({ ...fields, cnpj: e.target.value })}
              _focus={{ boxShadow: 'none' }}
            />
          </Flex>

          <Flex direction="column">
            <FormLabel fontSize="14px">Inscrição Estadual*</FormLabel>
            <Input
              id={fields.ie}
              value={fields.ie}
              onChange={e => setFields({ ...fields, ie: e.target.value })}
              _focus={{ boxShadow: 'none' }}
            />
          </Flex>

          <Flex direction="column">
            <FormLabel fontSize="14px">Inscrição Municipal*</FormLabel>
            <Input
              id={fields.im}
              value={fields.im}
              onChange={e => setFields({ ...fields, im: e.target.value })}
              _focus={{ boxShadow: 'none' }}
            />
          </Flex>
        </Grid>
      )}
      <Stack>
        <Checkbox
          onChange={e =>
            setFields({
              ...fields,
              newsletter: fields.newsletter === 1 ? 0 : 1
            })
          }
          isChecked={fields.newsletter === 1 ? true : false}
        >
          Newsletter
        </Checkbox>
      </Stack>
      <Button
        type="submit"
        w="100%"
        color="white"
        bg="black"
        onClick={() => onSubmit()}
      >
        ENTRAR
      </Button>
    </Flex>
  )
}

export default UserInfoCadastro
