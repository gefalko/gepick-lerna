import { useMediaQuery } from 'react-responsive'

const breakPoints = {
  mobileTablet: '576px',
  tabletDesktop: '992px',
}

function useBreakPoints() {
  const isMobile = useMediaQuery({ maxWidth: breakPoints.mobileTablet })
  const isMobileOrTablet = useMediaQuery({ maxWidth: breakPoints.tabletDesktop })
  const isTablet = useMediaQuery({ minWidth: breakPoints.mobileTablet, maxWidth: breakPoints.tabletDesktop })
  const isTabletOrDesktop = useMediaQuery({ minWidth: breakPoints.mobileTablet })
  const isDesktop = useMediaQuery({ minWidth: breakPoints.tabletDesktop })
  const isPortrait = useMediaQuery({ orientation: 'portrait' })

  return {
    isMobile,
    isMobileOrTablet,
    isTablet,
    isTabletOrDesktop,
    isDesktop,
    isPortrait,
  }
}

export default useBreakPoints
