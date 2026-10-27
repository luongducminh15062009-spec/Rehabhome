import React from 'react'
import { SvgProps } from 'react-native-svg'
import IconAngry from '~/assets/icons/Emoji/IconAngry'
import IconAngryActive from '~/assets/icons/Emoji/IconAngryActive'
import IconSad from '~/assets/icons/Emoji/IconSad'
import IconSadActive from '~/assets/icons/Emoji/IconSadActive'
import IconNeutral from '~/assets/icons/Emoji/IconNeutral'
import IconNeutralActive from '~/assets/icons/Emoji/IconNeutralActive'
import IconHappy from '~/assets/icons/Emoji/IconHappy'
import IconHappyActive from '~/assets/icons/Emoji/IconHappyActive'
import IconSuper from '~/assets/icons/Emoji/IconSuper'
import IconSuperActive from '~/assets/icons/Emoji/IconSuperActive'
import { MoodLevel } from '@/services/mood.service'

type Props = SvgProps & {
  level: MoodLevel
  active?: boolean
  size?: number
}

const ICONS = {
  1: { inactive: IconAngry, active: IconAngryActive },
  2: { inactive: IconSad, active: IconSadActive },
  3: { inactive: IconNeutral, active: IconNeutralActive },
  4: { inactive: IconHappy, active: IconHappyActive },
  5: { inactive: IconSuper, active: IconSuperActive },
} as const

const MoodIcon = ({ level, active = false, size = 40, ...props }: Props) => {
  const Icon = active ? ICONS[level].active : ICONS[level].inactive
  return (
    <Icon
      width={size}
      height={size}
      viewBox="0 0 40 40"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    />
  )
}

export default MoodIcon
