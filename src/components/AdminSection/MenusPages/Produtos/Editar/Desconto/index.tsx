import React from 'react'

import { Flex } from '@chakra-ui/react'

import TableDesconto from './TableDesconto'
import DescontoAdd from './DescontoAdd'

const Desconto = () => {
  return (
    <Flex mt="10" direction="column">
      <DescontoAdd />
      <TableDesconto />
    </Flex>
  )
}

export default Desconto
