import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconHappyActive = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Circle cx={20} cy={20} r={20} fill="#36D4F4" />
      <Path
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M16.667 25.417c1.875 2.5 5.625 2.5 7.5 0M11.667 19.167c.611-2.079 3.555-2.079 4.166 0M24.167 19.167c.667-2.002 3.499-2.002 4.166 0"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconHappyActive
