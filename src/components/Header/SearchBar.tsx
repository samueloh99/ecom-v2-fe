import React, { useState } from 'react'

import { useRouter } from 'next/router'

import { HStack, Icon, Input, useBreakpointValue } from '@chakra-ui/react'

import { AiOutlineSearch } from 'react-icons/ai'

const SearchBar = ({ setSearchBarIsOn, searchBarIsOn }) => {
  const { push } = useRouter()

  const [buscar, setBuscar] = useState('')

  const handleClickEnter = (e: string) => {
    if (e === 'Enter') {
      return push({
        pathname: '/buscar',
        query: { b: buscar }
      })
    }
  }

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false
  })

  if (isDrawerSidebar) {
    return (
      <HStack
        position="absolute"
        direction="row"
        alignItems="center"
        left="10"
        m="auto"
        h="100%"
        onClick={() => setSearchBarIsOn(!searchBarIsOn)}
      >
        <Icon as={AiOutlineSearch} fontSize={20} />
      </HStack>
    )
  }

  return (
    <HStack
      position="absolute"
      direction="row"
      alignItems="center"
      left="10"
      m="auto"
      h="100%"
    >
      <Icon as={AiOutlineSearch} fontSize={20} />
      <Input
        _focus={{ boxShadow: 'none' }}
        border="none"
        placeholder="Procurar..."
        onKeyPress={e => handleClickEnter(e.key)}
        value={buscar}
        onChange={e => setBuscar(e.target.value)}
        h="30px"
      />
    </HStack>
  )
}

export default SearchBar
