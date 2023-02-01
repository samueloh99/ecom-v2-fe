import React from 'react'

import BaseTemplate from '../Base'

import GeneralSearch from '../../components/GeneralSearch'

export const BuscarTemplate = ({ response }) => {
  return (
    <BaseTemplate>
      <GeneralSearch data={response} />
    </BaseTemplate>
  )
}

export default BuscarTemplate
