import React from 'react'

import AdminBaseTemplate from '../Base/adminBase'

import ConjuntoAdd from '../../components/AdminSection/MenusPages/Conjuntos/Adicionar'
import VariacoesAdd from '../../components/AdminSection/MenusPages/Variacoes/Adicionar'
import ProdutosAdd from '../../components/AdminSection/MenusPages/Produtos/Adicionar'
import CategoriasAdd from '../../components/AdminSection/MenusPages/Categorias/Adicionar'
import MarcasAdd from '../../components/AdminSection/MenusPages/Marcas/Adicionar'
import FornecedoresAdd from '../../components/AdminSection/MenusPages/Fornecedores/Adicionar'
import ClientesAdd from '../../components/AdminSection/MenusPages/Clientes/Adicionar'
import CarteiraAdd from '../../components/AdminSection/MenusPages/Carteiras/Adicionar'
import CuponsAdd from '../../components/AdminSection/MenusPages/Cupons/Adicionar'

const AdminAdicionarTemplate = ({ slug, pid }) => {
  switch (pid) {
    case 'produtos':
      return (
        <AdminBaseTemplate>
          <ProdutosAdd />
        </AdminBaseTemplate>
      )

    case 'conjuntos':
      return (
        <AdminBaseTemplate>
          <ConjuntoAdd />
        </AdminBaseTemplate>
      )

    case 'categorias':
      return (
        <AdminBaseTemplate>
          <CategoriasAdd />
        </AdminBaseTemplate>
      )

    case 'variacoes':
      return (
        <AdminBaseTemplate>
          <VariacoesAdd />
        </AdminBaseTemplate>
      )

    case 'marcas':
      return (
        <AdminBaseTemplate>
          <MarcasAdd />
        </AdminBaseTemplate>
      )

    case 'fornecedores':
      return (
        <AdminBaseTemplate>
          <FornecedoresAdd />
        </AdminBaseTemplate>
      )

    case 'clientes':
      return (
        <AdminBaseTemplate>
          <ClientesAdd />
        </AdminBaseTemplate>
      )

    case 'carteiras':
      return (
        <AdminBaseTemplate>
          <CarteiraAdd />
        </AdminBaseTemplate>
      )

    case 'descontos':
      return (
        <AdminBaseTemplate>
          <CuponsAdd />
        </AdminBaseTemplate>
      )

    default:
      return <AdminBaseTemplate>nao selecionou</AdminBaseTemplate>
  }
}

export default AdminAdicionarTemplate
