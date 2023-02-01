import React from 'react'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Text,
  Select,
  VStack,
  Checkbox,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
  useBreakpointValue,
  Skeleton
} from '@chakra-ui/react'

const ProductPageSkeleton = () => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })
  return (
    <Flex
      maxW={{ lg: '1200px', base: '1200px' }}
      w="100%"
      h="100%"
      direction="column"
      m="20px auto"
      justify="center"
    >
      <Skeleton h="70vh" />
    </Flex>
  )
}

export default ProductPageSkeleton
