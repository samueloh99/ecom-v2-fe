import { GetServerSideProps } from 'next'
import React from 'react'

import CheckoutTemplate from '../../templates/Checkout'
import { CheckoutProvider } from '../../contexts/CheckoutContext'

const Checkout = ({ query }) => {
  return (
    <CheckoutProvider>
      <CheckoutTemplate query={query['slug']} />
    </CheckoutProvider>
  )
}

export default Checkout

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query
    }
  }
}
