import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Stack,
  Select,
  Checkbox,
  Button,
  HStack
} from '@chakra-ui/react'

const SkusFilter = ({ isOpen, onClose, btnRef }) => {
  const { push, query, pathname } = useRouter()

  const [selectedFilters, setSelectedFilters] = useState([
    {
      active: false,
      title: 'ativos',
      value: '0'
    },
    {
      active: false,
      title: 'inativos',
      value: '0'
    },
    {
      active: false,
      title: 'skuCodigo',
      value: ''
    },
    {
      active: false,
      title: 'skuReferencia',
      value: ''
    },
    {
      active: false,
      title: 'precoVendaOp',
      value: ''
    },
    {
      active: false,
      title: 'precoVenda',
      value: ''
    },
    {
      active: false,
      title: 'estoqueOp',
      value: ''
    },
    {
      active: false,
      title: 'estoque',
      value: ''
    },

    {
      active: false,
      title: 'produtoNome',
      value: ''
    },
    {
      active: false,
      title: 'produtoCodigo',
      value: ''
    },
    {
      active: false,
      title: 'produtoReferencia',
      value: ''
    },
    {
      active: false,
      title: 'produtoMarca',
      value: ''
    },
    {
      active: false,
      title: 'categoria',
      value: ''
    }
  ])

  useEffect(() => {
    let newQuery = query
    delete newQuery['slug']

    let newArrFilters = selectedFilters

    if (Object.keys(newQuery).length > 0) {
      Object.keys(newQuery).map(item => {
        const index = newArrFilters.findIndex(filter => filter.title === item)
        if (
          newArrFilters[index].title === 'ativo' ||
          newArrFilters[index].title === 'inativo'
        ) {
          newArrFilters[index].active = true
        } else {
          newArrFilters[index].active = true
          newArrFilters[index].value = newQuery[item] as string
        }
        setSelectedFilters(newArrFilters)
      })
    }
  }, [query, pathname])

  const handleApplyFilters = () => {
    let filtersToApply = selectedFilters.filter(item => item.active === true)
    filtersToApply.forEach(item => {
      delete item['active']
    })

    const newData = Object.assign(
      {},
      ...filtersToApply.map(item => {
        return {
          [item.title]: item.value
        }
      })
    )

    push({
      pathname: '/admin/skus',
      query: newData
    })
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent bg="#303C63" color="white">
        <DrawerCloseButton />
        <DrawerHeader>Filtros</DrawerHeader>

        <DrawerBody>
          <Stack>
            <HStack>
              <Checkbox
                isChecked={selectedFilters[0].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[0].active = !newArr[0].active

                  setSelectedFilters(newArr)
                }}
              >
                Ativo
              </Checkbox>
              <Checkbox
                isChecked={selectedFilters[1].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[1].active = !newArr[1].active

                  setSelectedFilters(newArr)
                }}
              >
                Inativo
              </Checkbox>
            </HStack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[2].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[2].active = !newArr[2].active

                  setSelectedFilters(newArr)
                }}
              >
                Sku Código
              </Checkbox>
              <Input
                value={selectedFilters[2].value}
                disabled={!selectedFilters[2].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[2].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[3].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[3].active = !newArr[3].active

                  setSelectedFilters(newArr)
                }}
              >
                Sku Referência
              </Checkbox>
              <Input
                value={selectedFilters[3].value}
                disabled={!selectedFilters[3].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[3].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[5].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[5].active = !newArr[5].active
                  newArr[4].active = !newArr[4].active

                  setSelectedFilters(newArr)
                }}
              >
                Preco Venda
              </Checkbox>
              <HStack>
                <Select
                  disabled={!selectedFilters[4].active}
                  value={selectedFilters[4].value}
                  onChange={e => {
                    let newArr = [...selectedFilters]
                    newArr[4].value = e.target.value

                    setSelectedFilters(newArr)
                  }}
                >
                  <option value="0">Igual</option>
                  <option value="1">Maior Igual</option>
                  <option value="2">Menor Igual</option>
                </Select>
                <Input
                  value={selectedFilters[5].value}
                  disabled={!selectedFilters[5].active}
                  onChange={e => {
                    let newArr = [...selectedFilters]
                    newArr[5].value = e.target.value

                    setSelectedFilters(newArr)
                  }}
                />
              </HStack>
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[7].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].active = !newArr[7].active
                  newArr[6].active = !newArr[6].active

                  setSelectedFilters(newArr)
                }}
              >
                Estoque
              </Checkbox>
              <HStack>
                <Select
                  disabled={!selectedFilters[6].active}
                  value={selectedFilters[6].value}
                  onChange={e => {
                    let newArr = [...selectedFilters]
                    newArr[6].value = e.target.value

                    setSelectedFilters(newArr)
                  }}
                >
                  <option value="0">Igual</option>
                  <option value="1">Maior Igual</option>
                  <option value="2">Menor Igual</option>
                </Select>
                <Input
                  value={selectedFilters[7].value}
                  disabled={!selectedFilters[7].active}
                  onChange={e => {
                    let newArr = [...selectedFilters]
                    newArr[7].value = e.target.value

                    setSelectedFilters(newArr)
                  }}
                />
              </HStack>
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[8].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[8].active = !newArr[8].active

                  setSelectedFilters(newArr)
                }}
              >
                Produto Nome
              </Checkbox>
              <Input
                value={selectedFilters[8].value}
                disabled={!selectedFilters[8].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[8].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[9].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[9].active = !newArr[9].active

                  setSelectedFilters(newArr)
                }}
              >
                Produto Código
              </Checkbox>
              <Input
                value={selectedFilters[9].value}
                disabled={!selectedFilters[9].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[9].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[10].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[10].active = !newArr[10].active

                  setSelectedFilters(newArr)
                }}
              >
                Produto Referência
              </Checkbox>
              <Input
                value={selectedFilters[10].value}
                disabled={!selectedFilters[10].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[10].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[11].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[11].active = !newArr[11].active

                  setSelectedFilters(newArr)
                }}
              >
                Produto Marca
              </Checkbox>
              <Input
                value={selectedFilters[11].value}
                disabled={!selectedFilters[11].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[11].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[12].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[12].active = !newArr[12].active

                  setSelectedFilters(newArr)
                }}
              >
                Categoria
              </Checkbox>
              <Input
                value={selectedFilters[12].value}
                disabled={!selectedFilters[12].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[12].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => (handleApplyFilters(), onClose())}
          >
            Filtrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default SkusFilter
