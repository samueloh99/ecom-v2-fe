import { GetServerSideProps } from 'next'
import React from 'react'

import AdminAdicionarTemplate from '../../../../templates/Admin/AdminAdicionar'

import { SidebarDrawerProvider } from '../../../../contexts/SidebarDrawerContext'

export default function Admin({ slug, pid }) {
  return (
    <SidebarDrawerProvider>
      <AdminAdicionarTemplate slug={slug} pid={pid['pid']} />
    </SidebarDrawerProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      slug: query,
      pid: query
    }
  }
}
