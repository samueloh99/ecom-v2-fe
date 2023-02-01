import { Stack, Box, Text } from '@chakra-ui/react'

import PaginationItem from './PaginationItem'

interface PaginationProps {
  totalCount: number
  totalPerPage?: number
  currentPage: number
  onPageChange: (page: number) => void
}

const siblingsCount = 1

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1
    })
    .filter(page => page > 0)
}

export function Pagination({
  currentPage = 1,
  onPageChange,
  totalCount,
  totalPerPage = 10
}: PaginationProps) {
  const lastPage = Math.ceil(totalCount / totalPerPage)

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : []

  const nexPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : []

  return (
    <Stack
      direction="row"
      mt="8"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Box>
        <strong>{totalCount}</strong> total
      </Box>
      <Stack direction="row" spacing="2">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            {currentPage > 2 + siblingsCount && <Text>...</Text>}
          </>
        )}

        {previousPages.length > 0 &&
          previousPages.map((page, index) => {
            return (
              <PaginationItem
                key={index}
                onPageChange={onPageChange}
                number={page}
              />
            )
          })}

        <PaginationItem
          onPageChange={onPageChange}
          number={currentPage}
          isCurrent
        />

        {nexPages.length > 0 &&
          nexPages.map((page, index) => {
            return (
              <PaginationItem
                key={index}
                onPageChange={onPageChange}
                number={page}
              />
            )
          })}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && <Text>...</Text>}
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}
      </Stack>
    </Stack>
  )
}
