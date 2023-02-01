import React from 'react'

import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Img,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'

const ProductSizeGuide = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Flex my="20px">
      <Button
        w="auto"
        bg="transparent"
        textTransform="uppercase"
        fontWeight="light"
        color="black"
        fontSize={{ base: '14px', lg: '16px' }}
        _focus={{ border: 'none' }}
        _hover={{ bg: 'transparent' }}
        textDecoration="underline"
        onClick={onOpen}
        p="0"
      >
        Ver Tabela de Medidas
      </Button>

      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tabela de Medidas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Img src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/tabela_de_medida_chaes.jpg" />
          </ModalBody>

          <ModalFooter>
            <Button bg="black" color="white" mr={3} onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default ProductSizeGuide
