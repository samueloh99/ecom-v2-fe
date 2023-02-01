import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Pagamento = {
  ativo: number
  prazo_boleto: number
  prazo_pix: number
  boleto_ativo: number
  pix_ativo: number
  boleto_desconto: number
  secret_key: string
  public_key: string
  pix_desconto: number
}

type Parcela = {
  id: number
  ativo: number
  parcela: number
  tipo: string
  taxa: number
  valor: number
}

type Erp = {
  id: number
  ativo: number
  api_key: string
  codigo_deposito: string
}

type Deposito = {
  id: number
  ativo: number
  lembrete: string
  cep_deposito: string
  cep_minimo: string
  cep_maximo: string
}

type Frete = {
  id: number
  ativo: number
  lembrete: string
  cep_minimo: string
  cep_maximo: string
  compra_minima: string
  compra_maxima: string
  valido_de: string
  valido_ate: string
  updated_at: Date
}

type Correios = {
  id: number
  ativo: number
  cnpj: string
  cartao_postagem: string
  codigo_adm: string
  titular: string
  central: string
  usuario_sigep: string
  senha_sigep: string
  pac_cod: string
  sedex_cod: string
}

type SeoSociais = {
  id: number
  google_analytics: string
  gtm: string
  google_ads: string
  ads_campanha: string
  facebook_pixel: string
  pinterest_tag: string
  tiktok_tag: string
  facebook_link: string
  instagram_link: string
  twitter_link: string
  youtube_link: string
  linkedin_link: string
  pinterest_link: string
  whatsapp_link: string
}

async function getSeoSociais(): Promise<SeoSociais[]> {
  const { data } = await api.get('/configuracoes/seosociais')

  return data
}

async function getPagamentos(): Promise<Pagamento> {
  const { data } = await api.get('/configuracoes/pagamentos')

  return data
}

async function getCorreios(): Promise<Correios[]> {
  const { data } = await api.get('/configuracoes/correios')

  return data
}

async function getParcelas(): Promise<Parcela[]> {
  const { data } = await api.get('/configuracoes/parcelas')

  return data
}

async function getErps(): Promise<Erp[]> {
  const { data } = await api.get('configuracoes/erps')

  return data
}

async function getDepositos(): Promise<Deposito[]> {
  const { data } = await api.get('configuracoes/depositos')

  return data
}

async function getFretes(): Promise<Frete[]> {
  const { data } = await api.get('configuracoes/fretes')

  return data
}

export function usePagamentos() {
  return useQuery('pagamentos_config', getPagamentos, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useSeoSociais() {
  return useQuery('seosociais', getSeoSociais, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useCorreios() {
  return useQuery('correios_config', getCorreios, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useFretes() {
  return useQuery('fretes', getFretes, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useDepositos() {
  return useQuery('depositos', getDepositos, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useParcelas() {
  return useQuery('parcelas_config', getParcelas, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useErps() {
  return useQuery('erps', getErps, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
