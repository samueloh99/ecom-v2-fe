import React, { useState } from 'react'

import NextImage from 'next/image'
import NextLink from 'next/link'

import { Icon, Flex, useBreakpointValue } from '@chakra-ui/react'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { GoPrimitiveDot } from 'react-icons/go'

type IRequest = {
  images: {
    src: string
    href: string
  }[]
}

const Carousel = ({ images }: IRequest) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClickNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1

    setCurrentIndex(newIndex)
  }

  const handleClickBack = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1

    setCurrentIndex(newIndex)
  }

  const handleClickGoToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })

  return (
    <Flex
      maxH={{ base: '940px', lg: '900px' }}
      h="100%"
      position="relative"
      justifyContent="center"
      alignItems="center"
      maxW="100%"
      w="100%"
    >
      <Flex
        position="absolute"
        top="50%"
        left="0px"
        draggable={false}
        zIndex={1}
      >
        <Icon
          as={IoIosArrowBack}
          color="black"
          fontSize={60}
          onClick={() => handleClickBack()}
        />
      </Flex>

      <Flex
        draggable={false}
        position="absolute"
        top="50%"
        right="0"
        zIndex={1}
      >
        <Icon
          fontSize={60}
          color="black"
          as={IoIosArrowForward}
          onClick={() => handleClickNext()}
        />
      </Flex>
      {isMobile
        ? images.map((item, index) => {
            const isInIndex = index === currentIndex
            return (
              <NextLink key={index} href={item.href}>
                <Flex
                  opacity={isInIndex ? 1 : 0}
                  transitionDuration={isInIndex ? '1s' : '1s ease'}
                  draggable={false}
                  position="relative"
                >
                  {isInIndex && (
                    <NextImage
                      src={item.src}
                      width="640px"
                      height="940px"
                      alt={`image${index}`}
                      draggable={false}
                    />
                  )}
                </Flex>
              </NextLink>
            )
          })
        : images.map((item, index) => {
            const isInIndex = index === currentIndex
            return (
              <NextLink key={index} href={item.href}>
                <Flex
                  cursor="pointer"
                  opacity={isInIndex ? 1 : 0}
                  transitionDuration={isInIndex ? '1s' : '1s ease'}
                  draggable={false}
                  position="relative"
                  key={index}
                >
                  {isInIndex && (
                    <NextImage
                      src={item.src}
                      width="1920px"
                      height="900px"
                      alt={`image${index}`}
                      draggable={false}
                    />
                  )}
                </Flex>
              </NextLink>
            )
          })}
      <Flex
        w="100%"
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        m="auto"
        justifyContent="center"
      >
        {images.map((item, index) => {
          const isInIndex = index === currentIndex
          return (
            <Icon
              cursor="pointer"
              key={index}
              as={GoPrimitiveDot}
              fontSize={30}
              color={isInIndex ? 'black' : 'white'}
              onClick={() => handleClickGoToImage(index)}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Carousel
