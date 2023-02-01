import BaseTemplate from '../Base'

import TrocaDevolucao from '../../components/PaginasInstitucionais/TrocaDevolucao'
import Sobre from '../../components/PaginasInstitucionais/Sobre'
import Cadastro from '../../components/PaginasInstitucionais/Cadastro'
import CompraPagamento from '../../components/PaginasInstitucionais/CompraPagamento'
import Segurança from '../../components/PaginasInstitucionais/Segurança'
import Entrega from '../../components/PaginasInstitucionais/Entrega'

const InstitucionalTemplate = ({ slug }) => {
  switch (slug[0]) {
    case 'trocas-e-devolucoes':
      return (
        <BaseTemplate>
          <TrocaDevolucao />
        </BaseTemplate>
      )

    case 'sobre':
      return (
        <BaseTemplate>
          <Sobre />
        </BaseTemplate>
      )

    case 'cadastro':
      return (
        <BaseTemplate>
          <Cadastro />
        </BaseTemplate>
      )

    case 'compra-pagamento':
      return (
        <BaseTemplate>
          <CompraPagamento />
        </BaseTemplate>
      )

    case 'entrega':
      return (
        <BaseTemplate>
          <Entrega />
        </BaseTemplate>
      )

    case 'seguranca':
      return (
        <BaseTemplate>
          <Segurança />
        </BaseTemplate>
      )
    default:
      return <BaseTemplate>nao selecionou</BaseTemplate>
  }
}

export default InstitucionalTemplate
