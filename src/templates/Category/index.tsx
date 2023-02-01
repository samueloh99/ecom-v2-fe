import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import BaseTemplate from '../Base'

import CategoryPage from '../../components/CategoriePageSection'

export const CategoryTemplate = ({ produtos, variantes }) => {
  const { asPath, query, replace } = useRouter()

  const [filter1, setFilter1] = useState<string>('')
  const [filter2, setFilter2] = useState<string[]>([])

  let categoryNameQuery = query.slug === undefined ? '' : query.slug

  useEffect(() => {
    if (query.v === undefined && query.o === undefined) {
      setFilter1('')
      setFilter2([])
    } else {
      if (query.v.length === 0 && query.o.length === 0) {
        replace(`/categoria/${query.pid}/${categoryNameQuery}`, undefined, {
          shallow: true
        })
      }
      const filterQueryV = (query.v as string).split('.')

      setFilter1(query.o as string)

      filterQueryV.map(item => {
        !filter2.includes(item) && setFilter2(old => [...old, item])
      })
    }
  }, [asPath])

  return (
    <BaseTemplate>
      <CategoryPage
        produtos={produtos}
        variantes={variantes}
        setFilter2={setFilter2}
        filter2={filter2}
        setFilter1={setFilter1}
        filter1={filter1}
      />
    </BaseTemplate>
  )
}

export default CategoryTemplate
