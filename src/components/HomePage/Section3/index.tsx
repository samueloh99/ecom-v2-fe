import React from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import { Img, Box, SimpleGrid } from '@chakra-ui/react'

const banners = [
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_blusa.jpg',
    id: '2'
  },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_macacao.jpg',
    id: '7'
  },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_conjunto.jpg',
    id: '5'
  },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_vestido.jpg',
    id: '12'
  }
]

export const Section3 = () => {
  const { push } = useRouter()
  return (
    <SimpleGrid
      w={{ base: '100%', lg: '1200px' }}
      m="20px auto"
      p="5px"
      columns={2}
      spacing={2}
    >
      {banners.map((item, index) => {
        return (
          <Box
            m="auto"
            w="auto"
            key={index}
            cursor="pointer"
            onClick={() => push({ pathname: `/categoria/${item.id}` })}
          >
            <NextImage
              src={item.src}
              alt="banner"
              width="640px"
              height="640px"
            />
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default Section3
