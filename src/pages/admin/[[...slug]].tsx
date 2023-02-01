import React from 'react'

import AdminTemplate from '../../templates/Admin'
import { SidebarDrawerProvider } from '../../contexts/SidebarDrawerContext'
import { isAdmin } from '../../../utils/isAdmin'
import { AuthProvider } from '../../contexts/AuthContext'

export default function Admin({ params }) {
  return (
    <AuthProvider>
      <SidebarDrawerProvider>
        <AdminTemplate {...params} />
      </SidebarDrawerProvider>
    </AuthProvider>
  )
}

export const getServerSideProps = isAdmin(async ({ params }) => {
  return {
    props: {
      params: params
    }
  }
})
