import React from 'react'

import NextImage from 'next/image'

import { Text, Flex, useMediaQuery, VStack } from '@chakra-ui/react'

export const Sobre = () => {
  const [isMobile] = useMediaQuery('(max-width: 500px)')

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      alignItems="start"
      justifyContent="start"
      draggable={false}
    >
      {isMobile ? (
        <Flex position="relative">
          <NextImage
            draggable={false}
            alt="banner-sobrenos-desktop"
            src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/institucional_mobile_sobrenos.jpg"
            height="640px"
            width="500px"
          />
        </Flex>
      ) : (
        <Flex position="relative">
          <NextImage
            draggable={false}
            alt="banner-sobrenos-desktop"
            src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/institucional_desktop_sobrenos.jpg"
            width="1920px"
            height="500px"
          />
        </Flex>
      )}
      <Flex h="100%" direction="column" textAlign="center">
        <Flex justify="center" textAlign="center">
          <Text
            letterSpacing={{ base: 15, md: 20 }}
            mb="10px"
            fontSize={{ base: '40px', md: '50px' }}
            fontWeight="light"
          >
            CHAE'S
          </Text>
        </Flex>
        <VStack
          p={{ base: '0px 70px', md: '0px 200px' }}
          fontSize={{ base: '14px', md: '16px' }}
        >
          <Text>
            Nossa marca busca leveza e praticidade. Queremos que você se sinta
            bem sendo você mesma, por isso escolhemos tendências que enaltecem
            isso.
          </Text>
          <Text>
            Viemos para ser a calmaria em meio a correria do dia a dia, assim
            como o vento suavea beira-mar. Feito para mulheres que buscam se
            vestir com conforto e suavidade sem deixar de lado o estilo.
          </Text>
        </VStack>
        <Flex mt="5px" justify="center">
          <Text
            fontSize={{ base: '40px', md: '60px' }}
            fontStyle="italic"
            fontWeight="200"
          >
            #usechaes
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Sobre
