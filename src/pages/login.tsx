import React from 'react'

import { withSSRGuest } from '../../utils/withSSRGuest'

import LoginTemplate from '../templates/Login'

const Login = () => {
  return <LoginTemplate />
}

export default Login

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {}
  }
})
