import React from 'react'

import NextLink from 'next/link'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

import { ChevronRightIcon } from '@chakra-ui/icons'

const Breadcrumbs = ({ slug }) => {
  return (
    <Breadcrumb
      fontSize="14px"
      spacing="8px"
      separator={<ChevronRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink as={NextLink} href="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      {slug.map((item, index) => {
        return (
          <BreadcrumbItem
            textDecoration="underline"
            textTransform="capitalize"
            key={index}
          >
            <BreadcrumbLink as={NextLink[0]} href={slug}>
              {item}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default Breadcrumbs
