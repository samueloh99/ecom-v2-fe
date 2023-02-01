import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Stack, Flex, Heading, HStack, Badge, Icon } from '@chakra-ui/react'

import { IoMdCloseCircle } from 'react-icons/io'

import Header from './Header'

import TableContent from './TableContent'

const AdminPedidosProdutos = () => {
  const { query, push, pathname } = useRouter()

  const [appliedFilters, setAppliedFilters] = useState([])

  useEffect(() => {
    let newQuery = query
    delete newQuery['slug']

    if (Object.keys(newQuery).length > 0) {
      const newObj = Object.keys(newQuery).map(item => {
        return item
      })

      setAppliedFilters(newObj)
    } else {
      setAppliedFilters([])
    }
  }, [pathname, query])

  const handleRemoveFilter = (title: string) => {
    let newQuery = query
    delete newQuery['slug']
    delete newQuery[title]

    push({
      pathname: '/admin/pedido_produtos',
      query: newQuery
    })
  }
  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          Pedidos Produtos
        </Heading>
        <Header />
      </Flex>
      <HStack>
        {appliedFilters.map((item, index) => {
          return (
            <Badge
              key={index}
              colorScheme="green"
              display="flex"
              alignItems="center"
            >
              {item}

              <Icon
                ml="2"
                cursor="pointer"
                as={IoMdCloseCircle}
                onClick={() => handleRemoveFilter(item)}
              />
            </Badge>
          )
        })}
        {appliedFilters.length > 0 && (
          <Badge
            onClick={() =>
              push({
                pathname: `/admin/pedido_produtos`
              })
            }
            colorScheme="gray"
            cursor="pointer"
            alignItems="center"
          >
            LIMPAR FILTRO
          </Badge>
        )}
      </HStack>
      <TableContent />
    </Stack>
  )
}

export default AdminPedidosProdutos
