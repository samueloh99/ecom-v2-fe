import { GetServerSideProps } from 'next'
import React from 'react'

import AdminEditarTemplate from '../../../../templates/Admin/AdminEditar'

import { SidebarDrawerProvider } from '../../../../contexts/SidebarDrawerContext'

import { api } from '../../../../services/apiClient'

export default function Admin({
  query,
  pedido,
  pedidoProduto,
  cliente,
  endereco,
  clienteCarteira,
  cupom
}) {
  const { pid, slug } = query
  return (
    <SidebarDrawerProvider>
      <AdminEditarTemplate
        pid={pid}
        slug={slug}
        pedido={pedido}
        endereco={endereco}
        pedidoProduto={pedidoProduto}
        cupom={cupom}
        clienteCarteira={clienteCarteira}
        cliente={cliente}
      />
    </SidebarDrawerProvider>
  )
}

// mudar a logica de query para o mesmo de ADICIONAR

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let dataPedidoProps = {}
  let dataPedidoProdutoProps = {}
  let dataClienteProps = {}
  let dataClienteCarteiraProps = {}
  let dataEnderecosProps = {}
  let dataCuponsProps = {}

  if (query.pid === 'pedidos') {
    try {
      const { data: dataPedido } = await api.get(`/pedidos/todos`)
      const { data: dataPedidoProduto } = await api.get(
        `/pedidosProdutos/todos?atual=1&mostrar=999999`
      )

      dataPedidoProps = dataPedido.pedidos.find(
        item => item.id === parseInt(query.slug[0])
      )

      dataPedidoProdutoProps = dataPedidoProduto.pedidosProdutos.filter(
        item => item.pedido_id === parseInt(query.slug[0])
      )
    } catch (err) {
      console.log('AQUI:', err)
      dataPedidoProps = {}
      dataPedidoProdutoProps = {}
    }
  }

  if (query.pid === 'clientes' || query.pid === 'administradores') {
    try {
      const { data } = await api.get(`/usuarios`)
      const { data: dataCarteira } = await api.get(
        `/carteiras/total_usuario/${query.slug[0]}`
      )

      dataClienteProps = data.usuarios.find(
        item => item.id === parseInt(query.slug[0])
      )
      dataClienteCarteiraProps = dataCarteira
    } catch (err) {
      console.log('AQUI:', err)
      dataClienteProps = {}
      dataClienteCarteiraProps = {}
    }
  }

  if (query.pid === 'enderecos') {
    try {
      const { data } = await api.get(`/enderecos`)

      dataEnderecosProps = data.enderecos.find(
        item => item.id === parseInt(query.slug[0])
      )
    } catch (err) {
      console.log('AQUI:', err)
      dataEnderecosProps = {}
    }
  }

  if (query.pid === 'descontos') {
    try {
      const { data } = await api.get(`/cupons/todos`)

      dataCuponsProps = data.find(item => item.id === parseInt(query.slug[0]))
    } catch (err) {
      console.log('AQUI:', err)
      dataCuponsProps = {}
    }
  }

  return {
    props: {
      pedido: dataPedidoProps,
      pedidoProduto: dataPedidoProdutoProps,
      cliente: dataClienteProps,
      clienteCarteira: dataClienteCarteiraProps,
      endereco: dataEnderecosProps,
      cupom: dataCuponsProps,
      query
    }
  }
}
