import React from 'react'
import Container from '../container/Container'
import Link from '../link/Link'

interface IBreadcrumbItem {
  url: string
  title: string
}

interface IProps {
  breadcrumb?: IBreadcrumbItem[]
  title: string
}

function toItem(breadcrumbItem: IBreadcrumbItem, key: number) {
  return (
    <Container key={key} flex>
      <Container>
        <Link underline href={breadcrumbItem.url}>
          <b>{breadcrumbItem.title}</b>
        </Link>
      </Container>
      <Container marginRight={4} marginLeft={4}>
        &gt;
      </Container>
    </Container>
  )
}

const Breadcrumb: React.FunctionComponent<IProps> = (props) => {
  return (
    <Container flex>
      {(props.breadcrumb ?? []).map(toItem)}
      <span>{props.title}</span>
    </Container>
  )
}

export default React.memo(Breadcrumb)
