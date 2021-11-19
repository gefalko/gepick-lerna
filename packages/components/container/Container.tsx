import React from 'react'
import { pickBy } from 'lodash'
import { JustifyContentProperty, AlignItemsProperty, AlignSelfProperty, PositionProperty } from 'csstype'
import { isDefined } from '@gepick/utils/src/utils'

interface IProps {
  inline?: boolean
  lineHeight?: number
  overflow?: string
  overflowX?: string
  overflowY?: string
  marginTop?: number
  margin?: number
  marginBottom?: number
  marginRight?: number
  opacity?: number
  marginLeft?: number
  bottom?: number
  borderRadius?: string | number
  minWidth?: number
  width?: number | string
  maxWidth?: number
  height?: number | string
  minHeight?: number | string
  maxHeight?: number | string
  padding?: number | string
  paddingTop?: number
  paddingLeft?: number
  paddingRight?: number
  paddingBottom?: number
  cursor?: string
  color?: string
  justifyContent?: JustifyContentProperty
  justifyContentEnd?: boolean
  justifyContentCenter?: boolean
  justifyContentSpaceBetween?: boolean
  alignItems?: AlignItemsProperty
  alignItemsCenter?: boolean
  alignItemsStretch?: boolean
  alignSelf?: AlignSelfProperty
  flex?: boolean
  flexGrow?: number
  flexDirectionColumn?: boolean
  flexDirectionRowReverse?: boolean
  flexDirectionColumnReverse?: boolean
  fullHeight?: boolean
  fullWidth?: boolean
  position?: PositionProperty
  noWrap?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: React.MouseEventHandler
  'data-cy'?: string
  'data-onboarding'?: string
  centered?: boolean
  center?: boolean
  absoluteTopLeft?: boolean
  fixedTopRight?: boolean
  absoluteBottom?: boolean
  background?: string
  textAlignRight?: boolean
  textAlignLeft?: boolean
  textAlignCenter?: boolean
  id?: string
}

const Container = (props: IProps) => {
  const styles = React.useMemo(() => {
    let stylesObj = pickBy(
      {
        lineHeight: props.lineHeight ? `${props.lineHeight}px` : undefined,
        overflow: props.overflow,
        overflowX: props.overflowX,
        overflowY: props.overflowY,
        margin: props.margin,
        opacity: props.opacity,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginRight: props.marginRight,
        marginLeft: props.marginLeft,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        alignSelf: props.alignSelf,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        width: props.width,
        flexGrow: props.flexGrow,
        height: props.height,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
        position: props.position,
        bottom: props.bottom,
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        paddingBottom: props.paddingBottom,
        cursor: props.cursor,
        borderRadius: props.borderRadius,
        background: props.background,
        color: props.color,
      },
      isDefined,
    )

    if (props.flex) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexWrap: 'wrap' })
    }

    if (props.alignItemsCenter) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', alignItems: 'center' })
    }

    if (props.alignItemsStretch) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', alignItems: 'stretch' })
    }

    if (props.justifyContentCenter) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' })
    }

    if (props.justifyContentEnd) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' })
    }

    if (props.justifyContentSpaceBetween) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' })
    }

    if (props.fullHeight) {
      stylesObj = Object.assign(stylesObj, { height: '100%' })
    }

    if (props.fullWidth) {
      stylesObj = Object.assign(stylesObj, { width: '100%' })
    }

    if (props.flexDirectionColumn) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexWrap: 'wrap', flexDirection: 'column' })
    }

    if (props.flexDirectionRowReverse) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexDirection: 'row-reverse' })
    }

    if (props.flexDirectionColumnReverse) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexDirection: 'column-reverse' })
    }

    if (props.noWrap) {
      stylesObj = Object.assign(stylesObj, { flexWrap: 'nowrap' })
    }

    if (props.inline) {
      stylesObj = Object.assign(stylesObj, { display: 'inline-block' })
    }

    if (props.centered) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', aliginItems: 'center', justifyContent: 'center' })
    }

    if (props.center) {
      stylesObj = Object.assign(stylesObj, { display: 'flex', flexDirection: 'column', justifyContent: 'center' })
    }

    if (props.absoluteTopLeft) {
      stylesObj = Object.assign(stylesObj, { position: 'absolute', top: 0, left: 0 })
    }

    if (props.fixedTopRight) {
      stylesObj = Object.assign(stylesObj, { position: 'fixed', top: 0, right: 0 })
    }

    if (props.absoluteBottom) {
      stylesObj = Object.assign(stylesObj, { position: 'absolute', bottom: 0 })
    }

    if (props.textAlignRight) {
      stylesObj = Object.assign(stylesObj, { textAlign: 'right' })
    }

    if (props.textAlignLeft) {
      stylesObj = Object.assign(stylesObj, { textAlign: 'left' })
    }

    if (props.textAlignCenter) {
      stylesObj = Object.assign(stylesObj, { textAlign: 'center' })
    }

    if (props.style) {
      stylesObj = Object.assign(stylesObj, props.style)
    }

    return stylesObj
  }, [props])

  return (
    <div
      onClick={props.onClick}
      id={props.id}
      className={props.className}
      style={styles}
      data-onboarding={props['data-onboarding']}
      data-cy={props['data-cy']}
    >
      {props.children}
    </div>
  )
}

export default React.memo(Container)
