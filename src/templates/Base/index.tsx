import { Flex, Icon } from '@chakra-ui/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { IoLogoWhatsapp } from 'react-icons/io'

const BaseTemplate = ({ children }) => (
  <Flex direction="column" position="relative">
    <Flex
      cursor="pointer"
      position="fixed"
      bottom="40px"
      right="20px"
      zIndex={99999}
      onClick={() =>
        window.open(
          'https://api.whatsapp.com/send/?phone=5511911826504&text&type=phone_number&app_absent=0'
        )
      }
    >
      <Icon as={IoLogoWhatsapp} fontSize="40px" color="green" />
    </Flex>
    <header>
      <Header />
    </header>
    <main>{children}</main>
    <footer>
      <Footer />
    </footer>
  </Flex>
)

export default BaseTemplate
