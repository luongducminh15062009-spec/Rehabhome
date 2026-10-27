import type { Icon } from 'iconsax-react-native'

export interface MenuItem {
  icon: Icon
  label: string
  route?: string
  onPress?: () => void
  variant?: 'default' | 'danger'
  showChevron?: boolean
  toggle?: {
    value: boolean
    onValueChange: (value: boolean) => void
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
}
