import React, { useRef, useState } from 'react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  VStack,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react'

import { BsArrowDown } from 'react-icons/bs'
import { RiAddLine } from 'react-icons/ri'

import ProductFilter from '../../FilterDrawer/ProductFilter'
import { api } from '../../../../services/apiClient'
import { useAuthContext } from '../../../../contexts/AuthContext'

type IResponse = {
  failed: number
  sended: number
  sended_queues: {
    codigo: string
    descricao: string
    descricaoCurta: string
    descricaoComplementar: string
    un: string
    vlr_unit: number
    preco_custo: number
    peso_bruto: number
    peso_liq: number
    origem: string
    marca: string
    largura: string
    altura: string
    profundidade: string
    unidadeMedida: string
    idCategoria: number
    variacoes: {
      variacao: {
        nome: string
        codigo: string
        vlr_unit: number
        clonarDadosPai: string
        deposito: {
          id: number
          estoque: number
        }
      }
    }
    urlVideo: string
  }[]
  failed_queues: {
    id: number
    var1fk: {}
    var2fk: {}
    referencia: string
    preco_venda: number
    produto: {}
    estoque: number
    foto1: string
  }[]
}

const Header = () => {
  const { push } = useRouter()
  const toast = useToast()
  const { userData } = useAuthContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert
  } = useDisclosure()
  const btnRef = useRef()
  const cancelRef = useRef()

  const [validation, setValidation] = useState(false)

  const [response, setResponse] = useState<IResponse>()

  const handleClickSendProducts = async () => {
    onCloseAlert()

    await api
      .post('/produtos/bling')
      .then(res => {
        if (res.data) {
          setValidation(true)
          onOpenAlert()

          setResponse(res.data)
        }
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

  const isRootUser = userData && userData.roles.includes('root')
  return (
    <Box>
      {isRootUser && (
        <Button
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          mr="5"
          onClick={onOpenAlert}
        >
          Enviar Bling
        </Button>
      )}
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {validation ? 'Produtos Enviado' : 'Envio Bling ERP'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {validation === false &&
                '  Deseja exportar todas os Produtos para a Bling ERP mesmo ?'}
              {response && (
                <VStack>
                  <HStack>
                    <Text>Failed: {response.failed}</Text>
                    <Text>Sended: {response.sended}</Text>
                  </HStack>
                </VStack>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                {response ? 'Fechar' : 'Não'}
              </Button>
              {!response && (
                <Button
                  colorScheme="green"
                  onClick={handleClickSendProducts}
                  ml={3}
                >
                  Sim
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Menu flip={false}>
        <MenuButton
          colorScheme="pink"
          as={Button}
          size="sm"
          rightIcon={<BsArrowDown />}
          mr="5"
        >
          Adicionar
        </MenuButton>
        <MenuList bg="#D63F8C" border="none">
          <NextLink href="/admin/produtos/adicionar/produto-tipo_id=1">
            <MenuItem
              bg="#D63F8C"
              _hover={{ bg: '#97276D' }}
              _focus={{ bg: 'none' }}
            >
              Produto Físico
            </MenuItem>
          </NextLink>
          <NextLink href="/admin/produtos/adicionar/produto-tipo_id=2">
            <MenuItem bg="#D63F8C" _hover={{ bg: '#97276D' }}>
              Vale Presente
            </MenuItem>
          </NextLink>

          <NextLink href="/admin/produtos/adicionar/produto-tipo_id=3">
            <MenuItem bg="#D63F8C" _hover={{ bg: '#97276D' }}>
              Ingresso
            </MenuItem>
          </NextLink>

          <NextLink href="/admin/produtos/adicionar/produto-tipo_id=4">
            <MenuItem bg="#D63F8C" _hover={{ bg: '#97276D' }}>
              Embalagem de Presente
            </MenuItem>
          </NextLink>
        </MenuList>
      </Menu>
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} />}
        mr="5"
      >
        Exportar
      </Button>
      <Button
        ref={btnRef}
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        mr="5"
        onClick={onOpen}
      >
        Filtros
      </Button>
      {isRootUser && (
        <Button
          ref={btnRef}
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          mr="5"
          onClick={() => {
            push({
              pathname: '/admin/produtos_descricao_bulk'
            })
          }}
        >
          Adicionar Descricao em Massa
        </Button>
      )}
      <ProductFilter isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  )
}

export default Header
