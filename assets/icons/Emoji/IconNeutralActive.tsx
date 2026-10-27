import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconNeutralActive = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Circle cx={20} cy={20} r={20} fill="#FBC02D" />
      <Path
        stroke="#212B36"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M15.833 27.917H25"
      />
      <Circle cx={26.667} cy={20} r={1.667} fill="#212B36" />
      <Circle cx={26.667} cy={20} r={1.667} fill="#212B36" />
      <Circle cx={26.667} cy={20} r={1.667} fill="#212B36" />
      <Circle cx={14.167} cy={20} r={1.667} fill="#212B36" />
      <Circle cx={14.167} cy={20} r={1.667} fill="#212B36" />
      <Circle cx={14.167} cy={20} r={1.667} fill="#212B36" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconNeutralActive
