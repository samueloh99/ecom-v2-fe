import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Text,
  VStack,
  Icon
} from '@chakra-ui/react'

import { IoIosArrowForward } from 'react-icons/io'

import { useCategorias } from '../../services/hooks/useCategorias'

import { signOut, useAuthContext } from '../../contexts/AuthContext'

type IPropsTree = {
  id: number
  nome: string
  pai_id: number
  slug: string
  updated_at: Date
}

const HeaderDrawer = ({ isOpen, onClose, btnRef }) => {
  const { push } = useRouter()
  const [subCatId, setSubCatId] = useState(0)

  const { data } = useCategorias()

  const { setUserData, broadcastAuth, isAuthenticated } = useAuthContext()

  const handleLogout = () => {
    broadcastAuth.current.postMessage('signOut')
    signOut()
    setUserData(undefined)
    onClose()
    push({
      pathname: '/'
    })
  }

  const Submenus = ({ nome, id }: IPropsTree) => {
    const children = data
      .filter(item => item.ativo === 1)
      .filter(child => child.pai_id === id)

    return (
      <VStack key={id} pl="8px" align="start">
        <Text
          key={id}
          textDecoration="underline"
          onClick={() => {
            push({ pathname: `/categoria/${id}` })
            setSubCatId(null)
            return onClose()
          }}
        >
          {nome}
        </Text>
        {children.length > 0 && children.map(item => Submenus(item))}
      </VStack>
    )
  }

  const buildTree = ({ nome, id }: IPropsTree) => {
    const children = data
      .filter(item => item.ativo === 1)
      .filter(child => child.pai_id === id)

    return (
      <Flex
        key={id}
        cursor="pointer"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid #ccc"
        h="auto"
        direction="column"
      >
        <Flex
          w="100%"
          h="52px"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => {
            if (id === 15) {
              return push({ pathname: '/pag/sobre' })
            }
            if (children.length === 0) {
              push({ pathname: `/categoria/${id}` })
              setSubCatId(null)
              return onClose()
            }
            if (subCatId !== id) {
              return setSubCatId(id)
            } else {
              push({ pathname: `/categoria/${id}` })
              setSubCatId(null)
              return onClose()
            }
          }}
        >
          <Text>{nome}</Text>
          {children.length > 0 && <Icon as={IoIosArrowForward} fontSize={18} />}
        </Flex>
        {subCatId === id && children.length > 0 && (
          <VStack w="100%" align="start" mb="10px">
            {children.map(item => Submenus(item))}
          </VStack>
        )}
      </Flex>
    )
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton right="-40px" color="white" />

        <DrawerBody m="0" p="0" bg="#f6f5f3">
          <Flex
            px="15px"
            cursor="pointer"
            borderBottom="1px solid #ccc"
            justifyContent="space-between"
            alignItems="center"
            h="52px"
            onClick={() => {
              push({ pathname: '/' })
              onClose()
            }}
          >
            Home Page
          </Flex>
          <Flex direction="column" bg="white" px="15px">
            {data &&
              data
                .filter(item => item.ativo === 1)
                .filter(item => !item.pai_id)
                .map(item => buildTree(item))}
          </Flex>
          <Flex direction="column" px="15px">
            <Flex
              cursor="pointer"
              borderBottom="1px solid #ccc"
              justifyContent="space-between"
              alignItems="center"
              h="52px"
              onClick={() => {
                push({ pathname: '/userinfo' })
                onClose()
              }}
            >
              Minha conta
            </Flex>
            <Flex
              cursor="pointer"
              borderBottom="1px solid #ccc"
              justifyContent="space-between"
              alignItems="center"
              h="52px"
              onClick={() => {
                push({ pathname: '/meusfavoritos' })
                onClose()
              }}
            >
              Meus Favoritos
            </Flex>

            {isAuthenticated && (
              <Flex
                cursor="pointer"
                borderBottom="1px solid #ccc"
                justifyContent="space-between"
                alignItems="center"
                h="52px"
                onClick={() => {
                  handleLogout()
                  onClose()
                }}
              >
                Sair da conta
              </Flex>
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
export default HeaderDrawer
