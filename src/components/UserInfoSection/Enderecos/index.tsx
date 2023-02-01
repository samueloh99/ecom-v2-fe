import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { IoMdArrowBack } from 'react-icons/io'

import {
  Stack,
  Icon,
  Text,
  Flex,
  HStack,
  useDisclosure,
  Button,
  Wrap,
  WrapItem
} from '@chakra-ui/react'

import EnderecoAddModal from './Adicionar'
import EnderecoEditModal from './Editar'

import { useEnderecos } from '../../../services/hooks/useEnderecos'
import { useAuthContext } from '../../../contexts/AuthContext'
import { api } from '../../../services/apiClient'
import { queryClient } from '../../../services/queryClient'

interface Endereco {
  id: number
  usuario_id: number
  ativo: number
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  lembrete: string
  destinatario: string
  created_at: Date
  updated_at: Date
}

export const UserInfoEnderecos = () => {
  const { push } = useRouter()

  const { data, isSuccess } = useEnderecos()

  const { userData } = useAuthContext()

  const [enderecoId, setInderecoId] = useState(null)

  const [endereco, setEndereco] = useState<Endereco[]>([])

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd
  } = useDisclosure()
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit
  } = useDisclosure()

  const [invalidate, setInvalidate] = useState(false)

  useEffect(() => {
    if (userData && isSuccess) {
      const filterEnderecoByUser = data.enderecos.filter(
        item => item.usuario_id === userData.id
      )

      setEndereco(filterEnderecoByUser)
    }
  }, [data, userData])

  const handleRemoveEndereco = async (id: number) => {
    await api.delete(`/enderecos/apagar/${id}`).then(res => {
      if (res.status === 200) {
        setInvalidate(false)
        queryClient.invalidateQueries('enderecos')
      } else {
        setInvalidate(true)
      }
    })
  }
  return (
    <Flex direction="column" h="100%" w="70%">
      <Flex alignItems="center">
        <HStack
          cursor="pointer"
          onClick={() => push({ pathname: '/userinfo' })}
        >
          <Icon as={IoMdArrowBack} fontSize={20} />
          <Text>Voltar</Text>
        </HStack>
      </Flex>

      <Flex mt="20px">
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Text fontWeight="bold" fontSize={20}>
            Endreços
          </Text>
          <Button bg="black" color="white" onClick={onOpenAdd}>
            Adicionar
          </Button>

          <EnderecoAddModal isOpen={isOpenAdd} onClose={onCloseAdd} />
        </Flex>
      </Flex>
      {invalidate && (
        <Text color="red" fontSize={15}>
          Não foi possível apagar o endereço.
        </Text>
      )}
      <Wrap gap={2} mt="20px">
        {endereco.map((item, index) => {
          return (
            <WrapItem
              // direction="column"
              flexDirection="column"
              justifyContent="space-between"
              key={index}
              border="1px solid #ccc"
              w="250px"
            >
              <Stack
                p="10px"
                direction="column"
                justifyContent="space-between"
                fontSize={14}
                h="100%"
              >
                <Text>
                  {item.endereco}, {item.numero}
                </Text>
                <Text>{item.complemento}</Text>
                <Text>
                  {item.bairro}, {item.cidade} - {item.estado}
                </Text>
                <Text>{item.cep}</Text>
              </Stack>
              <HStack mt="10px" justifyContent="space-between">
                <Button
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  onClick={() => (onOpenEdit(), setInderecoId(item.id))}
                >
                  Editar
                </Button>
                <Button
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  onClick={() => handleRemoveEndereco(item.id)}
                >
                  Apagar
                </Button>
              </HStack>
            </WrapItem>
          )
        })}
      </Wrap>
      <EnderecoEditModal
        endereco_id={enderecoId}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
      />
    </Flex>
  )
}

export default UserInfoEnderecos
