import React, { useCallback, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { toast } from '@/components/common/ToastManager'
import {
  ChatConversation,
  HealthChatEvents,
  HealthChatService,
} from '@/services/health-chat.service'

const ChatHistoryScreen = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<ChatConversation[]>([])
  const [menuItem, setMenuItem] = useState<ChatConversation | null>(null)
  const [renameItem, setRenameItem] = useState<ChatConversation | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const load = useCallback(async () => {
    if (!user?.id) {
      setItems([])
      return
    }
    setItems(await HealthChatService.listConversations(user.id))
  }, [user?.id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const openChat = (item: ChatConversation) => {
    HealthChatEvents.open(item.id)
    router.back()
  }

  const confirmRename = async () => {
    if (!user?.id || !renameItem) return
    const ok = await HealthChatService.renameConversation(renameItem.id, user.id, renameValue)
    if (!ok) {
      toast.error('Lỗi', 'Không thể đổi tên đoạn chat.')
      return
    }
    setRenameItem(null)
    load()
  }

  const removeChat = async (item: ChatConversation) => {
    if (!user?.id) return
    const ok = await HealthChatService.deleteConversation(item.id, user.id)
    setMenuItem(null)
    if (!ok) {
      toast.error('Lỗi', 'Không thể xóa đoạn chat.')
      return
    }
    HealthChatEvents.open(null)
    load()
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3F7FB]" edges={['top']}>
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-gray-900 mr-12">
          Lịch sử chat
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => openChat(item)}
            activeOpacity={0.85}
            className="bg-white rounded-full px-5 h-14 mb-3 flex-row items-center"
          >
            <Text className="flex-1 text-base text-gray-900 mr-3" numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => setMenuItem(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color="#64748B" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        {items.length === 0 && (
          <Text className="text-center text-secondary mt-16">Chưa có đoạn chat nào</Text>
        )}
      </ScrollView>

      <Modal visible={!!menuItem} transparent animationType="fade" onRequestClose={() => setMenuItem(null)}>
        <Pressable className="flex-1 bg-black/40 items-center justify-center px-8" onPress={() => setMenuItem(null)}>
          <Pressable className="w-full bg-white rounded-3xl p-4" onPress={(event) => event.stopPropagation()}>
            <TouchableOpacity
              onPress={() => setMenuItem(null)}
              className="absolute top-3 right-3 z-10"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!menuItem) return
                setRenameValue(menuItem.title)
                setRenameItem(menuItem)
                setMenuItem(null)
              }}
              className="h-12 rounded-2xl border border-[#E5E7EB] flex-row items-center justify-center mb-3 mt-6"
            >
              <Ionicons name="create-outline" size={18} color="#334155" />
              <Text className="ml-2 text-base text-gray-900">Đổi tên đoạn chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => menuItem && removeChat(menuItem)}
              className="h-12 rounded-2xl border border-[#FECACA] flex-row items-center justify-center"
            >
              <Ionicons name="trash-outline" size={18} color="#F04438" />
              <Text className="ml-2 text-base text-[#F04438]">Xóa đoạn chat</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={!!renameItem}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameItem(null)}
      >
        <Pressable
          className="flex-1 bg-black/40 items-center justify-center px-8"
          onPress={() => setRenameItem(null)}
        >
          <Pressable className="w-full bg-white rounded-3xl p-5" onPress={(event) => event.stopPropagation()}>
            <TouchableOpacity
              onPress={() => setRenameItem(null)}
              className="absolute top-4 right-4"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900 text-center mb-5 mt-2">
              Đổi tên đoạn chat
            </Text>
            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              className="h-12 rounded-2xl border border-[#E5E7EB] px-4 text-base text-gray-900 mb-4"
            />
            <TouchableOpacity
              onPress={confirmRename}
              activeOpacity={0.85}
              className="h-12 rounded-2xl bg-primary-main items-center justify-center"
            >
              <Text className="text-base font-semibold text-white">Xác nhận</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default ChatHistoryScreen
