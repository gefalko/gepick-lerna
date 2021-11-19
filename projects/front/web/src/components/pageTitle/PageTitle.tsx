import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import ReactGA from 'react-ga'
import { useLocation } from 'react-router-dom'

interface IProps {
  pageTitle: string
  description?: string
  quote?: string
  hashtag?: string
}

const PageTitle: React.FunctionComponent<IProps> = (props) => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname + '/' + location.search)

    // eslint-disable-next-line
  }, [])

  const currentUrl = 'https://www.gepick.com' + location.pathname
  const image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuzRSc-ubBJp7a2ZNPCGsM-r5ZzLNY6xMAkQ&usqp=CAU'

  return (
    <Helmet>
      <title>Gepick - {props.pageTitle}</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="csrf_token" content="" />
      <meta property="type" content="website" />
      <meta property="url" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="_token" content="" />
      <meta name="robots" content="noodp" />
      <meta property="title" content={props.pageTitle} />
      <meta property="quote" content={props.quote} />
      {props.description && <meta name="description" content={props.description} />}
      <meta property="image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.pageTitle} />
      {props.quote && <meta property="og:quote" content={props.quote} />}
      {props.hashtag && <meta property="og:hashtag" content={props.hashtag} />}
      <meta property="og:image" content={image} />
      <meta content="image/*" property="og:image:type" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="gepick" />
      {props.description && <meta property="og:description" content={props.description} />}
    </Helmet>
  )
}

export default PageTitle
