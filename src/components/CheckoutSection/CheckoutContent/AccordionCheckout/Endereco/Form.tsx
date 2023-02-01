import React, { useState } from 'react'

import {
  Text,
  WrapItem,
  FormLabel,
  Input,
  Stack,
  Wrap,
  Button,
  useToast,
  HStack
} from '@chakra-ui/react'

import { cepMask } from '../../../../../../utils/masks'
import { useFreteGratisContext } from '../../../../../contexts/FreteGratisContext'
import { api } from '../../../../../services/apiClient'
import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { queryClient } from '../../../../../services/queryClient'

const Form = ({ setAddAddress }) => {
  const toast = useToast()
  const [cep, setCep] = useState('')
  const [form, setForm] = useState({
    complemento: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    lembrete: '',
    destinatario: ''
  })
  const [validator, setValidator] = useState({
    cepValidator: false,
    formValidator: false
  })

  const { cepResultAutoComplete } = useFreteGratisContext()
  const { checkoutUsuario, setCheckoutEntrega } = useCheckoutContext()

  const applyAutoCompleteCep = async (value: string) => {
    if (cep.length !== 7) {
      return false
    }
    const viaCepResult = await cepResultAutoComplete(value.replace('-', ''))
    if (viaCepResult.erro !== 'true') {
      setForm({
        ...form,
        bairro: viaCepResult.bairro,
        endereco: viaCepResult.logradouro,
        cidade: viaCepResult.localidade,
        estado: viaCepResult.uf
      })
      return setValidator({ ...validator, cepValidator: false })
    } else {
      setForm({ ...form, bairro: '', endereco: '', cidade: '', estado: '' })
      return setValidator({ ...validator, cepValidator: true })
    }
  }

  const handleAddNewAddress = async () => {
    if (
      !form.bairro ||
      !form.complemento ||
      !form.endereco ||
      !form.numero ||
      !form.cidade ||
      !form.estado ||
      !form.destinatario ||
      !cep
    ) {
      return setValidator({ ...validator, formValidator: true })
    }
    setValidator({ ...validator, formValidator: false })

    const {
      bairro,
      cidade,
      complemento,
      destinatario,
      endereco,
      estado,
      lembrete,
      numero
    } = form

    const newEnderecoObj = {
      bairro: bairro,
      cep: cep.replace('-', ''),
      numero,
      complemento,
      cidade,
      endereco,
      estado,
      lembrete,
      pais: 'BR',
      usuario_id: checkoutUsuario.usuarioRes.id,
      destinatario
    }

    const resEndereco = await api.post('/checkout/addresses', newEnderecoObj)

    if (resEndereco.data.status === 'error') {
      return toast({
        title: 'Erro.',
        description: resEndereco.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    const newEnderecoPagarmeObj = {
      bairro,
      cep,
      cidade,
      complemento,
      customer_id: checkoutUsuario.pagarmeRes.id,
      destinatario,
      endereco,
      estado,
      numero,
      referencia: lembrete
    }

    const resEnderecoPagarme = await api.post(
      '/checkout/users_address_pagarme',
      newEnderecoPagarmeObj
    )

    if (resEnderecoPagarme.data.status === 'error') {
      return toast({
        title: 'Erro.',
        description: resEnderecoPagarme.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    const newenderecoBlingObj = {
      nome: checkoutUsuario.usuarioRes.nome_completo,
      fantasia: '',
      tipoPessoa: 'F', //F, J ou E
      contribuinte: 9,
      cpf_cnpj: checkoutUsuario.usuarioRes.cpf,
      ie_rg: '',
      endereco,
      numero,
      complemento,
      bairro,
      cep,
      cidade,
      uf: estado,
      fone: checkoutUsuario.usuarioRes.celular,
      celular: checkoutUsuario.usuarioRes.celular,
      email: checkoutUsuario.usuarioRes.email,
      emailNfe: checkoutUsuario.usuarioRes.email,
      informacaoContato: '',
      limiteCredito: '',
      paisOrigem: 'BR',
      codigo: checkoutUsuario.usuarioRes.id,
      site: ''
    }

    const resContatoBling = await api.post(
      '/checkout/users_bling',
      newenderecoBlingObj
    )

    if (resContatoBling.data.status === 'error') {
      return toast({
        title: 'Erro.',
        description: 'Não foi possível cadastrar na bling.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }

    setCheckoutEntrega({
      enderecoRes: resEndereco.data,
      pagarmeRes: resEnderecoPagarme.data,
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
      }
    })

    setAddAddress(false)

    queryClient.invalidateQueries('enderecos')
  }

  return (
    <Stack>
      <FormLabel fontSize="10px">Endereço de entrega:</FormLabel>
      {validator.formValidator === true && (
        <Text fontSize={10} color="red">
          Preencha todos os campos necessários. (*)
        </Text>
      )}
      <WrapItem flexDirection="column">
        <FormLabel>CEP: *</FormLabel>
        <Input
          maxLength={9}
          value={cep}
          onChange={e => (
            setCep(cepMask(e.target.value)),
            e.target.value.length === 8 && applyAutoCompleteCep(e.target.value)
          )}
        />
        {validator.cepValidator === true && (
          <Text fontSize={10} color="red">
            CEP Inválido
          </Text>
        )}
      </WrapItem>
      <Wrap>
        <WrapItem flexDirection="column">
          <FormLabel>Cidade *</FormLabel>
          <Input
            value={form.cidade}
            onChange={e => setForm({ ...form, cidade: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Estado *</FormLabel>
          <Input
            value={form.estado}
            onChange={e => setForm({ ...form, estado: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Bairro *</FormLabel>
          <Input
            value={form.bairro}
            onChange={e => setForm({ ...form, bairro: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Endereço *</FormLabel>
          <Input
            value={form.endereco}
            onChange={e => setForm({ ...form, endereco: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Número *</FormLabel>
          <Input
            value={form.numero}
            onChange={e => setForm({ ...form, numero: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Complemento *</FormLabel>
          <Input
            value={form.complemento}
            onChange={e => setForm({ ...form, complemento: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Ponto de Referência</FormLabel>
          <Input
            value={form.lembrete}
            onChange={e => setForm({ ...form, lembrete: e.target.value })}
          />
        </WrapItem>
        <WrapItem flexDirection="column">
          <FormLabel>Destinatário *</FormLabel>
          <Input
            value={form.destinatario}
            onChange={e => setForm({ ...form, destinatario: e.target.value })}
          />
        </WrapItem>
      </Wrap>

      <HStack>
        <Button
          bg="black"
          color="white"
          w="100%"
          onClick={() => handleAddNewAddress()}
        >
          Cadastrar
        </Button>
        <Button
          bg="black"
          color="white"
          w="100%"
          onClick={() => setAddAddress(false)}
        >
          Cancelar
        </Button>
      </HStack>
    </Stack>
  )
}

export default Form
