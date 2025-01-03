import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Icon(props) {
  const { color = 'black', size = 24, ...otherProps } = props

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.029 5.863A5.788 5.788 0 015.785.05l.054 10.992a.578.578 0 01-.575.582l-.29.001L5 16.831c.004.799-.64 1.45-1.44 1.454l-1.272.006a1.446 1.446 0 01-1.453-1.44l-.026-5.206-.41.002a.342.342 0 01-.344-.34L.03 5.862zm2.516 5.773l.024 4.918.694-.004-.024-4.917-.694.003zm-.78-5.781A4.05 4.05 0 014.06 2.183l.038 7.71-2.314.011-.02-4.05z"
        fill={color}
      />
      <Path
        d="M10.245 1.068a.868.868 0 00-1.736.009l.028 5.682 1.129 1.118-.618 7.013a3.188 3.188 0 106.348-.031l-.687-7.007 1.118-1.129-.028-5.682a.868.868 0 00-1.736.009l.024 4.963-1.185 1.197.766 7.818a1.452 1.452 0 11-2.891.014l.69-7.825-1.198-1.185-.024-4.964z"
        fill={color}
      />
      <Path
        d="M13.022 1.055a.868.868 0 00-1.736.008l.02 4.05a.868.868 0 101.736-.008l-.02-4.05z"
        fill={color}
      />
    </Svg>
  )
}

Icon.displayName = 'ForkAndKnife'

export const ForkAndKnife = React.memo(Icon)
