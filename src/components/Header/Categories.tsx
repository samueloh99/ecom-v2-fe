import React, { useState } from 'react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import { Flex, VStack, HStack, Text } from '@chakra-ui/react'

import { useCategorias } from '../../services/hooks/useCategorias'

type IPropsTree = {
  id: number
  nome: string
  pai_id: number
  slug: string
  updated_at: Date
}

const Categories = () => {
  const [onHover, setOnhover] = useState(0)
  const { data } = useCategorias()

  const { push } = useRouter()

  const Submenus = ({ nome, id }: IPropsTree) => {
    const children = data
      .filter(item => item.ativo === 1)
      .filter(child => child.pai_id === id)

    return (
      <VStack key={id} align="start" pl="8px">
        <HStack>
          <Text
            key={id}
            textDecoration="underline"
            onClick={() => push({ pathname: `/categoria/${id}` })}
          >
            {nome}
          </Text>
        </HStack>
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
        position="relative"
        onMouseEnter={() => setOnhover(id)}
        cursor="pointer"
        border="1px solid transparent"
      >
        <NextLink href={id === 15 ? `/pag/sobre` : `/categoria/${id}`}>
          <Text fontSize="14px" textTransform="uppercase">
            {nome}
          </Text>
        </NextLink>
        {children.length > 0 && onHover === id && (
          <VStack
            spacing={5}
            backgroundColor="white"
            onMouseLeave={() => setOnhover(0)}
            position="absolute"
            align="start"
            top="27px"
            borderTop="2px solid black"
            left="-50%"
            width="200px"
            p="5px 10px 20px 10px"
          >
            {children.length > 0 && children.map(item => Submenus(item))}
          </VStack>
        )}
      </Flex>
    )
  }

  return (
    <HStack spacing={6} pb="5px">
      {data &&
        data
          .filter(item => item.ativo === 1)
          .filter(item => !item.pai_id)
          .map(item => buildTree(item))}
    </HStack>
  )
}

export default Categories
