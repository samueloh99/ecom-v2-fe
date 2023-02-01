import React from 'react'
import { useRouter } from 'next/router'

import {
  Text,
  HStack,
  Box,
  VStack,
  Stack,
  Wrap,
  SimpleGrid
} from '@chakra-ui/react'

export const Menu = () => {
  const navigationMenus = [
    {
      title: 'Cadastro',
      slug: 'cadastro',
      path: '/pag/cadastro'
    },
    {
      title: 'Compras e Pagamentos',
      slug: 'compra-pagamento',

      path: '/pag/compra-pagamento'
    },
    {
      title: 'Entrega',
      slug: 'entrega',

      path: '/pag/entrega'
    },
    {
      title: 'Segurança',
      slug: 'seguranca',

      path: '/pag/seguranca'
    }
  ]
  const { push, query } = useRouter()

  const slug = query['slug'][0]
  return (
    <VStack p="0px 30px">
      <Text fontSize="18px">DÚVIDAS FREQUENTES</Text>
      <SimpleGrid w="100%" columns={{ base: 2, lg: 4 }} gap={5}>
        {navigationMenus.map((item, index) => {
          return (
            <Box
              display="flex"
              key={index}
              bg={slug === item.slug ? 'black' : 'white'}
              color={slug === item.slug ? 'white' : 'black'}
              border="1px solid black"
              borderRadius="3px"
              textTransform="uppercase"
              py="2px"
              px="10px"
              transition="0.3s ease"
              cursor="pointer"
              _hover={{ background: 'black', color: 'white' }}
              onClick={() => push({ pathname: item.path })}
              textAlign="center"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={{ base: '12px', lg: '14px' }}>{item.title}</Text>
            </Box>
          )
        })}
      </SimpleGrid>
    </VStack>
  )
}

export default Menu
