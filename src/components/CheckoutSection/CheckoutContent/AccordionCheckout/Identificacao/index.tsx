import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  Checkbox,
  FormControl,
  WrapItem,
  Select,
  Link,
  HStack,
  Stack,
  Input,
  Text,
  Button,
  FormLabel,
  Box,
  useToast,
  Flex,
  VStack
} from '@chakra-ui/react'

import { RiNumber1, RiCheckFill } from 'react-icons/ri'
import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { api } from '../../../../../services/apiClient'
import {
  celularMask,
  cpfMask,
  dataMask,
  cpfValidator,
  firstLetterUpper,
  validateEmail
} from '../../../../../../utils/masks'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import LoginContent from './LoginContent'

type ICreateNewUserPagarmeRequest = {
  nome: string
  email: string
  celular: string
  codigo_cliente: any
  documento: string
  genero: string
  nascimento: string
  telefone: string
}

const Identificacao = () => {
  const router = useRouter()

  const toast = useToast()

  const { step, setStep, setCheckoutUsuario, checkoutUsuario } =
    useCheckoutContext()

  const { userData, signInCheckout, isAuthenticated } = useAuthContext()

  const [form, setForm] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    nascimento: '',
    celular: '',
    telefone: '',
    genero: 'Masculino',
    newsletter: false
  })

  const [validate, setValidate] = useState({
    formVerify: false,
    cpfVerifiy: false
  })

  const [updateUser, setUpdateUser] = useState(false)
  const [loginUser, setLoginUser] = useState(false)

  const createNewUserPagarme = async (data: ICreateNewUserPagarmeRequest) => {
    const res = await api.post('/checkout/users_pagarme', data)

    if (res.data.errors) {
      return toast({
        title: 'Erro.',
        description: res.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    setCheckoutUsuario({
      pagarmeRes: res.data,
      usuarioRes: {
        ...userData
      }
    })

    return res
  }

  useEffect(() => {
    if (isAuthenticated) {
      setForm({
        ...form,
        nome_completo: userData.nome_completo,
        celular: userData.celular ? celularMask(userData.celular) : '',
        telefone: userData.telefone ? celularMask(userData.telefone) : '',
        cpf: cpfMask(userData.cpf),
        email: userData.email,
        genero: userData.genero,
        nascimento: userData.nascimento,
        newsletter: userData.newsletter === 1 ? true : false
      })

      const newClientePagarme = {
        nome: userData.nome_completo,
        email: userData.email,
        celular: userData.celular,
        codigo_cliente: userData.id,
        documento: userData.cpf,
        genero: userData.genero,
        nascimento: userData.nascimento,
        telefone: userData.telefone
      }

      createNewUserPagarme(newClientePagarme)

      setStep(1)

      router.push('/checkout/endereco', undefined, { shallow: true })
    }
  }, [isAuthenticated])

  const handleNextStep = async () => {
    if (!validateEmail(form.email)) {
      return setValidate({
        formVerify: true,
        cpfVerifiy: false
      })
    }

    if (
      !form.email ||
      !form.nome_completo ||
      !form.nascimento ||
      !form.celular ||
      !form.cpf
    ) {
      return setValidate({
        formVerify: true,
        cpfVerifiy: false
      })
    } else if (cpfValidator(form.cpf) === false) {
      return setValidate({
        formVerify: false,
        cpfVerifiy: true
      })
    }

    const birthdayFormatted = form.nascimento.split('/')
    const newDate = new Date()
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      .split('/')

    if (
      birthdayFormatted[1] > '12' ||
      birthdayFormatted[0] > '31' ||
      birthdayFormatted[2] > newDate[2]
    ) {
      return setValidate({
        cpfVerifiy: false,
        formVerify: true
      })
    }

    setValidate({
      formVerify: false,
      cpfVerifiy: false
    })

    const newClient = {
      cpf: form.cpf.replaceAll('.', '').replace('-', ''),
      nome_completo: form.nome_completo,
      email: form.email,
      nascimento: form.nascimento,
      celular: form.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      telefone: form.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      genero: form.genero,
      tipo: 1,
      newsletter: form.newsletter === false ? 0 : 1,
      estrangeiro: 0,
      cnpj: '',
      ie: '',
      im: ''
    }

    const createNewUser = await api.post('/checkout/users', newClient)

    if (createNewUser.data.status === 'error') {
      if (createNewUser.data.message === 'CPF ja cadastrado.') {
        return setLoginUser(true)
      }
      return toast({
        title: 'Erro.',
        description: createNewUser.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    const newClientePagarme = {
      nome: form.nome_completo,
      email: form.email,
      celular: form.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      codigo_cliente: createNewUser.data.id,
      documento: form.cpf.replaceAll('.', '').replace('-', ''),
      genero: form.genero,
      nascimento: form.nascimento,
      telefone: form.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', '')
    }

    const createNewUserPagarme = await api.post(
      '/checkout/users_pagarme',
      newClientePagarme
    )

    if (createNewUserPagarme.data.errors) {
      return toast({
        title: 'Erro.',
        description: createNewUser.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    await signInCheckout({
      email: newClient.email,
      senha: 'mudar@321'
    })

    setStep(1)

    router.push('/checkout/endereco', undefined, { shallow: true })

    return setCheckoutUsuario({
      pagarmeRes: createNewUserPagarme.data,
      usuarioRes: createNewUser.data
    })
  }

  const handleClickEditar = () => {
    setUpdateUser(true)
    router.push('/checkout/indentificacao', undefined, { shallow: true })
    setStep(0)
  }

  const handleUpdateUser = async () => {
    const updateUserObj = {
      cpf: form.cpf.replaceAll('.', '').replace('-', ''),
      nome_completo: form.nome_completo,
      email: form.email,
      nascimento: form.nascimento,
      celular: form.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      telefone: form.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      genero: form.genero,
      tipo: 1,
      newsletter: form.newsletter === false ? 0 : 1,
      estrangeiro: 0,
      cnpj: '',
      ie: '',
      im: ''
    }

    const updateUser = await api.put(
      `/usuarios/editar/${userData.id}`,
      updateUserObj
    )

    if (updateUser.data.status === 'error') {
      return toast({
        title: 'Erro.',
        description: updateUser.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    const newClientePagarme = {
      nome: form.nome_completo,
      email: form.email,
      celular: form.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      codigo_cliente: updateUser.data.id,
      documento: form.cpf.replaceAll('.', '').replace('-', ''),
      genero: form.genero,
      nascimento: form.nascimento,
      telefone: form.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', '')
    }

    const updateUserPagarme = await api.post(
      '/checkout/users_pagarme',
      newClientePagarme
    )

    if (updateUserPagarme.data.errors) {
      return toast({
        title: 'Erro.',
        description: updateUserPagarme.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    setStep(1)

    router.push('/checkout/endereco', undefined, { shallow: true })

    return setCheckoutUsuario({
      pagarmeRes: updateUserPagarme.data,
      usuarioRes: updateUser.data
    })
  }

  if (loginUser) {
    return <LoginContent setLoginUser={setLoginUser} />
  }

  return (
    <AccordionItem mb="10" border="none">
      <h2>
        <AccordionButton
          bg="white"
          p={10}
          _focus={{ border: 'none' }}
          _hover={{ bg: 'white' }}
          flexDirection="column"
          alignItems="start"
        >
          <Flex direction="row" w="100%" justifyContent="space-between">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              textAlign="left"
              fontWeight="bold"
              fontSize={{ base: '17px', md: '20px' }}
              letterSpacing={{ base: '1px', md: '5px' }}
            >
              <Icon
                as={step !== 0 ? RiCheckFill : RiNumber1}
                bg={step !== 0 ? 'green' : 'black'}
                fontSize={{ base: 25, md: 30 }}
                color="white"
                borderRadius="100%"
                p={2}
                mr={3}
              />
              <Text>IDENTIFICAÇÃO</Text>
            </Box>
            {step > 0 && (
              <Box
                textDecoration="underline"
                onClick={() => handleClickEditar()}
              >
                editar
              </Box>
            )}
          </Flex>
          {step > 0 && checkoutUsuario && (
            <VStack mt="50px" align="start" spacing={5} fontSize={13}>
              <Text fontWeight="bold">Dados:</Text>
              <Text>Email: {checkoutUsuario.usuarioRes.email}</Text>
              <Text>
                Nome Completo: {checkoutUsuario.usuarioRes.nome_completo}
              </Text>
              <Text>Celular: {checkoutUsuario.usuarioRes.celular}</Text>
              <Text>
                Data Nascimento: {checkoutUsuario.usuarioRes.nascimento}
              </Text>
            </VStack>
          )}
        </AccordionButton>
      </h2>
      <AccordionPanel bg="white" pb={4}>
        <Text mb="5">
          Para melhor atendê-lo, preencha os campos antes de continuar a compra.
        </Text>
        {(validate.formVerify === true && (
          <Text color="red" fontSize="10px" mb="4">
            Preencha todos os campos necessários.
          </Text>
        )) ||
          (validate.cpfVerifiy === true && (
            <Text color="red" fontSize="10px" mb="4">
              Preencha um CPF válido.
            </Text>
          ))}

        <HStack w="100%">
          <FormControl>
            <FormLabel htmlFor="nome_completo">Nome Completo*</FormLabel>
            <Input
              type="text"
              required
              id="nome_completo"
              value={form.nome_completo}
              onChange={e =>
                setForm({
                  ...form,
                  nome_completo: firstLetterUpper(e.target.value)
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email*</FormLabel>
            <Input
              type="email"
              required
              id="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </FormControl>
        </HStack>
        <HStack w="100%">
          <FormControl>
            <FormLabel htmlFor="nascimento">Data de Nascimento*</FormLabel>
            <Input
              id="nascimento"
              required
              value={form.nascimento}
              maxLength={10}
              onChange={e =>
                setForm({ ...form, nascimento: dataMask(e.target.value) })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="celular">Celular*</FormLabel>
            <Input
              id="celular"
              value={form.celular}
              required
              maxLength={15}
              onChange={e =>
                setForm({ ...form, celular: celularMask(e.target.value) })
              }
            />
          </FormControl>
        </HStack>
        <HStack w="100%">
          <FormControl>
            <FormLabel htmlFor="telefone">Outro Telefone</FormLabel>
            <Input
              id="telefone"
              value={form.telefone}
              required
              maxLength={14}
              onChange={e =>
                setForm({ ...form, telefone: celularMask(e.target.value) })
              }
            />
          </FormControl>
        </HStack>
        <HStack w="100%">
          <FormControl w="50%">
            <FormLabel htmlFor="cpf">CPF*</FormLabel>
            <Input
              id="cpf"
              value={form.cpf}
              required
              onChange={e => setForm({ ...form, cpf: cpfMask(e.target.value) })}
            />
          </FormControl>
          <WrapItem flexDirection="column" w="50%">
            <FormLabel>Gênero:</FormLabel>
            <Select
              value={form.genero}
              onChange={e => setForm({ ...form, genero: e.target.value })}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Select>
          </WrapItem>
        </HStack>

        <Stack direction="row" mt="10" alignItems="baseline">
          <Checkbox
            isChecked={form.newsletter}
            onChange={e => setForm({ ...form, newsletter: e.target.checked })}
            alignItems="baseline"
          ></Checkbox>
          <Text>
            Marque se desejar receber emails da Chae's. Ao se inscrever, você
            concorda com nossa{' '}
            <Link textDecoration="underline" href="/">
              Política de Privacidade
            </Link>
          </Text>
        </Stack>
        <Button
          bg="black"
          color="white"
          type="submit"
          w="100%"
          mt="5"
          onClick={() =>
            updateUser === true ? handleUpdateUser() : handleNextStep()
          }
        >
          CONTINUAR
        </Button>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default Identificacao
