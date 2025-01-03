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
        d="M7.096 1.757A1.07 1.07 0 105.329.548l-.992 1.45a1.07 1.07 0 001.767 1.208l.992-1.45zM11.518 1.735A1.07 1.07 0 109.752.526l-.992 1.45a1.07 1.07 0 101.767 1.209l.992-1.45zM15.662.226c.488.333.613 1 .28 1.487l-.992 1.45a1.07 1.07 0 01-1.767-1.209l.992-1.45a1.07 1.07 0 011.487-.278z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.168 5.748a2.14 2.14 0 00-2.13 2.15l.005.857c.027 5.517 4.52 9.967 10.038 9.94a9.966 9.966 0 007.535-3.489l1.295.06a3.877 3.877 0 001.097-7.64 2.14 2.14 0 00-2.143-1.956l-15.697.078zM17.875 7.81L2.18 7.888l.004.856a7.848 7.848 0 1015.697-.077l-.005-.856zm1.135 5.317h-.02c.494-.999.826-2.091.961-3.243a1.737 1.737 0 01-.941 3.243z"
        fill={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Coffee'

export const Coffee = React.memo(Icon)
