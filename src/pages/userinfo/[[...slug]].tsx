import React from 'react'

import { withSSRAuth } from '../../../utils/withSSRAuth'

import UserInfoTemplate from '../../templates/UserInfo'

const UserInfo = ({ query }) => {
  return <UserInfoTemplate {...query} />
}

export default UserInfo

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: { query: ctx.query }
  }
})
