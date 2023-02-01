import React from 'react'

import { useRouter } from 'next/router'

import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'

export const MenuDropdown = ({ nome, pedido_id }) => {
  const router = useRouter()

  return (
    <Menu>
      <MenuButton
        bg="transparent"
        _focus={{ boxShadow: 'none' }}
        _hover={{ bg: 'none' }}
        _active={{ bg: 'none' }}
        as={Button}
        textDecoration="underline"
      >
        {nome}
      </MenuButton>
      <MenuList bg="black" borderColor="transparent">
        <MenuItem
          onClick={() => router.push(`/admin/pedidos/editar/${pedido_id}`)}
        >
          Ver pedido
        </MenuItem>
        <MenuItem>Ver Cliente</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default MenuDropdown
