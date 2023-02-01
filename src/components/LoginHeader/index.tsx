import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  Icon,
  Button,
  Divider,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue
} from '@chakra-ui/react'

import { AiOutlineUser } from 'react-icons/ai'

import LoginContent from './LoginContent'

import { signOut, useAuthContext } from '../../contexts/AuthContext'

const Login = () => {
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isAuthenticated, setUserData, broadcastAuth } = useAuthContext()

  const handleLogout = () => {
    broadcastAuth.current.postMessage('signOut')
    signOut()
    setUserData(undefined)
  }

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  return (
    <Flex alignItems="center">
      {isAuthenticated ? (
        <Icon
          as={AiOutlineUser}
          onClick={() => router.push('/userinfo')}
          fontSize={25}
          cursor="pointer"
        />
      ) : (
        <Icon
          as={AiOutlineUser}
          fontSize={25}
          onClick={onOpen}
          cursor="pointer"
        />
      )}

      {isAuthenticated && !isMobile && (
        <Button
          bg="transparent"
          textDecoration="underline"
          _hover={{ background: 'transparent' }}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      )}

      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontWeight="bold">IDENTIFICAÇÃO</DrawerHeader>
          <Divider />

          <LoginContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default Login
