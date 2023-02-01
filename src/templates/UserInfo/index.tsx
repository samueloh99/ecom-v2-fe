import React from 'react'

import { Flex } from '@chakra-ui/react'

import UserInfoContent from '../../components/UserInfoSection'

import UserInfoSenha from '../../components/UserInfoSection/Senha'
import UserInfoCreditos from '../../components/UserInfoSection/Creditos'
import UserInfoCadastro from '../../components/UserInfoSection/Cadastro'
import UserInfoCartoes from '../../components/UserInfoSection/Cartoes'
import UserInfoPedidos from '../../components/UserInfoSection/Pedidos'
import UserInfoEnderecos from '../../components/UserInfoSection/Enderecos'
import UserInfoRastreio from '../../components/UserInfoSection/Rastreio'

import BaseTemplate from '../Base'

const UserInfo = ({ slug }) => {
  if (slug === undefined) {
    return (
      <BaseTemplate>
        <Flex
          p="30px 10px"
          maxW="100%"
          h="auto"
          justifyContent="center"
          alignItems="center"
          direction={{ base: 'column', lg: 'row' }}
        >
          <UserInfoContent />
        </Flex>
      </BaseTemplate>
    )
  }

  switch (slug[0]) {
    case 'senha':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoSenha />
          </Flex>
        </BaseTemplate>
      )

    case 'pedidos':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoPedidos />
          </Flex>
        </BaseTemplate>
      )
    case 'cadastro':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoCadastro />
          </Flex>
        </BaseTemplate>
      )

    case 'creditos':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoCreditos />
          </Flex>
        </BaseTemplate>
      )

    case 'cartoes':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoCartoes />
          </Flex>
        </BaseTemplate>
      )

    case 'enderecos':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoEnderecos />
          </Flex>
        </BaseTemplate>
      )

    case 'rastreio':
      return (
        <BaseTemplate>
          <Flex
            p="30px 10px"
            maxW="100%"
            h={['auto', '90vh']}
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', lg: 'row' }}
          >
            <UserInfoRastreio />
          </Flex>
        </BaseTemplate>
      )
  }
}

export default UserInfo
