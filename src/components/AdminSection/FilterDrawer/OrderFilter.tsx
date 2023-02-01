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
  Button
} from '@chakra-ui/react'

import { cepMask } from '../../../../utils/masks'

const OrderFilter = ({ isOpen, onClose, btnRef }) => {
  const { push, query, pathname } = useRouter()

  const [selectedFilters, setSelectedFilters] = useState([
    {
      active: false,
      title: 'clienteNome',
      value: ''
    },
    {
      active: false,
      title: 'clienteId',
      value: ''
    },
    {
      active: false,
      title: 'clienteEmail',
      value: ''
    },
    {
      active: false,
      title: 'clienteGenero',
      value: 'Masculino'
    },
    {
      active: false,
      title: 'cep',
      value: ''
    },
    {
      active: false,
      title: 'estado',
      value: ''
    },

    {
      active: false,
      title: 'pedidoId',
      value: ''
    },

    {
      active: false,
      title: 'temDesconto',
      value: 'Nao'
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
      pathname: '/admin/pedidos',
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
                Cliente Nome
              </Checkbox>
              <Input
                disabled={!selectedFilters[0].active}
                value={selectedFilters[0].value}
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
                Codigo Cliente
              </Checkbox>
              <Input
                type="number"
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
                Cliente Email
              </Checkbox>
              <Input
                disabled={!selectedFilters[2].active}
                value={selectedFilters[2].value}
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
                Cliente Genero
              </Checkbox>
              <Select
                disabled={!selectedFilters[3].active}
                value={selectedFilters[3].value}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[3].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              >
                <option style={{ color: 'black' }} value="Masculino">
                  Masculino
                </option>
                <option style={{ color: 'black' }} value="Feminino">
                  Feminino
                </option>
              </Select>
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
                CEP
              </Checkbox>
              <Input
                disabled={!selectedFilters[4].active}
                maxLength={9}
                value={cepMask(selectedFilters[4].value)}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[4].value = cepMask(e.target.value)

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
                Estado
              </Checkbox>
              <Input
                disabled={!selectedFilters[5].active}
                maxLength={9}
                value={cepMask(selectedFilters[5].value)}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[5].value = cepMask(e.target.value)

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
                Codigo Pedido
              </Checkbox>
              <Input
                type="number"
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
                Tem Desconto
              </Checkbox>
              <Select
                disabled={!selectedFilters[7].active}
                value={selectedFilters[7].value}
                onChange={e => {
                  let newArr = [...selectedFilters]
                  newArr[7].value = e.target.value

                  setSelectedFilters(newArr)
                }}
              >
                <option style={{ color: 'black' }} value="Sim">
                  Sim
                </option>
                <option style={{ color: 'black' }} value="Nao">
                  Nao
                </option>
              </Select>
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

export default OrderFilter
