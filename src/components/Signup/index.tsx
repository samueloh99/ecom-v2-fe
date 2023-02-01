import React, { useState } from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'

import InputMask from 'react-input-mask'

import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Text,
  Select,
  VStack,
  Checkbox,
  InputGroup,
  InputRightElement,
  Icon,
  useToast
} from '@chakra-ui/react'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import {
  cpfValidator,
  firstLetterUpper,
  validateBirthDate
} from '../../../utils/masks'

import { api } from '../../services/apiClient'
import { useAuthContext } from '../../contexts/AuthContext'

type SignUpFormData = {
  nome_completo: string
  emailSignUp: string
  nascimento: string
  genero: string
  celular: string
  telefone: string
  cpf: string
  senha: string
  confirmar_senha: string
  newsletter: number
  tipo: number
  cnpj: string
  estrangeiro: string
  ie: string
  im: string
}

const signUpFormSchema = yup.object().shape({
  emailSignUp: yup
    .string()
    .email('Digite um email válido.')
    .required('Campo Obrigatório.'),
  nome_completo: yup.string().required('Campo Obrigatório.'),
  nascimento: yup.string().required('Campo Obrigatório.'),
  celular: yup.string().required('Campo Obrigatório.'),
  cpf: yup.string().required('Campo Obrigatório.'),
  telefone: yup.string(),
  senha: yup.string().required('Campo Obrigatório.'),
  confirmar_senha: yup.string().required('Campo Obrigatório.')
})

const SignUp = () => {
  const toast = useToast()

  const { signIn } = useAuthContext()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpFormSchema)
  })

  const [validations, setValidations] = useState({
    passwordIsValid: true,
    cpfIsValid: true,
    birthDateIsValid: true
  })

  const [show, setShow] = useState({
    confirmar_senha: false,
    senha: false
  })

  const [newsletter, setNewsletter] = useState(true)

  const handleSignin: SubmitHandler<SignUpFormData> = async values => {
    const birthDateIsValid = validateBirthDate(values.nascimento)
    const passwordIsValid = values.senha !== values.confirmar_senha
    const cpfIsValid = cpfValidator(values.cpf)

    if (birthDateIsValid === false) {
      return setValidations({
        birthDateIsValid: false,
        cpfIsValid: true,
        passwordIsValid: true
      })
    }

    if (cpfIsValid === false) {
      return setValidations({
        birthDateIsValid: true,
        cpfIsValid: false,
        passwordIsValid: true
      })
    }

    if (passwordIsValid === true) {
      return setValidations({
        birthDateIsValid: true,
        cpfIsValid: true,
        passwordIsValid: false
      })
    }

    setValidations({
      passwordIsValid: true,
      birthDateIsValid: true,
      cpfIsValid: true
    })

    const newUserObj = {
      nome_completo: firstLetterUpper(values.nome_completo),
      email: values.emailSignUp,
      nascimento: values.nascimento,
      genero: values.genero,
      celular: values.celular
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      telefone: values.telefone
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', ''),
      cpf: values.cpf.replaceAll('.', '').replaceAll('-', ''),
      senha: values.senha,
      newsletter: newsletter === true ? 1 : 0,
      tipo: 1,
      cnpj: '',
      estrangeiro: 0,
      ie: '',
      im: ''
    }

    const response = await api
      .post('/usuarios', newUserObj)
      .then(res => {
        if (res.data.status === 'error') {
          return toast({
            title: 'Erro.',
            description: response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }
        signIn({
          email: values.emailSignUp,
          senha: values.senha
        })
        toast({
          title: 'Cadastro realizado.',
          description: 'Cadastro Realizado',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      })
      .catch(errors => {
        return toast({
          title: 'Erro.',
          description: `${errors.response.data.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  return (
    <Flex maxW="900px" w="100%" m="10px auto" p="2px" direction="column">
      <Text>Criar Conta</Text>
      <Flex as="form" direction="column" onSubmit={handleSubmit(handleSignin)}>
        <Flex
          border="1px solid #ccc"
          mt="30px"
          p="10px"
          direction="column"
          borderRadius={5}
        >
          <HStack w="100%">
            <FormControl w="50%" isInvalid={!!errors.nome_completo}>
              <Text>Nome Completo:</Text>
              <Input
                id="nome_completo"
                name="nome_completo"
                {...register('nome_completo')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.nome_completo && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>

            <FormControl w="50%" isInvalid={!!errors.emailSignUp}>
              <Text>Email:</Text>
              <Input
                id="emailSignUp"
                name="emailSignUp"
                {...register('emailSignUp')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.emailSignUp && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack w="100%">
            <FormControl w="50%" isInvalid={!!errors.nascimento}>
              <Text>Nascimento:</Text>
              <Input
                as={InputMask}
                id="nascimento"
                name="nascimento"
                placeholder="__/__/____"
                mask="99/99/9999"
                {...register('nascimento')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.nascimento && 'Campo Obrigatório'}
              </FormErrorMessage>
              {validations.birthDateIsValid === false && (
                <Text fontSize={14} color="red">
                  Preencha corretamente a data de Nascimento.
                </Text>
              )}
            </FormControl>
            <FormControl w="50%">
              <Text>Gênero:</Text>
              <Select id="genero" name="genero" {...register('genero')}>
                <option>Masculino</option>
                <option>Feminino</option>
              </Select>
            </FormControl>
          </HStack>

          <HStack w="100%">
            <FormControl w="50%" isInvalid={!!errors.celular}>
              <Text>Celular:</Text>
              <Input
                as={InputMask}
                id="celular"
                name="celular"
                placeholder="(__) _____-____"
                mask="(99) 99999-9999"
                {...register('celular')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.celular && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>
            <FormControl w="50%" isInvalid={!!errors.telefone}>
              <Text>Telefone:</Text>
              <Input
                as={InputMask}
                id="telefone"
                name="telefone"
                placeholder="(__) ____-____"
                mask="(99) 9999-9999"
                {...register('telefone')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.telefone && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack w="100%">
            <FormControl w="50%" isInvalid={!!errors.cpf}>
              <Text>CPF:</Text>
              <Input
                as={InputMask}
                id="cpf"
                name="cpf"
                placeholder="___.___.___-__"
                mask="999.999.999-99"
                {...register('cpf')}
              />
              <FormErrorMessage fontSize={12}>
                {errors.cpf && 'Campo Obrigatório'}
              </FormErrorMessage>
              {validations.cpfIsValid === false && (
                <Text fontSize={14} color="red">
                  CPF Inválido.
                </Text>
              )}
            </FormControl>
          </HStack>
        </Flex>

        <Flex
          border="1px solid #ccc"
          mt="30px"
          p="10px"
          direction="column"
          borderRadius={5}
        >
          <HStack w="100%">
            <FormControl w="50%" isInvalid={!!errors.senha}>
              <Text>Senha:</Text>
              <InputGroup size="md">
                <Input
                  id="senha"
                  name="senha"
                  {...register('senha')}
                  pr="4.5rem"
                  type={show.senha ? 'text' : 'password'}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShow({ ...show, senha: !show.senha })}
                  >
                    {show.senha ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize={12}>
                {errors.senha && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>

            <FormControl w="50%" isInvalid={!!errors.confirmar_senha}>
              <Text>Confirmar Senha:</Text>
              <InputGroup size="md">
                <Input
                  id="confirmar_senha"
                  name="confirmar_senha"
                  {...register('confirmar_senha')}
                  pr="4.5rem"
                  type={show.confirmar_senha ? 'text' : 'password'}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShow({
                        ...show,
                        confirmar_senha: !show.confirmar_senha
                      })
                    }
                  >
                    {show.confirmar_senha ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize={12}>
                {errors.confirmar_senha && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          {validations.passwordIsValid === false && (
            <Text fontSize={14} color="red">
              Senhas divergentes.
            </Text>
          )}
        </Flex>

        <Flex
          border="1px solid #ccc"
          mt="30px"
          p="10px"
          direction="column"
          borderRadius={5}
        >
          <Text>Notificações</Text>
          <VStack align="start" w="100%" mt="10px">
            <Checkbox defaultChecked>Desejo receber alertas por SMS</Checkbox>
            <Checkbox
              defaultChecked
              isChecked={newsletter}
              onChange={e => setNewsletter(e.target.checked)}
            >
              Desejo receber e-mails com promoções
            </Checkbox>
          </VStack>
        </Flex>

        <Flex my="20px">
          <Button bg="black" color="white" type="submit" w="200px">
            CADASTRAR
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SignUp
