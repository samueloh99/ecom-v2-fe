import React from 'react'

import CheckoutBaseTemplate from '../Base/checkoutBase'
import CheckoutContent from '../../components/CheckoutSection/CheckoutContent'
import CheckoutAfterPurchase from '../../components/CheckoutSection/CheckoutAfterPurchase'
import OrderWithError from '../../components/CheckoutSection/CheckoutAfterPurchase/OrderWithError'

const CheckoutTemplate = ({ query }) => {
  if (query && query[0] === 'concluido') {
    return (
      <CheckoutBaseTemplate>
        <CheckoutAfterPurchase />
      </CheckoutBaseTemplate>
    )
  }

  if (query && query[0] === 'concluidoorder') {
    return (
      <CheckoutBaseTemplate>
        <OrderWithError />
      </CheckoutBaseTemplate>
    )
  }
  return (
    <CheckoutBaseTemplate>
      <CheckoutContent />
    </CheckoutBaseTemplate>
  )
}

export default CheckoutTemplate
