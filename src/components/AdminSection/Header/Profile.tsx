import { Flex, Text, Box, Avatar } from '@chakra-ui/react'

interface ProfileProps {
  showProfileData?: boolean
}

export default function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box>
          <Text>Diego Fernandes</Text>
          <Text color="gray.300" fontSize="small">
            dadsa@gmail.com
          </Text>
        </Box>
      )}
      <Avatar size="md" ml="3" name="Diego Fernandes" />
    </Flex>
  )
}
