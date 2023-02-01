import { GetServerSideProps } from 'next'
import React from 'react'

import InstitucioanlTemplate from '../../templates/Institucional'

const TrocasDevolucoes = ({ slug }) => {
  return <InstitucioanlTemplate {...slug} />
}

export default TrocasDevolucoes

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      slug: ctx.query
    }
  }
}
