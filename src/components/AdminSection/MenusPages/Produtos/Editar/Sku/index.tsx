import React from 'react'

import { Flex } from '@chakra-ui/react'

import SkuAdd from './SkuAdd'
import TableSkuContent from './TableSkuContent'

const Sku = () => {
  return (
    <Flex mt="10" direction="column">
      <SkuAdd />
      <TableSkuContent />
    </Flex>
  )
}

export default Sku
