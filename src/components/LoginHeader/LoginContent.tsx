import React, { useState, useContext } from 'react'

import { useForm } from 'react-hook-form'

import NextLink from 'next/link'

import {
  Icon,
  DrawerBody,
  InputGroup,
  FormErrorMessage,
  InputRightElement,
  Flex,
  Divider,
  FormLabel,
  Stack,
  FormControl,
  Text,
  Button,
  Input
} from '@chakra-ui/react'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import ForgotPasswordContent from './ForgotPasswordContent'

import { AuthContext } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'

const LoginContent = ({ onClose }) => {
  const { push } = useRouter()
  const { signIn } = useContext(AuthContext)

  const [show, setShow] = useState(false)
  const [forgotPass, setForgotPass] = useState(false)

  const [invalid, setInvalid] = useState(false)

  const handleClick = () => setShow(!show)
  const handleForgot = () => setForgotPass(!forgotPass)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async values => {
    const response = await signIn(values)
    if (response === -1) {
      setInvalid(true)
    } else {
      setInvalid(false)
      onClose()
    }
  }

  if (forgotPass) {
    return (
      <ForgotPasswordContent
        forgotPass={forgotPass}
        setForgotPass={setForgotPass}
      />
    )
  }

  return (
    <DrawerBody>
      <Stack mt="5" direction="column" alignItems="start">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text fontWeight="bold" mb="10px">
            SE VOCÊ JÁ POSSUI UMA CONTA, FAÇA O LOGIN ABAIXO
          </Text>

          <FormLabel fontSize="14px">Login*</FormLabel>
          <FormControl isInvalid={!!errors.email}>
            <Input
              _focus={{ boxShadow: 'none' }}
              borderColor={invalid === true ? 'red' : 'inherit'}
              {...register('email', {
                required: 'Digite seu email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Digite um email valido'
                }
              })}
            />
            <FormErrorMessage>
              {errors.email && 'Campo Obrigatório'}
            </FormErrorMessage>
          </FormControl>

          <FormLabel fontSize="14px">Senha*</FormLabel>
          <InputGroup size="md">
            <FormControl isInvalid={!!errors.senha}>
              <Input
                _focus={{ boxShadow: 'none' }}
                borderColor={invalid === true ? 'red' : 'inherit'}
                {...register('senha', {
                  required: 'Digite sua senha'
                })}
                type={show ? 'text' : 'password'}
              />
              <FormErrorMessage>
                {errors.senha && 'Campo Obrigatório'}
              </FormErrorMessage>
            </FormControl>
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleClick}
                _focus={{ boxShadow: 'none' }}
              >
                {show ? (
                  <Icon fontSize={18} as={AiOutlineEye} />
                ) : (
                  <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
          {invalid && (
            <Flex m="10px 0px">
              <Text fontSize="14px" color="red">
                Login ou Senha Inválidos.
              </Text>
            </Flex>
          )}
          <Button
            bg="transparent"
            p="0"
            _hover={{ bg: 'transparent', textDecoration: 'underline' }}
            onClick={handleForgot}
          >
            Esqueceu a sua senha ?
          </Button>
          <Button
            type="submit"
            w="100%"
            color="white"
            bg="black"
            isLoading={isSubmitting}
          >
            ENTRAR
          </Button>
        </form>
      </Stack>
      <Divider my="10" />
      <Stack spacing={6}>
        <Text fontWeight="bold">NÃO POSSUO UMA CONTA</Text>
        <Text>Crie a sua conta em nosso site e veja os benefícios</Text>
        <Button
          w="100%"
          color="white"
          bg="black"
          onClick={() => push({ pathname: '/cadastro' })}
        >
          CRIAR UMA CONTA
        </Button>
      </Stack>
    </DrawerBody>
  )
}

export default LoginContent
