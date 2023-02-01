import React from 'react'

import { GetServerSideProps } from 'next'

import CategoryTemplate from '../../../templates/Category'
import { api } from '../../../services/apiClient'

export const Categoria = ({ produtos, variantes }) => {
  return <CategoryTemplate produtos={produtos} variantes={variantes} />
}
export default Categoria

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { pid } = query

  const { data } = await api.get(`/skus/buscar/cat/${pid}`)

  const { data: data_variants } = await api.get(
    `/skus/buscar/variantes/cat/${pid}`
  )

  return {
    props: {
      produtos: data,
      variantes: data_variants,
      slug: query,
      pid: query
    }
  }
}
