import React, { useEffect, useRef, useState } from 'react'

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

import { useSkus } from '../../services/hooks/useSkus'
import { translateFilter } from '../../../utils/masks'

interface SkuVarDTO {
  id: number
  name: string
  checked: boolean
}

interface FilterCategoryDTO {
  filter2: string[]
  filter1: string
  setFilter2: (string) => void
  setFilter1: (string) => void
  produtos: number
  variantes: {
    cores: string[]
    tamanhos: string[]
  }
}

const CategoryFiltersMobile = ({
  filter2,
  setFilter2,
  setFilter1,
  filter1,
  variantes,
  produtos
}: FilterCategoryDTO) => {
  const { query, asPath, push } = useRouter()

  const { data: dataSkus } = useSkus('', 1, 99999999999)

  const [var1, setVar1] = useState<SkuVarDTO[]>([])
  const [var2, setVar2] = useState<SkuVarDTO[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const checkAnyFilter = filter1.length > 0 || filter2.length > 0
  const filter1Query = query.o === undefined ? '' : query.o
  const filter2Query = query.v === undefined ? '' : (query.v as string)
  let categoryNameQuery = query.slug === undefined ? '' : query.slug

  useEffect(() => {
    if (dataSkus) {
      const queryVSplited = filter2Query.split('.')

      const var1Formatted: SkuVarDTO[] = variantes.cores.map((item, index) => {
        if (queryVSplited.includes(item)) {
          return {
            id: index,
            name: item,
            checked: true
          }
        }
        return {
          id: index,
          name: item,
          checked: false
        }
      })

      setVar1(var1Formatted)

      const var2Formatted: SkuVarDTO[] = variantes.tamanhos.map(
        (item, index) => {
          if (queryVSplited.includes(item)) {
            return {
              id: index,
              name: item,
              checked: true
            }
          }
          return {
            id: index,
            name: item,
            checked: false
          }
        }
      )

      setVar2(var2Formatted)
    }
  }, [dataSkus, asPath])

  useEffect(() => {
    if (filter1Query === '' && filter2Query === '' && var1.length > 0) {
      setVar1(
        var1.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      )

      setVar2(
        var2.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      )
    }
  }, [query])

  const onChangeCheckbox = (id: number, type: string) => {
    if (type === 'var1') {
      const newArr = var1
      newArr[id].checked = !newArr[id].checked
      setVar1(newArr)
    }
    if (type === 'var2') {
      const newArr = var2
      newArr[id].checked = !newArr[id].checked
      setVar2(newArr)
    }
    const findTrueVar1 = var1.filter(item => item.checked === true)
    const findTrueVar2 = var2.filter(item => item.checked === true)

    const concatFilter2 = [
      ...findTrueVar1.map(item => item.name),
      ...findTrueVar2.map(item => item.name)
    ]

    setFilter2(concatFilter2)

    push(
      {
        pathname: `/categoria/${query.pid}/${categoryNameQuery}`,
        query: { o: filter1Query, v: concatFilter2.join('.') }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  const handleRemoveFilter = (type: string, index: string) => {
    if (type === 'filtro1') {
      push(
        {
          pathname: `/categoria/${query.pid}/${categoryNameQuery}`,
          query: { o: '', v: filter2Query }
        },
        undefined,
        {
          shallow: true
        }
      )
      return setFilter1('')
    }

    const indexObjVar1 = var1.findIndex(item => item.name === index)
    const indexObjVar2 = var2.findIndex(item => item.name === index)

    if (indexObjVar1 !== -1) {
      let newArrVar1 = [...var1]
      newArrVar1[indexObjVar1].checked = false
      setVar1(newArrVar1)
      let newArrFilter2 = [...filter2]
      newArrFilter2 = filter2.filter(item => item !== index)
      setFilter2(newArrFilter2)
      return push({
        pathname: `/categoria/${query.pid}/${categoryNameQuery}`,
        query: { o: filter1Query, v: newArrFilter2.join('.') }
      })
    }

    if (indexObjVar2 !== -1) {
      let newArrVar2 = [...var2]
      newArrVar2[indexObjVar2].checked = false
      setVar2(newArrVar2)
      let newArrFilter2 = [...filter2]
      newArrFilter2 = filter2.filter(item => item !== index)
      setFilter2(newArrFilter2)
      return push(
        {
          pathname: `/categoria/${query.pid}/${categoryNameQuery}`,
          query: { o: filter1Query, v: newArrFilter2.join('.') }
        },
        undefined,
        {
          shallow: true
        }
      )
    }
  }

  const onClickFilter = (name: string) => {
    if (name === '0') {
      return 0
    }
    setFilter1(name)

    push(
      {
        pathname: `/categoria/${query.pid}/${categoryNameQuery}`,
        query: { v: filter2Query, o: name }
      },
      undefined,
      {
        shallow: true
      }
    )

    onClose()
  }

  return (
    <Flex direction="column">
      <VStack h="auto" align="start" justify="center">
        <Flex>
          <Text fontSize="12px">FILTROS ATIVOS:</Text>
        </Flex>
        <Wrap direction="row">
          {filter1 && (
            <Badge colorScheme="green" display="flex" alignItems="center">
              <Text>{translateFilter(filter1)}</Text>

              <Icon
                ml="2"
                cursor="pointer"
                as={IoMdCloseCircle}
                onClick={() => handleRemoveFilter('filtro1', '')}
              />
            </Badge>
          )}
          {filter2.length !== 0 &&
            filter2[0].length > 0 &&
            filter2.map((item, index) => {
              return (
                <Badge
                  key={index}
                  colorScheme="green"
                  display="flex"
                  alignItems="center"
                >
                  <Text>{item}</Text>

                  <Icon
                    ml="2"
                    cursor="pointer"
                    as={IoMdCloseCircle}
                    onClick={() => handleRemoveFilter('filtro2', item)}
                  />
                </Badge>
              )
            })}
        </Wrap>
        {checkAnyFilter && (
          <Flex p="15px 0px">
            <Badge
              onClick={() =>
                push({
                  pathname: `/categoria/${query.pid}/${categoryNameQuery}`
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
                            onClick={() => onClickFilter('best_seller')}
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
                            onClick={() => onClickFilter('newin')}
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
                            onClick={() => onClickFilter('biggest_price')}
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
                            onClick={() => onClickFilter('lowest_price')}
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
                            onClick={() => onClickFilter('name')}
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
                            onClick={() => onClickFilter('recommends')}
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
                          {var1.length > 0 &&
                            var1.map((item, index) => {
                              return (
                                <Checkbox
                                  key={index}
                                  size="sm"
                                  colorScheme="gray"
                                  value={`${item.id}`}
                                  isChecked={item.checked}
                                  onChange={e =>
                                    onChangeCheckbox(index, 'var1')
                                  }
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
                          {var2.length > 0 &&
                            var2.map((item, index) => {
                              return (
                                <Checkbox
                                  key={index}
                                  size="sm"
                                  colorScheme="gray"
                                  value={`${item.id}`}
                                  isChecked={item.checked}
                                  onChange={e =>
                                    onChangeCheckbox(index, 'var2')
                                  }
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
                    MOSTRAR OS {produtos} PRODUTO(S)
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </HStack>
          <Flex>
            <Text>{produtos} PRODUTO(S)</Text>
          </Flex>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default CategoryFiltersMobile
