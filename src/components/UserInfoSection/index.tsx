import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Flex, Text, Spinner, Grid, Icon } from '@chakra-ui/react'

import { api } from './../../services/apiClient'

import {
  AiOutlineUser,
  AiOutlineOrderedList,
  AiOutlineLock
} from 'react-icons/ai'

import { FaRegAddressCard } from 'react-icons/fa'
import { useAuthContext } from '../../contexts/AuthContext'

interface UserDataInfoProps {
  ativo: number
  celular: string
  cpf: string
  created_at: string
  email: string
  genero: null
  id: number
  nascimento: Date
  nome_completo: string
  permissoes: string[]
  roles: string[]
  telefone: string
  tipo: number
  updated_at: string
}

const topics = [
  { title: 'Pedidos', url: '/userinfo/pedidos', icon: AiOutlineOrderedList },
  { title: 'Meus Dados', url: '/userinfo/cadastro', icon: AiOutlineUser },
  { title: 'Alterar Senha', url: '/userinfo/senha', icon: AiOutlineLock },
  { title: 'Endereços', url: '/userinfo/enderecos', icon: FaRegAddressCard }
  // { title: 'Créditos', url: '/userinfo/creditos', icon: AiOutlineWallet },
  // { title: 'Cartões', url: '/userinfo/cartoes', icon: AiOutlineCreditCard },
  // { title: 'Rastrear Pedidos', url: '/userinfo/rastreio', icon: FiTruck }
]

export const UserInfoSection = () => {
  const { push } = useRouter()
  const { userData } = useAuthContext()

  return (
    <Flex direction="column" h="100%" w="70%">
      <Flex direction="column" alignItems="center">
        <Text fontSize={20} fontWeight="bold">
          Olá, {userData && userData.nome_completo.toLocaleUpperCase()} !
        </Text>
        <Text fontSize={15}>{userData && userData.email}</Text>
      </Flex>
      <Grid
        mt="20px"
        templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gap={2}
      >
        {topics.map((item, index) => {
          return (
            <Flex
              key={index}
              p="5px 0px"
              alignItems="center"
              cursor="pointer"
              direction="column"
              bg="black"
              fontSize={['12px', '15px']}
              color="white"
              onClick={() =>
                push({
                  pathname: item.url
                })
              }
              borderRadius={5}
            >
              <Icon as={item.icon} fontSize={[20, 25]} />
              {item.title}
            </Flex>
          )
        })}
      </Grid>
    </Flex>
  )
}

export default UserInfoSection
