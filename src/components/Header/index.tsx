import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'

import { motion } from 'framer-motion'

import {
  Flex,
  Img,
  useBreakpointValue,
  HStack,
  Icon,
  useDisclosure,
  Input,
  Text
} from '@chakra-ui/react'

import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai'

import Categories from './Categories'
import HeaderDrawer from './HeaderDrawer'
import SearchBar from './SearchBar'
import HeaderIcons from './HeaderIcons'

const Header = () => {
  const { push } = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [searchBarIsOn, setSearchBarIsOn] = useState(false)

  const [buscar, setBuscar] = useState('')

  const btnRef = useRef()

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false
  })

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' }
  }

  useEffect(() => {
    if (searchBarIsOn && isDrawerSidebar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [searchBarIsOn, isDrawerSidebar])

  const handleClickEnter = (e: string) => {
    if (e === 'Enter') {
      setBuscar('')
      return push({
        pathname: '/buscar',
        query: { b: buscar }
      })
    }
  }

  return (
    <Flex
      transition="0.3s"
      w="100%"
      borderBottom={'1px solid black'}
      direction="column"
      _hover={{ backgroundColor: 'white' }}
      zIndex={2}
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <Flex w="100%" bg="#ECE3D7" justify="center" p="5px 0px">
        <Text fontSize={{ base: '13px', lg: '16px' }} textTransform="uppercase">
          Frete Grátis para compras acima de R$ 499,90
        </Text>
      </Flex>
      <HStack>
        {isDrawerSidebar && (
          <Flex
            direction="column"
            position="absolute"
            justifyContent="center"
            left="5"
            h="100%"
          >
            <Icon as={AiOutlineMenu} fontSize={20} onClick={onOpen} />
          </Flex>
        )}
        <SearchBar
          setSearchBarIsOn={setSearchBarIsOn}
          searchBarIsOn={searchBarIsOn}
        />
        <HeaderIcons />
        <Img
          cursor="pointer"
          draggable={false}
          onClick={() => push({ pathname: '/' })}
          w={{ base: '70px', lg: '100px' }}
          src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/icone-chaes.svg"
        />
      </HStack>
      {isDrawerSidebar && (
        <HeaderDrawer isOpen={isOpen} btnRef={btnRef} onClose={onClose} />
      )}
      {!isDrawerSidebar && (
        <HStack spacing={10}>
          <Categories />
        </HStack>
      )}

      {searchBarIsOn && isDrawerSidebar && (
        <Flex
          position="fixed"
          w="100%"
          h="100vh"
          top="170px"
          bg="rgba(0,0,0,.8)"
          onClick={() => setSearchBarIsOn(false)}
        />
      )}
      {isDrawerSidebar && (
        <Flex
          w="100%"
          position="absolute"
          top="101px"
          bg="white"
          justifyContent="center"
          alignItems="center"
          p="10px 10px"
          as={motion.nav}
          animate={searchBarIsOn ? 'open' : 'closed'}
          variants={variants}
        >
          <HStack p="5px" bg="#f6f5f3" borderRadius="5px" w="100%">
            <Icon as={AiOutlineSearch} fontSize={20} />
            <Input
              placeholder="Busque por Produtos..."
              border="none"
              _focus={{ borderColor: 'none' }}
              onKeyPress={e => handleClickEnter(e.key)}
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
            />
          </HStack>
        </Flex>
      )}
    </Flex>
  )
}

export default Header
