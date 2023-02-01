import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Stack,
  Icon,
  Text,
  Flex,
  Input,
  FormControl,
  FormLabel,
  HStack,
  InputRightElement,
  Button,
  InputGroup
} from '@chakra-ui/react'

import { IoMdArrowBack } from 'react-icons/io'
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
  AiOutlineClose
} from 'react-icons/ai'

import { BsPatchCheckFill } from 'react-icons/bs'

import { api } from '../../../services/apiClient'

export const UserInfoSenha = () => {
  const { push } = useRouter()

  const [confirmPass, setConfirmPass] = useState(undefined)
  const [isValid, setIsValid] = useState({
    status: true,
    msg: 'Senha Inválida.'
  })
  const [passChanged, setPassChanged] = useState(false)

  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  })

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (passwords.confirm.length === 0) {
      return setConfirmPass(undefined)
    }

    const checkConfirmPass =
      passwords.confirm.length > 0 && passwords.new === passwords.confirm

    if (checkConfirmPass) {
      setConfirmPass(true)
    } else {
      setConfirmPass(false)
    }
  }, [passwords.confirm])

  const onSubmit = async () => {
    if (confirmPass === false || confirmPass === undefined) {
      return setIsValid({ ...isValid, status: false })
    }

    await api
      .patch('/perfil/editar', {
        senha_antiga: passwords.old,
        senha: passwords.new
      })
      .then(res => {
        if (res.status === 200) {
          setIsValid({ ...isValid, status: true })
          return setPassChanged(true)
        }
        if (res.data.status === 'error') {
          return setIsValid({ msg: res.data.message as string, status: false })
        }
      })
  }

  return (
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

      {passChanged === true ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="column"
          h="100%"
        >
          <Icon as={BsPatchCheckFill} fontSize={40} color="green" />
          <Text>Sua senha foi alterado com sucesso.</Text>
        </Stack>
      ) : (
        <Flex direction="column">
          <Stack direction={['column', 'row']} mt="20px">
            <Flex w="100%" direction="column">
              <FormLabel>Senha Antiga</FormLabel>
              <InputGroup size="md">
                <FormControl>
                  <Input
                    onChange={e =>
                      setPasswords({ ...passwords, old: e.target.value })
                    }
                    _focus={{ boxShadow: 'none' }}
                    type={showPass.old ? 'text' : 'password'}
                  />
                </FormControl>
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShowPass({ ...showPass, old: !showPass.old })
                    }
                    _focus={{ boxShadow: 'none' }}
                  >
                    {showPass.old ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
            <Flex w="100%" direction="column">
              <Flex>
                <FormLabel
                  color={
                    confirmPass === true
                      ? 'green'
                      : confirmPass === false
                      ? 'red'
                      : 'black'
                  }
                >
                  Senha Nova
                </FormLabel>
                {confirmPass === true && (
                  <Icon as={AiOutlineCheck} fontSize={20} color="green" />
                )}

                {confirmPass === false && (
                  <Icon as={AiOutlineClose} fontSize={20} color="red" />
                )}
              </Flex>
              <InputGroup size="md">
                <FormControl>
                  <Input
                    onChange={e =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    borderColor={
                      confirmPass === true
                        ? 'green'
                        : confirmPass === false
                        ? 'red'
                        : 'inherit'
                    }
                    _focus={{ boxShadow: 'none' }}
                    type={showPass.new ? 'text' : 'password'}
                  />
                </FormControl>
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShowPass({ ...showPass, new: !showPass.new })
                    }
                    _focus={{ boxShadow: 'none' }}
                  >
                    {showPass.new ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
            <Flex w="100%" direction="column">
              <Flex>
                <FormLabel
                  color={
                    confirmPass === true
                      ? 'green'
                      : confirmPass === false
                      ? 'red'
                      : 'black'
                  }
                >
                  Confirmar Senha
                </FormLabel>
                {confirmPass === true && (
                  <Icon as={AiOutlineCheck} fontSize={20} color="green" />
                )}

                {confirmPass === false && (
                  <Icon as={AiOutlineClose} fontSize={20} color="red" />
                )}
              </Flex>
              <InputGroup size="md">
                <FormControl>
                  <Input
                    onChange={e =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    borderColor={
                      confirmPass === true
                        ? 'green'
                        : confirmPass === false
                        ? 'red'
                        : 'inherit'
                    }
                    _focus={{ boxShadow: 'none' }}
                    type={showPass.confirm ? 'text' : 'password'}
                  />
                </FormControl>
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShowPass({ ...showPass, confirm: !showPass.confirm })
                    }
                    _focus={{ boxShadow: 'none' }}
                  >
                    {showPass.confirm ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Stack>
          <Flex direction="column" mt="10px" w="100%" alignItems="center">
            {isValid.status === false && <Text color="red">{isValid.msg}</Text>}

            <Button
              w="200px"
              bg="black"
              color="white"
              onClick={() => onSubmit()}
            >
              Enviar
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default UserInfoSenha
