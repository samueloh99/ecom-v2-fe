import { Flex } from '@chakra-ui/react'

import Header from '../../components/AdminSection/Header'
import Sidebar from '../../components/AdminSection/Sidebar'

const BaseTemplate = ({ children }) => (
  <Flex bgColor="gray.900" color="gray.50" direction="column" minHeight="100vh">
    <Header />
    <Flex
      max-width="100%"
      my="6"
      bgColor="gray.900"
      maxWidth="1900px"
      px="6"
      h="100%"
    >
      <Sidebar />
      {children}
    </Flex>
  </Flex>
)

export default BaseTemplate
