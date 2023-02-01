import React from 'react'

import { RiMenuLine } from 'react-icons/ri'

import { Flex, useBreakpointValue, Icon, IconButton } from '@chakra-ui/react'

import Profile from './Profile'
import NotificationNav from './NotificationsNav'
import SearchBox from './SearchBox'
import Logo from './Logo'

import { useSidebarDrawer } from '../../../contexts/SidebarDrawerContext'

const Header = () => {
  const { onOpen } = useSidebarDrawer()
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })
  return (
    <Flex
      as="header"
      w="100%"
      maxWidth="100%"
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open Navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        ></IconButton>
      )}
      <Logo />

      {/* {isWideVersion && <SearchBox />} */}

      {/* <Flex align="center" ml="auto">
        <NotificationNav />
      </Flex> */}
    </Flex>
  )
}

export default Header
