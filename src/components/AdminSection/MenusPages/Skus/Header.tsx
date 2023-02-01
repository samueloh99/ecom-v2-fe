import React, { useRef } from 'react'

import { useRouter } from 'next/router'

import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

import SkusFilter from '../../FilterDrawer/SkusFilter'
import { useAuthContext } from '../../../../contexts/AuthContext'

const Header = () => {
  const { push } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { userData } = useAuthContext()

  const btnRef = useRef()

  const isRootUser = userData && userData.roles.includes('root')
  return (
    <Box>
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} />}
        mr="5"
      >
        Exportar
      </Button>
      <Button
        ref={btnRef}
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        mr="5"
        onClick={onOpen}
      >
        Filtros
      </Button>
      {isRootUser && (
        <Button
          ref={btnRef}
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          mr="5"
          onClick={() => {
            push({
              pathname: '/admin/produtos_bulk'
            })
          }}
        >
          Adicionar Produto em Massa
        </Button>
      )}
      {isRootUser && (
        <Button
          ref={btnRef}
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          mr="5"
          onClick={() => {
            push({
              pathname: '/admin/fotos_bulk'
            })
          }}
        >
          Adicionar Foto em Massa
        </Button>
      )}
      <SkusFilter isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  )
}

export default Header
