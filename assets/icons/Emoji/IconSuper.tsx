import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconSuper = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Circle cx={20} cy={20} r={20} fill="#F4F6F8" />
      <Path
        fill="#212B36"
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m14.215 25.475-.465-.058a6.25 6.25 0 0 0 6.25 6.25h.833a6.25 6.25 0 0 0 6.25-6.25l-.465.058a50.001 50.001 0 0 1-12.403 0Z"
      />
      <Path
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M10 19.167c1.072-2.605 4.76-2.605 5.833 0M24.167 19.167c1.155-2.477 4.677-2.477 5.833 0"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconSuper
