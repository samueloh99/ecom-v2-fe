import React from 'react'

import ProductTemplate from '../../templates/Product'

import { ProductPageInfoProvider } from '../../contexts/ProductPageInfoContext'
import { api } from '../../services/apiClient'

export default function Product(props) {
  return (
    <ProductPageInfoProvider>
      <ProductTemplate {...props} />
    </ProductPageInfoProvider>
  )
}

export async function getStaticProps({ params }) {
  const { slug } = params

  const { data } = await api.get(`/produtos/buscar/${slug}`)

  return {
    props: {
      product: data
    },
    revalidate: 10000
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
