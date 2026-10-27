import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from "react-native-svg"
const IconSuperActive = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Circle cx={20} cy={20} r={20} fill="#21EB6C" />
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
      <Path
        fill="#F4F6F8"
        d="M35.803 9.653c.25-.865 1.477-.865 1.727 0a.901.901 0 0 0 1.081.619c.866-.215 1.494.836.87 1.473a.891.891 0 0 0 .004 1.245c.618.63.039 1.694-.819 1.482a.876.876 0 0 0-1.07.685l-.012.06c-.194 1.01-1.64 1.01-1.835 0l-.01-.06a.876.876 0 0 0-1.072-.685c-.857.212-1.437-.852-.819-1.482a.891.891 0 0 0 .005-1.245c-.625-.637.003-1.688.87-1.473a.901.901 0 0 0 1.08-.62Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconSuperActive
