import React, { useRef, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Badge,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Wrap,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Checkbox
} from '@chakra-ui/react'

import { GrFilter } from 'react-icons/gr'
import { IoMdCloseCircle } from 'react-icons/io'

import { translateFilter } from '../../../utils/masks'

interface FilterCategoryDTO {
  produtos: {
    produto_id: number
    sku_id: number
    nome: string
    var1: {
      nome: string
      foto: string
    }[]
    var2: {
      nome: string
      foto: string
    }[]
    preco_original: number
    preco_desconto: number
    total_pedidos: number
    created_at: Date
    updated_at: Date
    foto1: string
    foto2: string
    categoria: string
  }[]
  filters: {
    mainFilter: string
    variacoes1: {
      name: string
      checked: boolean
    }[]
    variacoes2: {
      name: string
      checked: boolean
    }[]
    categorias: {
      name: string
      checked: boolean
    }[]
  }
  setFilters: (props: {
    mainFilter: string
    variacoes1: {
      name: string
      checked: boolean
    }[]
    variacoes2: {
      name: string
      checked: boolean
    }[]
    categorias: {
      name: string
      checked: boolean
    }[]
  }) => void
}

const GeneralSearchFiltersMobile = ({
  produtos,
  filters,
  setFilters
}: FilterCategoryDTO) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const { categorias, mainFilter, variacoes1, variacoes2 } = filters

  const { query, push } = useRouter()

  const [openOnHover, setOpenOnHover] = useState(0)

  const filter1Active = variacoes1.find(item => item.checked)
  const filter2Active = variacoes2.find(item => item.checked)
  const filterCatActive = categorias.find(item => item.checked)

  const checkIfAnyFilterIsActive =
    filter1Active || filter2Active || mainFilter || filterCatActive

  const handleClickMainFilter = (key: string) => {
    setFilters({ ...filters, mainFilter: key })

    push({
      pathname: '/buscar',
      query: {
        b: query['b'],
        v: query['v'] !== undefined ? query['v'] : '',
        o: key
      }
    })
  }

  const handleClickFilter = (index: number, type: string) => {
    if (type === 'var1') {
      let newArr = [...filters.variacoes1]
      newArr[index].checked = !newArr[index].checked
      setFilters({ ...filters, variacoes1: newArr })
    }

    if (type === 'var2') {
      let newArr = [...filters.variacoes2]
      newArr[index].checked = !newArr[index].checked
      setFilters({ ...filters, variacoes2: newArr })
    }

    if (type === 'cat') {
      let newArr = [...filters.categorias]
      newArr[index].checked = !newArr[index].checked
      setFilters({ ...filters, categorias: newArr })
    }

    const findTrueVar1 = filters.variacoes1
      .filter(item => item.checked === true)
      .map(item => item.name)

    const findTrueVar2 = filters.variacoes2
      .filter(item => item.checked === true)
      .map(item => item.name)

    const findTrueCat = filters.categorias
      .filter(item => item.checked === true)
      .map(item => item.name)
      .join('.')

    const filterVariacoes = [...findTrueVar1, ...findTrueVar2].join('.')

    push({
      pathname: `/buscar`,
      query: {
        b: query['b'],
        v: filterVariacoes,
        o: query['o'] !== undefined ? query['o'] : '',
        c: findTrueCat
      }
    })
  }

  const handleClickRemoveFilter = (type: string, name: string) => {
    if (type === 'var1') {
      let newArrVar1 = filters.variacoes1
      const indexVar1 = filters.variacoes1.findIndex(item => item.name === name)
      newArrVar1[indexVar1].checked = !newArrVar1[indexVar1].checked
      setFilters({ ...filters, variacoes1: newArrVar1 })
    }

    if (type === 'var2') {
      let newArrVar2 = filters.variacoes2
      const indexVar2 = filters.variacoes2.findIndex(item => item.name === name)
      newArrVar2[indexVar2].checked = !newArrVar2[indexVar2].checked
      setFilters({ ...filters, variacoes2: newArrVar2 })
    }

    if (type === 'cat') {
      let newArrCat = filters.categorias
      const indexCat = filters.categorias.findIndex(item => item.name === name)
      newArrCat[indexCat].checked = !newArrCat[indexCat].checked
      setFilters({ ...filters, categorias: newArrCat })
    }

    if (type === 'mainFilter') {
      setFilters({ ...filters, mainFilter: '' })

      return push({
        pathname: '/buscar',
        query: {
          b: query['b'],
          v: query['v'],
          o: ''
        }
      })
    }

    const findTrueVar1 = filters.variacoes1
      .filter(item => item.checked === true)
      .map(item => item.name)

    const findTrueVar2 = filters.variacoes2
      .filter(item => item.checked === true)
      .map(item => item.name)

    const findTrueCat = filters.categorias
      .filter(item => item.checked === true)
      .map(item => item.name)
      .join('.')

    const filterVariacoes = [...findTrueVar1, ...findTrueVar2].join('.')

    push({
      pathname: '/buscar',
      query: {
        b: query['b'],
        v: filterVariacoes,
        o: filters.mainFilter,
        c: findTrueCat
      }
    })
  }

  return (
    <Flex direction="column">
      <VStack h="auto" align="start" justify="center">
        <Flex>
          <Text fontSize="12px">FILTROS ATIVOS:</Text>
        </Flex>
        <Wrap direction="row">
          {mainFilter.length > 1 && (
            <Badge colorScheme="green" display="flex" alignItems="center">
              {translateFilter(mainFilter)}
              <Icon
                ml="2"
                cursor="pointer"
                as={IoMdCloseCircle}
                onClick={() =>
                  handleClickRemoveFilter('mainFilter', mainFilter)
                }
              />
            </Badge>
          )}

          {categorias &&
            categorias.map((item, index) => {
              if (item.checked) {
                return (
                  <Badge
                    key={index}
                    colorScheme="green"
                    display="flex"
                    alignItems="center"
                  >
                    {item.name}
                    <Icon
                      ml="2"
                      cursor="pointer"
                      as={IoMdCloseCircle}
                      onClick={() => handleClickRemoveFilter('cat', item.name)}
                    />
                  </Badge>
                )
              }
            })}

          {variacoes1 &&
            variacoes1.map((item, index) => {
              if (item.checked) {
                return (
                  <Badge
                    key={index}
                    colorScheme="green"
                    display="flex"
                    alignItems="center"
                  >
                    {item.name}
                    <Icon
                      ml="2"
                      cursor="pointer"
                      as={IoMdCloseCircle}
                      onClick={() => handleClickRemoveFilter('var1', item.name)}
                    />
                  </Badge>
                )
              }
            })}

          {variacoes2 &&
            variacoes2.map((item, index) => {
              if (item.checked) {
                return (
                  <Badge
                    key={index}
                    colorScheme="green"
                    display="flex"
                    alignItems="center"
                  >
                    {item.name}
                    <Icon
                      ml="2"
                      cursor="pointer"
                      as={IoMdCloseCircle}
                      onClick={() => handleClickRemoveFilter('var2', item.name)}
                    />
                  </Badge>
                )
              }
            })}
        </Wrap>
        {checkIfAnyFilterIsActive && (
          <Flex p="15px 0px">
            <Badge
              onClick={() =>
                push({
                  pathname: '/buscar',
                  query: {
                    b: query['b'],
                    v: '',
                    o: ''
                  }
                })
              }
              colorScheme="gray"
              cursor="pointer"
              alignItems="center"
            >
              LIMPAR FILTRO
            </Badge>
          </Flex>
        )}
      </VStack>

      <VStack h="70px" fontSize="12px" justify="center" align="start">
        <HStack w="100%" justify="space-between">
          <HStack>
            <HStack
              border="1px solid #ccc"
              onClick={onOpen}
              p="5px"
              borderRadius="5px"
            >
              <Text>FILTRAR POR:</Text>
              <Icon as={GrFilter}>Open</Icon>
            </HStack>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />

                <DrawerBody px="0px" my="50px">
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        <AccordionButton _focus={{ border: 'none' }}>
                          <Box fontSize="12px" flex="1" textAlign="left">
                            ORDERNAR POR
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack
                          fontSize="12px"
                          align="start"
                          zIndex={1}
                          bg="white"
                        >
                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() => handleClickMainFilter('best_seller')}
                          >
                            Mais Vendido
                          </Box>
                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() => handleClickMainFilter('newin')}
                          >
                            Lançamentos
                          </Box>
                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() =>
                              handleClickMainFilter('biggest_price')
                            }
                          >
                            Maior Preço
                          </Box>
                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() =>
                              handleClickMainFilter('lowest_price')
                            }
                          >
                            Menor Preço
                          </Box>

                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() => handleClickMainFilter('name')}
                          >
                            Nome
                          </Box>

                          <Box
                            display="flex"
                            w="100%"
                            h="30px"
                            alignItems="center"
                            pl="10px"
                            justifyContent="start"
                            border="1px solid #ccc"
                            onClick={() => handleClickMainFilter('recommends')}
                          >
                            Recomendados
                          </Box>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton _focus={{ border: 'none' }}>
                          <Box fontSize="12px" flex="1" textAlign="left">
                            COR
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack align="start" zIndex={1} bg="white">
                          {variacoes1.map((item, index) => {
                            return (
                              <Checkbox
                                key={index}
                                value={item.name}
                                isChecked={item.checked}
                                onChange={e => handleClickFilter(index, 'var1')}
                                size="sm"
                                colorScheme="gray"
                              >
                                <Text fontSize="12px">{item.name}</Text>
                              </Checkbox>
                            )
                          })}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" fontSize="12px" textAlign="left">
                            TAMANHO
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <VStack align="start" zIndex={1} bg="white">
                          {variacoes2.map((item, index) => {
                            return (
                              <Checkbox
                                key={index}
                                value={item.name}
                                isChecked={item.checked}
                                onChange={e => handleClickFilter(index, 'var2')}
                                size="sm"
                                colorScheme="gray"
                              >
                                <Text fontSize="12px">{item.name}</Text>
                              </Checkbox>
                            )
                          })}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </DrawerBody>

                <DrawerFooter>
                  <Button
                    fontSize="12px"
                    w="100%"
                    variant="outline"
                    mr={3}
                    onClick={onClose}
                  >
                    MOSTRAR OS {produtos.length} PRODUTO(S)
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </HStack>
          <Flex>
            <Text>{produtos.length} PRODUTO(S)</Text>
          </Flex>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default GeneralSearchFiltersMobile
