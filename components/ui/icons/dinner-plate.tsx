import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Icon(props) {
  const { color = 'black', size = 24, ...otherProps } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.322 2.056a1.578 1.578 0 01-.345.647 7.61 7.61 0 014.031 8.776l-.241.92a.317.317 0 01-.387.225L.278 8.92a.317.317 0 01-.226-.387l.242-.92a7.61 7.61 0 017.94-5.653 1.585 1.585 0 113.088.095zM9.71 1.96a.317.317 0 10.161-.613.317.317 0 00-.16.613zm3.587 8.414A5.706 5.706 0 002.328 7.493l10.968 2.88zM.4 14.838a1.268 1.268 0 011.225-1.568l12.003-.059a1.268 1.268 0 011.241 1.555l-.65 2.793a1.268 1.268 0 01-1.228.98l-10.676.053a1.268 1.268 0 01-1.238-.968L.4 14.838zm2.407 1.85l-.37-1.52 10.398-.051-.355 1.523-9.673.047z"
        fill={color}
      />
    </Svg>
  )
}

Icon.displayName = 'DinnerPlate'

export const DinnerPlate = React.memo(Icon)
