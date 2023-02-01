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
  Checkbox,
  Button
} from '@chakra-ui/react'

const ProductOrderFilter = ({ isOpen, onClose, btnRef }) => {
  const { push, query, pathname } = useRouter()

  const [selectedFilters, setSelectedFilters] = useState([
    {
      active: false,
      title: 'compraFim',
      value: ''
    },
    {
      active: false,
      title: 'compraInicio',
      value: ''
    },
    {
      active: false,
      title: 'fornecedor',
      value: ''
    },
    {
      active: false,
      title: 'marca',
      value: ''
    },
    {
      active: false,
      title: 'pedidoId',
      value: ''
    },
    {
      active: false,
      title: 'produtoId',
      value: ''
    },
    {
      active: false,
      title: 'produtoNome',
      value: ''
    },
    {
      active: false,
      title: 'skuId',
      value: ''
    },
    {
      active: false,
      title: 'skuRef',
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
        newArrFilters[index].active = true
        newArrFilters[index].value = newQuery[item] as string
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
      pathname: '/admin/pedido_produtos',
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
            <Stack>
              <Checkbox
                isChecked={selectedFilters[0].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[0].active = !newArr[0].active

                  setSelectedFilters(newArr)
                }}
              >
                Data Compra Fim
              </Checkbox>
              <Input
                disabled={!selectedFilters[0].active}
                value={selectedFilters[0].value}
                type="date"
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[0].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[1].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[1].active = !newArr[1].active

                  setSelectedFilters(newArr)
                }}
              >
                Data Compra Início
              </Checkbox>
              <Input
                type="date"
                value={selectedFilters[1].value}
                disabled={!selectedFilters[1].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[1].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[2].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[2].active = !newArr[2].active

                  setSelectedFilters(newArr)
                }}
              >
                Fornecedor
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
                Marca
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
                isChecked={selectedFilters[4].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[4].active = !newArr[4].active

                  setSelectedFilters(newArr)
                }}
              >
                Código do Pedido
              </Checkbox>
              <Input
                value={selectedFilters[4].value}
                disabled={!selectedFilters[4].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[4].value = e.target.value

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

                  setSelectedFilters(newArr)
                }}
              >
                Código do Produto
              </Checkbox>
              <Input
                value={selectedFilters[5].value}
                disabled={!selectedFilters[5].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[5].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[6].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[6].active = !newArr[6].active

                  setSelectedFilters(newArr)
                }}
              >
                Produto Nome
              </Checkbox>
              <Input
                value={selectedFilters[6].value}
                disabled={!selectedFilters[6].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[6].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[7].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].active = !newArr[7].active

                  setSelectedFilters(newArr)
                }}
              >
                Código Sku
              </Checkbox>
              <Input
                value={selectedFilters[7].value}
                disabled={!selectedFilters[7].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              />
            </Stack>

            <Stack>
              <Checkbox
                isChecked={selectedFilters[7].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].active = !newArr[7].active

                  setSelectedFilters(newArr)
                }}
              >
                Referência Sku
              </Checkbox>
              <Input
                value={selectedFilters[7].value}
                disabled={!selectedFilters[7].active}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].value = e.target.value

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

export default ProductOrderFilter
