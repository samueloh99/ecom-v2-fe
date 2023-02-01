import React from 'react'

import { Box, useRadio } from '@chakra-ui/react'

const CheckboxCustomized = props => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()
  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        w="auto"
        fontSize={{ base: '10px', lg: '18px' }}
        boxShadow="md"
        _checked={{
          bg: 'black',
          color: 'white',
          borderColor: 'teal.600'
        }}
        _focus={{
          boxShadow: 'none'
        }}
        px={{ base: 2, lg: 5 }}
        py={{ base: 2, lg: 3 }}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default CheckboxCustomized
