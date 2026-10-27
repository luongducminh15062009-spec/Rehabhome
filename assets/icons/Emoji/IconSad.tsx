import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconSad = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Circle cx={20} cy={20} r={20} fill="#F4F6F8" />
      <Path
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M15.833 27.917c2.271-3.097 6.896-3.097 9.167 0M10.833 19.167a5.033 5.033 0 0 0 5.834 0M24.167 19.167a5.033 5.033 0 0 0 5.833 0"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconSad
