import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconAngry = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)" opacity={0.9}>
      <Circle cx={20} cy={20} r={20} fill="#F4F6F8" />
      <Path
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m14.167 27.917.593-.593a8 8 0 0 1 11.313 0l.594.593M9.167 13.333l6.666 2.5M30 13.333l-6.667 2.5M11.667 19.167a2.946 2.946 0 0 0 4.166 0M24.167 19.167a2.946 2.946 0 0 0 4.166 0"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconAngry
