import {
  Link as ChakraLink,
  Icon,
  Text,
  LinkProps as ChakraLinkProps
} from '@chakra-ui/react'

import { ElementType } from 'react'

import ActiveLink from './ActiveLink'

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType
  children: string
  titlePage: string
}

export default function NavLink({
  icon,
  titlePage,
  children,
  ...rest
}: NavLinkProps) {
  return (
    <ActiveLink href={`/admin/${titlePage}`} passHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  )
}
