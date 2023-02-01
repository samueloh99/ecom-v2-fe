import React, { useState } from 'react'

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

const GeneralSearchFilters = ({
  produtos,
  filters,
  setFilters
}: FilterCategoryDTO) => {
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
      <HStack h="40px" align="center" justify="start">
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
            onChange={e => handleClickMainFilter(e.target.value)}
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
              )}
            </Flex>

            <Flex
              position="relative"
              onMouseEnter={() => setOpenOnHover(3)}
              onMouseLeave={() => setOpenOnHover(0)}
            >
              <HStack border="1px solid transparent">
                <Text>Categorias</Text>
                <Icon fontSize={15} as={RiArrowDownSFill} />
              </HStack>
              {openOnHover === 3 && (
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
                  {categorias.map((item, index) => {
                    return (
                      <Checkbox
                        key={index}
                        value={item.name}
                        isChecked={item.checked}
                        onChange={e => handleClickFilter(index, 'cat')}
                        size="sm"
                        colorScheme="gray"
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
            <Text>{produtos.length} PRODUTO(S)</Text>
          </Flex>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default GeneralSearchFilters
