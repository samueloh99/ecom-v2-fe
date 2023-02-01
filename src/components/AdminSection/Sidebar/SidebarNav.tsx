import { Stack } from '@chakra-ui/react'
import { RiInputMethodLine } from 'react-icons/ri'

import menus from './adminMenus'
import NavLink from './NavLink'
import NavSection from './NavSection'

interface PropsDTO {
  title: string
  slug: string
}

export default function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      {menus.map((item, index) => {
        const { submenu, title } = item
        return (
          <NavSection key={index} title={title}>
            {submenu.map((item, index) => {
              const { slug, title }: PropsDTO = item
              return (
                <NavLink key={index} icon={RiInputMethodLine} titlePage={slug}>
                  {title}
                </NavLink>
              )
            })}
          </NavSection>
        )
      })}
    </Stack>
  )
}
