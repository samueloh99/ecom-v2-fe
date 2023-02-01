import React from 'react'

import { WrapItem, Stack, Text, Button, Wrap, HStack } from '@chakra-ui/react'

import { useAuthContext } from '../../../../../contexts/AuthContext'
import { useEnderecos } from '../../../../../services/hooks/useEnderecos'
import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { api } from '../../../../../services/apiClient'

const TabPanelEnderecos = () => {
  const { userData } = useAuthContext()

  const { setCheckoutEntrega, checkoutUsuario, checkoutEntrega } =
    useCheckoutContext()

  const { data } = useEnderecos('mostrar=99999')

  const handleSelectAddress = (id: number) => {
    const {
      bairro,
      cep,
      numero,
      complemento,
      cidade,
      endereco,
      estado,
      destinatario,
      lembrete,
      created_at,
      updated_at,
      usuario_id,
      pais
    } = data.enderecos.find(item => item.id === id)

    const addressObjApi = {
      bairro: bairro,
      cep: cep.replace('-', ''),
      numero,
      complemento,
      cidade,
      endereco,
      estado,
      lembrete,
      destinatario,
      customer_id: checkoutUsuario.pagarmeRes.id
    }

    const resEndereco = async () => {
      const resPagarme = await api.post(
        `/checkout/users_address_pagarme`,
        addressObjApi
      )

      setCheckoutEntrega({
        checkoutDataEnderecoDTO: {
          entrega_nome: '',
          entrega_cep: '',
          entrega_endereco: '',
          entrega_numero: '',
          entrega_complemento: '',
          entrega_bairro: '',
          entrega_cidade: '',
          entrega_estado: '',
          entrega_pais: '',
          entrega_lembrete: '',
          frete_titulo: '',
          frete_nome: '',
          frete_prazo: 0,
          frete_valor: 0,
          frete_embalagem: '',
          endereco_id: '',
          endereco_id_pagarme: ''
        },
        enderecoRes: {
          bairro,
          cep,
          cidade,
          complemento,
          destinatario,
          endereco,
          estado,
          id,
          lembrete,
          numero,
          pais,
          created_at,
          updated_at,
          usuario_id
        },
        pagarmeRes: resPagarme.data
      })
    }

    resEndereco()
  }

  return (
    <Wrap gap={2} mt="20px" justify="start">
      {data &&
        userData &&
        data.enderecos
          .filter(item => item.usuario_id === userData.id)
          .map((item, index) => {
            return (
              <WrapItem
                flexDirection="column"
                justifyContent="space-between"
                key={index}
                border={
                  checkoutEntrega && checkoutEntrega.enderecoRes.id === item.id
                    ? '1px solid green'
                    : '1px solid #ccc'
                }
                w="250px"
                p="10px"
              >
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  fontSize={14}
                  h="100%"
                  p="10px"
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
                <Button
                  p="10px"
                  cursor="pointer"
                  color="white"
                  bg="black"
                  onClick={() => handleSelectAddress(item.id)}
                >
                  entregar aqui
                </Button>
              </WrapItem>
            )
          })}
    </Wrap>
  )
}

export default TabPanelEnderecos
