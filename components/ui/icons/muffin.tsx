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
        d="M6.862 3.123a.936.936 0 01-.02-.186 2.793 2.793 0 015.587-.028.938.938 0 01-.018.186l2.935-.014a2.173 2.173 0 012.184 2.162l.007 1.51a2.794 2.794 0 01-.567 5.344l-2.294 6.034a.931.931 0 01-.866.6l-8.193.04a.931.931 0 01-.872-.592l-2.354-6.01a2.794 2.794 0 01-.62-5.34L1.764 5.32a2.172 2.172 0 012.161-2.183l2.937-.014zm1.842-.196a.931.931 0 111.862-.009c0 .064.007.126.02.186l-1.9.01a.935.935 0 00.018-.187zm6.963 2.325l.007 1.303-12.042.06-.006-1.304A.31.31 0 013.935 5l11.42-.056a.31.31 0 01.313.309zm-2.505 11.62l1.798-4.727-10.558.052 1.844 4.709 6.916-.034zM1.908 9.416a.931.931 0 01.926-.935l13.656-.068a.931.931 0 11.009 1.863l-13.656.067a.931.931 0 01-.935-.927z"
        fill={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Muffin'

export const Muffin = React.memo(Icon)
