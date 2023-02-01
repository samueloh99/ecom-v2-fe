import React from 'react'

import BaseTemplate from '../Base'

import Link from 'next/link'

import CarrinhoPage from '../../components/CartPage'

export const CarrinhoTemplate = () => {
  return (
    <BaseTemplate>
      <CarrinhoPage />
    </BaseTemplate>
  )
}

export default CarrinhoTemplate
