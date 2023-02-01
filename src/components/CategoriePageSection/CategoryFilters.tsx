import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Badge,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Icon,
  Select,
  Text,
  VStack,
  Wrap
} from '@chakra-ui/react'

import { RiArrowDownSFill } from 'react-icons/ri'
import { IoMdCloseCircle } from 'react-icons/io'
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

const CategoryFilters = ({
  filter2,
  setFilter2,
  setFilter1,
  filter1,
  produtos,
  variantes
}: FilterCategoryDTO) => {
  const { query, asPath, push } = useRouter()

  const [var1, setVar1] = useState<SkuVarDTO[]>([])
  const [var2, setVar2] = useState<SkuVarDTO[]>([])
  const [openOnHover, setOpenOnHover] = useState(0)

  const checkAnyFilter = filter1.length > 0 || filter2.length > 0
  const filter1Query = query.o === undefined ? '' : query.o
  const filter2Query = query.v === undefined ? '' : (query.v as string)
  let categoryNameQuery = query.slug === undefined ? '' : query.slug

  useEffect(() => {
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

    const var2Formatted: SkuVarDTO[] = variantes.tamanhos.map((item, index) => {
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

    setVar2(var2Formatted)
  }, [useRouter().asPath])

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
  }, [asPath])

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
  }

  return (
    <Flex direction="column">
      <HStack h="40px" align="center" justify="start">
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
      </HStack>

      <VStack h="70px" fontSize="12px" justify="center" align="start">
        <HStack>
          <Flex w="130px">
            <Text>ORDENAR POR:</Text>
          </Flex>
          <Select
            fontSize="12px"
            p="0 !important"
            h="20px"
            w="auto"
            icon={<RiArrowDownSFill fontSize="15px" />}
            border="none"
            _focus={{ border: 'none' }}
            onChange={e => onClickFilter(e.target.value)}
          >
            <option value="0">Selecionar</option>
            <option value="newin">Lançamentos</option>
            <option value="best_seller">Mais Vendidos</option>
            <option value="biggest_price">Maior Preço</option>
            <option value="lowest_price">Menor Preço</option>
            <option value="name">Nome</option>
            <option value="recommends">Recomendados</option>
          </Select>
        </HStack>
        <Divider />
        <HStack w="100%" justify="space-between">
          <HStack>
            <Flex w="130px">
              <Text>FILTRAR POR:</Text>
            </Flex>
            <Flex
              position="relative"
              onMouseEnter={() => setOpenOnHover(1)}
              onMouseLeave={() => setOpenOnHover(0)}
            >
              <HStack border="1px solid transparent">
                <Text>Cor</Text>
                <Icon fontSize={15} as={RiArrowDownSFill} />
              </HStack>
              {openOnHover === 1 && (
                <VStack
                  border="1px solid #ccc"
                  align="start"
                  position="absolute"
                  top="20px"
                  zIndex={1}
                  bg="white"
                  left="-10px"
                  p="10px"
                  py="15px"
                  w="200px"
                >
                  {var1.length > 0 &&
                    var1.map((item, index) => {
                      return (
                        <Checkbox
                          key={index}
                          size="sm"
                          colorScheme="gray"
                          value={`${item.id}`}
                          isChecked={item.checked}
                          onChange={e => onChangeCheckbox(index, 'var1')}
                        >
                          <Text fontSize="12px">{item.name}</Text>
                        </Checkbox>
                      )
                    })}
                </VStack>
              )}
            </Flex>

            <Flex
              position="relative"
              onMouseEnter={() => setOpenOnHover(2)}
              onMouseLeave={() => setOpenOnHover(0)}
            >
              <HStack border="1px solid transparent">
                <Text>Tamanho</Text>
                <Icon fontSize={15} as={RiArrowDownSFill} />
              </HStack>
              {openOnHover === 2 && (
                <VStack
                  border="1px solid #ccc"
                  align="start"
                  position="absolute"
                  top="20px"
                  zIndex={1}
                  bg="white"
                  left="-10px"
                  p="10px"
                  py="15px"
                  w="200px"
                >
                  {var2.length > 0 &&
                    var2.map((item, index) => {
                      return (
                        <Checkbox
                          key={index}
                          size="sm"
                          colorScheme="gray"
                          value={`${item.id}`}
                          isChecked={item.checked}
                          onChange={e => onChangeCheckbox(index, 'var2')}
                        >
                          <Text fontSize="12px">{item.name}</Text>
                        </Checkbox>
                      )
                    })}
                </VStack>
              )}
            </Flex>
          </HStack>
          <Flex>
            <Text>{produtos} PRODUTO(S)</Text>
          </Flex>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default CategoryFilters
