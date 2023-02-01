import React, { useEffect, useState } from 'react'

import * as fbq from '../../../../lib/fpixel'

import { destroyCookie } from 'nookies'

import { useRouter } from 'next/router'

import { Flex, Text, Divider, Button, useToast } from '@chakra-ui/react'

import { useCheckoutContext } from '../../../contexts/CheckoutContext'
import { useCartContext } from '../../../contexts/CartContext'
import { api } from '../../../services/apiClient'
import { usePagamentos } from '../../../services/hooks/useConfiguracoes'

const CheckoutConfirmation = ({ isCart }) => {
  const toast = useToast()
  const { push } = useRouter()

  const {
    step,
    checkoutEntrega,
    checkoutPagamento,
    setCheckoutOrderCartaoPagarme,
    checkoutUsuario,
    setCheckoutOrderBoletoPagarme,
    setCheckoutPedido,
    useWalletValue,
    setCheckoutOrderPixPagarme
  } = useCheckoutContext()

  const { totalCart, cartCupom, totalPeso, totalQtd, cart, setCart } =
    useCartContext()

  const { data: dataPagamentos } = usePagamentos()

  const [erroPedido, setErroPedido] = useState(false)

  const [totalDiscounts, setTotalDiscount] = useState(0.0)

  const [totalValue, setTotalValue] = useState(0.0)

  const [checkoutValues, setCheckoutValues] = useState({
    cupom: 0,
    frete: 0,
    frete_gratis: false,
    desconto_pgto: 0
  })

  useEffect(() => {
    if (cartCupom.valido === 1) {
      if (cartCupom.desconto_tipo === 'P') {
        setCheckoutValues({
          ...checkoutValues,
          cupom: parseFloat(
            (totalCart() * (cartCupom.desconto_valor / 100)).toFixed(2)
          )
        })
      }

      if (cartCupom.desconto_tipo === 'F') {
        setCheckoutValues({
          ...checkoutValues,
          cupom: parseFloat(cartCupom.desconto_valor.toFixed(2))
        })
      }
    }

    if (step === 2) {
      if (checkoutEntrega.checkoutDataEnderecoDTO.frete_titulo === 'grátis') {
        setCheckoutValues({ ...checkoutValues, frete: 0, frete_gratis: true })
      } else {
        setCheckoutValues({
          ...checkoutValues,
          frete: checkoutEntrega.checkoutDataEnderecoDTO.frete_valor,
          frete_gratis: false
        })
      }
    }

    if (checkoutPagamento && checkoutPagamento.pagamento_titulo === 'Pix') {
      const descontoValor =
        dataPagamentos.pix_ativo === 1
          ? parseFloat(
              (totalCart() * (dataPagamentos.pix_desconto / 100)).toFixed(2)
            )
          : 0

      setCheckoutValues({
        ...checkoutValues,
        desconto_pgto: descontoValor
      })
    }

    if (
      checkoutPagamento &&
      checkoutPagamento.pagamento_titulo === 'Boleto Bancário'
    ) {
      const descontoValor =
        dataPagamentos.boleto_ativo === 1
          ? parseFloat(
              (totalCart() * (dataPagamentos.boleto_desconto / 100)).toFixed(2)
            )
          : 0

      setCheckoutValues({
        ...checkoutValues,
        desconto_pgto: descontoValor
      })
    }
  }, [step, checkoutEntrega, checkoutPagamento, cartCupom])

  useEffect(() => {
    const minus =
      checkoutValues.cupom + checkoutValues.desconto_pgto + useWalletValue
    const cartPlusFrete = totalCart() + checkoutValues.frete

    setTotalValue(cartPlusFrete - minus)
  }, [checkoutValues, useWalletValue])

  const sendSqsOrderError = async ({ pedido_id, forma_pgto }) => {
    await api.post('/checkout/order_erro/sqs', {
      pedido_geral: totalValue,
      usuario_id: checkoutUsuario.usuarioRes.id,
      pedido_id,
      usuario_id_pagarme: checkoutUsuario.pagarmeRes.id,
      endereco_id: checkoutEntrega.enderecoRes.id,
      forma_pgto
    })
  }

  const handleConfirmation = async () => {
    const pedidoObj = {
      pedido_tipo: '1',
      pedido_peso: `${totalPeso()}`,
      pedido_qtde: totalQtd(),
      pedido_prazo: checkoutEntrega.checkoutDataEnderecoDTO.frete_prazo + 1,
      pedido_desconto: totalDiscounts,
      pedido_carteira: useWalletValue,
      pedido_total: totalCart(),
      pedido_geral: totalValue,
      pedido_cancelado: '0',
      card_id_pagarme: checkoutPagamento.card_id_pagarme,
      usuario_id_pagarme: checkoutUsuario.pagarmeRes.id,
      usuario_id: checkoutUsuario.usuarioRes.id,
      endereco_id: checkoutEntrega.enderecoRes.id,
      frete_nome: checkoutEntrega.checkoutDataEnderecoDTO.frete_nome,
      frete_titulo: checkoutEntrega.checkoutDataEnderecoDTO.frete_titulo,
      frete_prazo: checkoutEntrega.checkoutDataEnderecoDTO.frete_prazo,
      frete_valor: checkoutEntrega.checkoutDataEnderecoDTO.frete_valor,
      frete_embalagem: checkoutEntrega.checkoutDataEnderecoDTO.frete_embalagem,
      pagamento_nome: checkoutPagamento.pagamento_nome,
      pagamento_titulo: checkoutPagamento.pagamento_titulo,
      pagamento_valor: checkoutPagamento.pagamento_valor,
      pagamento_link: checkoutPagamento.pagamento_link,
      desconto_id: cartCupom.cupom_id,
      parcela_numero: checkoutPagamento.parcela_numero,
      parcela_valor: checkoutPagamento.parcela_valor,
      parcela_desconto: checkoutPagamento.parcela_desconto,
      cartao_nsu: checkoutPagamento.cartao_nsu,
      cartao_bandeira: checkoutPagamento.cartao_bandeira,
      status_entrega: 0,
      status_pagamento: 0,
      utm_campaign: '',
      utm_source: '',
      utm_medium: '',
      utm_content: '',
      utm_term: '',
      produtos: cart.map(item => {
        return {
          code: String(item.idSku),
          quantity: item.quantidade,
          amount: item.preco,
          description: item.nome
        }
      })
    }

    let responsePedido

    await api
      .post(`/pedidos`, pedidoObj)
      .then(res => {
        responsePedido = res

        setCheckoutPedido(res.data)
      })
      .catch(err => {
        push({ pathname: '/' })
        return toast({
          title: 'Erro.',
          description: `${err.response.data.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })

    // const newOrderBling = {
    //   numero: responsePedido.data.id,
    //   vlr_frete: checkoutEntrega.checkoutDataEnderecoDTO.frete_valor,
    //   vlr_desconto: totalDiscounts,
    //   obs: '',
    //   nome_transportadora: checkoutEntrega.checkoutDataEnderecoDTO.frete_nome,
    //   cliente_codigo: checkoutUsuario.usuarioRes.id,
    //   cliente_nome: checkoutUsuario.usuarioRes.nome_completo,
    //   cliente_tipoPessoa: 'F',
    //   cliente_cpf_cnpj: checkoutUsuario.usuarioRes.cpf,
    //   cliente_endereco: checkoutEntrega.enderecoRes.endereco,
    //   cliente_numero: checkoutEntrega.enderecoRes.numero,
    //   cliente_complemento: checkoutEntrega.enderecoRes.complemento,
    //   cliente_bairro: checkoutEntrega.enderecoRes.bairro,
    //   cliente_cidade: checkoutEntrega.enderecoRes.cidade,
    //   cliente_uf: checkoutEntrega.enderecoRes.estado,
    //   cliente_cep: checkoutEntrega.enderecoRes.cep,
    //   cliente_fone: checkoutUsuario.usuarioRes.celular,
    //   cliente_email: checkoutUsuario.usuarioRes.email,
    //   transporte_transportadora:
    //     checkoutEntrega.checkoutDataEnderecoDTO.frete_nome,
    //   transporte_tipo_frete: 'R',
    //   transporte_qtde_volumes: 1,
    //   transporte_peso_bruto: totalPeso(),
    //   transporte_peso_liquido: totalPeso(),
    //   transporte_servico_correios:
    //     checkoutEntrega.checkoutDataEnderecoDTO.frete_titulo,
    //   dados_etiquetas_nome: checkoutEntrega.checkoutDataEnderecoDTO,
    //   dados_etiquetas_endereco: checkoutEntrega.enderecoRes.endereco,
    //   dados_etiquetas_numero: checkoutEntrega.enderecoRes.numero,
    //   dados_etiquetas_complemento: checkoutEntrega.enderecoRes.complemento,
    //   dados_etiquetas_bairro: checkoutEntrega.enderecoRes.bairro,
    //   dados_etiquetas_municipio: checkoutEntrega.enderecoRes.cidade,
    //   dados_etiquetas_uf: checkoutEntrega.enderecoRes.estado,
    //   dados_etiquetas_cep: checkoutEntrega.enderecoRes.cep,
    //   volume_servico: 'Correios',
    //   itens: [...cart],
    //   parcela_dias: checkoutPagamento.parcela_numero,
    //   parcela_vlr: checkoutPagamento.parcela_valor
    // }

    fbq.event('Purchase', {
      content_type: 'product',
      email: checkoutUsuario.usuarioRes.email,
      nome: checkoutUsuario.usuarioRes.nome_completo,
      cidade: checkoutEntrega.enderecoRes.cidade,
      data: responsePedido.data.created_at,
      currency: 'BRL',
      value: totalValue,
      contents: cart.map(item => {
        return {
          code: `${item.idProd}-${item.idSku}`,
          quantity: item.quantidade,
          price: item.preco
        }
      })
    })

    if (checkoutPagamento.pagamento_titulo === 'Pix') {
      return await api
        .post('/checkout/orders_pagarme/pix', {
          usuario_id_pagarme: checkoutUsuario.pagarmeRes.id,
          usuario_id: checkoutUsuario.usuarioRes.id,
          endereco_id: checkoutEntrega.enderecoRes.id,
          pedido_geral: totalValue,
          pedido_id: responsePedido.data.id
        })
        .then(res => {
          if (res.data.errors) {
            setErroPedido(true)

            sendSqsOrderError({
              forma_pgto: 'PIX',
              pedido_id: responsePedido.data.id
            })

            setCart([])
            destroyCookie(undefined, 'cupom')
            setCheckoutOrderPixPagarme(res.data)
            return push('/checkout/concluidoorder')
          }
          setErroPedido(false)
          setCart([])
          destroyCookie(undefined, 'cupom')
          setCheckoutOrderPixPagarme(res.data)
          push('/checkout/concluido')
        })
        .catch(err => {
          push({ pathname: '/' })
          console.log('Erro ao criar pedido:', err)
        })
    }

    if (checkoutPagamento.pagamento_titulo === 'Cartão de Crédito') {
      return await api
        .post('/checkout/orders_pagarme/cartao', {
          usuario_id_pagarme: checkoutUsuario.pagarmeRes.id,
          usuario_id: checkoutUsuario.usuarioRes.id,
          endereco_id: checkoutEntrega.enderecoRes.id,
          pedido_geral: totalValue,
          pedido_id: responsePedido.data.id,
          parcela_numero: checkoutPagamento.parcela_numero,
          card_id_pagarme: checkoutPagamento.card_id_pagarme,
          card_cv: checkoutPagamento.card_cv
        })
        .then(res => {
          if (res.data.errors) {
            setErroPedido(true)

            sendSqsOrderError({
              forma_pgto: 'Cartão de Crédito',
              pedido_id: responsePedido.data.id
            })
            setCart([])
            destroyCookie(undefined, 'cupom')
            setCheckoutOrderCartaoPagarme(res.data)
            return push('/checkout/concluidoorder')
          }
          setErroPedido(false)
          setCart([])
          destroyCookie(undefined, 'cupom')
          setCheckoutOrderCartaoPagarme(res.data)
          push('/checkout/concluido')
        })
        .catch(err => {
          push({ pathname: '/' })
          console.log('Erro ao criar pedido:', err)
        })
    }

    if (checkoutPagamento.pagamento_titulo === 'Boleto Bancário') {
      return await api
        .post('/checkout/orders_pagarme/boleto', {
          usuario_id_pagarme: checkoutUsuario.pagarmeRes.id,
          usuario_id: checkoutUsuario.usuarioRes.id,
          endereco_id: checkoutEntrega.enderecoRes.id,
          pedido_geral: totalValue,
          pedido_id: responsePedido.data.id
        })
        .then(res => {
          if (res.data.errors) {
            setErroPedido(true)

            sendSqsOrderError({
              forma_pgto: 'Boleto Bancário',
              pedido_id: responsePedido.data.id
            })

            setCart([])
            destroyCookie(undefined, 'cupom')
            setCheckoutOrderBoletoPagarme(res.data)
            return push('/checkout/concluidoorder')
          }
          setErroPedido(false)
          setCart([])
          destroyCookie(undefined, 'cupom')
          setCheckoutOrderBoletoPagarme(res.data)
          push('/checkout/concluido')
        })
        .catch(err => {
          push({ pathname: '/' })
          console.log('Erro ao criar pedido:', err)
        })
    }
  }

  return (
    <Flex bg="white" p={isCart === true ? '0 ' : '10'} direction="column">
      <Text my="20px" fontWeight="bold">
        Resumo do Pedido:
      </Text>
      <Flex justifyContent="space-between" w="100%" direction="row">
        <Flex direction="column">
          <Text>Subtotal</Text>
          {checkoutValues.desconto_pgto !== 0 && (
            <Text color="green.400">
              Desconto {checkoutPagamento.pagamento_titulo}
            </Text>
          )}
          {checkoutValues.cupom !== 0 && (
            <Text color="green.300">Cupom ({cartCupom.cupomName})</Text>
          )}

          <Text>Frete</Text>
          {useWalletValue !== 0 && <Text>Carteira</Text>}
          <Text fontSize={17} mt="2" fontWeight="bold">
            Total
          </Text>
        </Flex>

        <Flex direction="column" align="end">
          <Text>R$ {totalCart().toFixed(2).replaceAll('.', ',')}</Text>
          {checkoutValues.desconto_pgto !== 0 && (
            <Text color="green.400">
              -R$ {checkoutValues.desconto_pgto.toFixed(2).replace('.', ',')}
            </Text>
          )}
          {checkoutValues.cupom !== 0 && (
            <Text color="green.300">
              -R$
              {checkoutValues.cupom.toFixed(2).replace('.', ',')}
            </Text>
          )}
          <Text>
            {checkoutValues.frete_gratis
              ? `GRÁTIS`
              : checkoutValues.frete.toFixed(2).replace('.', ',')}
          </Text>
          {useWalletValue !== 0 && (
            <Text color="green.400">
              -R${useWalletValue.toFixed(2).replace('.', ',')}
            </Text>
          )}
          <Text fontSize={17} mt="2" fontWeight="bold">
            R${totalValue.toFixed(2).replace('.', ',')}
          </Text>
        </Flex>
      </Flex>

      <Divider m="20px 0px 20px 0px" />

      {step === 3 && (
        <Flex direction="column" h="120px" justifyContent="space-between">
          <Button bg="black" color="white" onClick={() => handleConfirmation()}>
            FINALIZAR O PEDIDO
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default CheckoutConfirmation
