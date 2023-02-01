import React, { useContext, useState, useEffect } from 'react'

import NextLink from 'next/link'

import { parseCookies } from 'nookies'

import { Flex, Box, Stack, Icon, Text } from '@chakra-ui/react'

import { AiOutlineHeart } from 'react-icons/ai'

import { useFavoritos } from '../../services/hooks/useFavoritos'
import { AuthContext } from '../../contexts/AuthContext'

import CartDrawer from '../CartDrawer'
import Login from '../LoginHeader'

const HeaderIcons = () => {
  const { userData } = useContext(AuthContext)

  const { data } = useFavoritos()

  const [favQty, setFavQty] = useState(0)

  const cookies = parseCookies()

  useEffect(() => {
    if (cookies['nextauth.token'] === undefined) {
      setFavQty(0)
    } else {
      const qty =
        userData &&
        data &&
        data.filter(item => item.usuario_id === userData.id).length

      setFavQty(qty)
    }
  }, [data, userData])

  return (
    <Stack
      position="absolute"
      right={{ base: 5, lg: 10 }}
      spacing={{ base: 2, lg: 5 }}
      direction="row"
      alignItems="center"
    >
      <NextLink href="/meusfavoritos">
        <Flex position="relative">
          <Box
            display="flex"
            bg="black"
            w="14px"
            h="14px"
            color="white"
            borderRadius="100%"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            left="5"
            bottom="3"
          >
            <Text fontSize="10px">{favQty}</Text>
          </Box>
          <Icon cursor="pointer" fontSize={25} as={AiOutlineHeart} />
        </Flex>
      </NextLink>
      <Login />

      <CartDrawer />
    </Stack>
  )
}

export default HeaderIcons
