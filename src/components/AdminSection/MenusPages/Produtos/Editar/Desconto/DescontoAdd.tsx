import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Stack,
  Input,
  FormLabel,
  Select,
  Button,
  FormControl,
  useToast,
  Text
} from '@chakra-ui/react'

import { useDescontos } from '../../../../../../services/hooks/useDescontos'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'
import { dataMask, validateDesconto } from '../../../../../../../utils/masks'

type DescontoAddFormData = {
  desconto_tipo: number
  desconto_valor: number
  data_desconto_1: Date
  data_desconto_2: Date
}

const DescontoAdd = () => {
  const { isSuccess, data } = useDescontos()

  const toast = useToast()

  const router = useRouter()

  const { slug } = router.query

  const [invalidate, setInvalidate] = useState(false)

  const [descontoForm, setDescontoForm] = useState({
    desconto_tipo: 0,
    desconto_valor: '',
    data_desconto_1: '',
    data_desconto_2: ''
  })

  const addDesconto = useMutation(
    async (descontoToAdd: DescontoAddFormData) => {
      try {
        const response = await api.post(`/descontos`, descontoToAdd)

        toast({
          title: 'Sucesso ao criar Desconto.',
          description: 'Desconto foi criado com sucesso',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        return response.data
      } catch (err) {
        toast({
          title: 'Erro ao Criar Desconto.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('descontos')
      }
    }
  )

  const handleAddDesconto = async () => {
    if (descontoForm.desconto_tipo === 0) {
      return setInvalidate(true)
    }

    if (parseFloat(descontoForm.desconto_valor) < 0) {
      return setInvalidate(true)
    }

    const date1Splitted = descontoForm.data_desconto_1.split('/')
    const date2Splitted = descontoForm.data_desconto_2.split('/')

    if (validateDesconto(descontoForm.data_desconto_1) === false) {
      return setInvalidate(true)
    }

    if (validateDesconto(descontoForm.data_desconto_2) === false) {
      return setInvalidate(true)
    }

    const date1 = new Date(
      `${date1Splitted[1]}/${date1Splitted[0]}/${date1Splitted[2]}`
    ).getTime()

    const date2 = new Date(
      `${date2Splitted[1]}/${date2Splitted[0]}/${date2Splitted[2]}`
    ).getTime()

    if (date1 == date2) {
      return setInvalidate(true)
    }

    if (date1 > date2 || date2 < date1) {
      return setInvalidate(true)
    }

    setInvalidate(false)

    const descontoToAdd = {
      produto_id: parseInt(slug[0]),
      desconto_tipo: descontoForm.desconto_tipo,
      desconto_valor: parseFloat(descontoForm.desconto_valor),
      data_desconto_1: new Date(
        `${date1Splitted[1]}/${date1Splitted[0]}/${date1Splitted[2]}`
      ),
      data_desconto_2: new Date(
        `${date2Splitted[1]}/${date2Splitted[0]}/${date2Splitted[2]}`
      )
    }
    await addDesconto.mutateAsync(descontoToAdd)
  }

  return (
    <Flex direction="column">
      <Flex
        flexDirection={{ base: 'column', lg: 'row' }}
        justifyContent="space-between"
      >
        <Stack>
          <FormControl>
            <FormLabel>Desconto Tipo</FormLabel>
            <Select
              value={descontoForm.desconto_tipo}
              onChange={e =>
                setDescontoForm({
                  ...descontoForm,
                  desconto_tipo: parseInt(e.target.value)
                })
              }
            >
              <option value={0} style={{ color: 'black' }}>
                Escolher
              </option>
              <option value={1} style={{ color: 'black' }}>
                Valor R$
              </option>
              <option value={2} style={{ color: 'black' }}>
                Porcentagem %
              </option>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Desconto Valor</FormLabel>
            <Input
              id="desconto_valor"
              maxLength={6}
              value={descontoForm.desconto_valor}
              onChange={e =>
                setDescontoForm({
                  ...descontoForm,
                  desconto_valor: e.target.value
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Desde</FormLabel>
            <Input
              id="data_desconto_1"
              w="200px"
              maxLength={10}
              value={descontoForm.data_desconto_1}
              onChange={e =>
                setDescontoForm({
                  ...descontoForm,
                  data_desconto_1: dataMask(e.target.value)
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl>
            <FormLabel>Até</FormLabel>
            <Input
              id="data_desconto_2"
              w="200px"
              maxLength={10}
              value={descontoForm.data_desconto_2}
              onChange={e =>
                setDescontoForm({
                  ...descontoForm,
                  data_desconto_2: dataMask(e.target.value)
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack alignContent="center" justifyContent="end">
          <Button
            disabled={
              isSuccess &&
              data.filter(item => item.produto_id === parseInt(slug[0]))
                .length >= 1
                ? true
                : false
            }
            type="submit"
            colorScheme="pink"
            onClick={handleAddDesconto}
          >
            Gravar
          </Button>
        </Stack>
      </Flex>

      {invalidate === true && (
        <Text color="red" mt="10px">
          Desconto Inválido
        </Text>
      )}
    </Flex>
  )
}

export default DescontoAdd
