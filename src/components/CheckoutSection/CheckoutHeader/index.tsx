import React from 'react'

import NextLink from 'next/link'

import { Flex, Img } from '@chakra-ui/react'

const CheckoutHeader = () => {
  return (
    <Flex
      p={{ base: '20px 100px', md: '20px 120px' }}
      boxShadow="inset 0 -1px 0 #eae8e4"
      justifyContent="center"
    >
      <NextLink href="/">
        <Img
          cursor="pointer"
          w="100px"
          src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/icone-chaes.svg"
        />
      </NextLink>
    </Flex>
  )
}

export default CheckoutHeader
