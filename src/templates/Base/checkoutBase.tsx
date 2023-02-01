import { Flex } from '@chakra-ui/react'

import Header from '../../components/CheckoutSection/CheckoutHeader'

const CheckoutBase = ({ children }) => (
  <Flex direction="column" minHeight="100vh">
    <Header />
    <Flex
      bg="#f6f5f3"
      w="100%"
      h={{ base: '400vh', md: '260vh' }}
      justifyContent="center"
    >
      {children}
    </Flex>
  </Flex>
)

export default CheckoutBase
