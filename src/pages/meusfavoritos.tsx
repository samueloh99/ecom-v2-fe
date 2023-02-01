import React from 'react'

import { withSSRAuth } from '../../utils/withSSRAuth'
import MeusFavoritosTemplate from '../templates/MeusFavoritos'

const MeusFavoritos = () => {
  return <MeusFavoritosTemplate />
}

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {}
  }
})

export default MeusFavoritos
