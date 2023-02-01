import React from 'react'
import { GetServerSideProps } from 'next'

import BuscarTemplate from '../templates/Buscar'
import { api } from '../services/apiClient'

export const Buscar = ({ response }) => {
  return <BuscarTemplate response={response} />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { b, c, v, o } = query

  let nameFilter = b === undefined ? '' : b
  let categoryFilter = c === undefined ? '' : c
  let variacoesFilter = v === undefined ? '' : v
  let mainFilter = o === undefined ? '' : o

  const { data } = await api.get(
    `/skus/buscar?b=${nameFilter}&c=${categoryFilter}&v=${variacoesFilter}&o=${mainFilter}`
  )

  return {
    props: {
      response: data
    }
  }
}
export default Buscar
