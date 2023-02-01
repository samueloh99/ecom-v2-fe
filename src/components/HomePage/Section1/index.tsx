import React from 'react'

import NextImage from 'next/image'

import { Img, Flex, useBreakpointValue } from '@chakra-ui/react'

export const Section1 = () => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })
  return (
    <Flex w="100%" justify="center" draggable={false}>
      {isMobile ? (
        <NextImage
          alt="frete"
          draggable={false}
          width="640px"
          height="500px"
          src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_frete_mobile.jpg"
        />
      ) : (
        <NextImage
          alt="frete"
          draggable={false}
          width="1920px"
          height="200px"
          src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_frete.jpg"
        />
      )}
    </Flex>
  )
}

export default Section1
