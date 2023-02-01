import React, { useState, useCallback, useContext } from 'react'

import * as yup from 'yup'

import { useForm } from 'react-hook-form'

import NextLink from 'next/link'

import {
  Icon,
  InputGroup,
  InputRightElement,
  Divider,
  Flex,
  FormLabel,
  Stack,
  Text,
  Button,
  Input
} from '@chakra-ui/react'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import ForgotPasswordContent from '../LoginHeader/ForgotPasswordContent'

import { AuthContext } from '../../contexts/AuthContext'

const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        })

        return {
          values,
          errors: {}
        }
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message
              }
            }),
            {}
          )
        }
      }
    },
    [validationSchema]
  )

const validationSchema = yup.object({
  email: yup.string().required('Required'),
  senha: yup.string().required('Required')
})

const ReLogin = () => {
  const { signIn } = useContext(AuthContext)

  const [show, setShow] = useState(false)
  const [forgotPass, setForgotPass] = useState(false)
  const handleClick = () => setShow(!show)
  const handleForgot = () => setForgotPass(!forgotPass)

  const resolver = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver })

  if (forgotPass) {
    return (
      <ForgotPasswordContent
        forgotPass={forgotPass}
        setForgotPass={setForgotPass}
      />
    )
  }

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack mt="5" direction="column" alignItems="start">
        <form onSubmit={handleSubmit(data => signIn(data))}>
          <Text fontWeight="bold">
            SE VOCÊ JÁ POSSUI UMA CONTA, FAÇA O LOGIN ABAIXO
          </Text>
          <FormLabel fontSize="14px">Login*</FormLabel>
          <Input _focus={{ boxShadow: 'none' }} {...register('email')} />
          <FormLabel fontSize="14px">Senha*</FormLabel>
          <InputGroup size="md">
            <Input
              _focus={{ boxShadow: 'none' }}
              {...register('senha')}
              pr="4.5rem"
              type={show ? 'text' : 'password'}
            />
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
          <Button
            bg="transparent"
            p="0"
            _hover={{ bg: 'transparent', textDecoration: 'underline' }}
            onClick={handleForgot}
          >
            Esqueceu a sua senha ?
          </Button>
          <Button type="submit" w="100%" color="white" bg="black">
            ENTRAR
          </Button>
        </form>
      </Stack>
      <Divider my="10" w="50%" />
      <Stack spacing={6}>
        <Text fontWeight="bold">NÃO POSSUO UMA CONTA</Text>
        <Text>Crie a sua conta em nosso site e veja os benefícios</Text>
        <NextLink href="/cadastro">
          <Button w="100%" color="white" bg="black">
            CRIAR UMA CONTA
          </Button>
        </NextLink>
      </Stack>
    </Flex>
  )
}

export default ReLogin
