import React from 'react'

import { GetStaticProps } from 'next'

import HomeTemplate from '../templates/Index'
import { api } from '../services/apiClient'

export default function Home({ carousel1, carousel2 }) {
  return <HomeTemplate carousel1={carousel1} carousel2={carousel2} />
}

export const getStaticProps: GetStaticProps = async () => {
  let carousel1Props = {}
  let carousel2Props = {}

  try {
    const carousel1 = await api.post(`/skus/homepage/filtrar`, {
      referencias: [
        'CH-6835',
        'CH-6871',
        'CH-6789',
        'CH-6773',
        'CH-6714',
        'CH-6749',
        'CH-6814',
        'CH-6776',
        'CH-6864',
        'CH-6748'
      ]
    })

    const carousel2 = await api.post(`/skus/homepage/filtrar`, {
      referencias: [
        'CH-6766',
        'CH-6734',
        'CH-6688',
        'CH-6718',
        'CH-6813',
        'CH-6822',
        'CH-6740',
        'CH-6817',
        'CH-6729',
        'CH-6786',
        'CH-6657',
        'CH-6508',
        'CH-6739'
      ]
    })
    carousel1Props = carousel1.data
    carousel2Props = carousel2.data
  } catch (err) {
    carousel1Props = {}
    carousel2Props = {}
  }

  return {
    props: { carousel1: carousel1Props, carousel2: carousel2Props },
    revalidate: 10000
  }
}
