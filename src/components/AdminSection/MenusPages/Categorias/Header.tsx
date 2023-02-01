import React, { useState } from 'react'

import { useRouter } from 'next/router'

import NextLink from 'next/link'

import {
  Box,
  Button,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Text,
  HStack,
  VStack
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

import { RiAddLine } from 'react-icons/ri'
import { api } from '../../../../services/apiClient'

type IResponse = {
  nome: string
  added: boolean
}

const Header = () => {
  const { back, query } = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [validation, setValidation] = useState(false)

  const [response, setResponse] = useState<IResponse[]>()

  const parentId = query['parentCategory'] as string

  const handleClickSendCategories = async () => {
    await api
      .post('/categorias/bling/categories_bulk')
      .then(res => {
        setValidation(true)
        onClose()
        setResponse(res.data)
      })
      .catch(err => {
        return toast({
          title: 'Erro',
          description: 'Não foi possível enviar as categorias.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      })
  }
  return (
    <Box>
      {parentId && (
        <Button
          as="a"
          size="sm"
          fontSize="sm"
          mr="5"
          colorScheme="pink"
          onClick={() => back()}
        >
          <Icon as={IoMdArrowRoundBack} />
          Voltar
        </Button>
      )}
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        mr="5"
        onClick={onOpen}
      >
        Enviar Bling
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {validation ? 'Categorias Enviado' : 'Envio Bling ERP'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {validation === false &&
                '  Deseja exportar todas as categorias para a Bling ERP ?'}
              <VStack>
                {response &&
                  response.map(item => {
                    return (
                      <HStack>
                        <Text>{item.nome}</Text>
                        <Text>
                          {item.added ? 'Adicionado' : 'Já cadastrado.'}
                        </Text>
                      </HStack>
                    )
                  })}
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Não
              </Button>
              <Button
                colorScheme="green"
                onClick={handleClickSendCategories}
                ml={3}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <NextLink href="/admin/categorias/adicionar" passHref>
        <Button
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          leftIcon={<Icon as={RiAddLine} />}
          mr="5"
        >
          Adicionar
        </Button>
      </NextLink>
    </Box>
  )
}

export default Header
