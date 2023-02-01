import React from 'react'

import { Flex } from '@chakra-ui/react'

import ReLogin from '../../components/UserInfoSection/ReLogin'

import BaseTemplate from '../Base'

const Login = () => {
  return (
    <BaseTemplate>
      <Flex
        p="30px 10px"
        maxW="100%"
        justifyContent="center"
        direction={{ base: 'column', lg: 'row' }}
      >
        <ReLogin />
      </Flex>
    </BaseTemplate>
  )
}

export default Login
