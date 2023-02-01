import React from 'react'

import { GetServerSideProps } from 'next'

import ResetPasswordTemplate from '../../templates/ResetPassword'

export const ResetPassword = ({ slug, pid }) => {
  return <ResetPasswordTemplate />
}
export default ResetPassword

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      slug: query,
      pid: query
    }
  }
}
