import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SearchNormal1, Notification } from 'iconsax-react-native'
import { useRouter } from 'expo-router'
import { ArticlesService } from '@/services/articles.service'
import { useNotifications } from '@/context/notification-provider'
import { Database } from '@/types/database.types'
import { images } from '@/constants'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2.3

type Article = Database['public']['Tables']['articles']['Row']

type Category = {
  id: string
  title: string
  articles: Article[]
}

/** Background image is always light — avoid dark: text/bg classes here. */
const ArticleCard = ({ article }: { article: Article }) => {
  const router = useRouter()

  return (
    <TouchableOpacity
      className="mr-3"
      style={{ width: CARD_WIDTH }}
      onPress={() => {
        router.push({
          pathname: '/(screens)/article-detail',
          params: { id: article.id },
        })
      }}
    >
      <Image
        source={{ uri: article.image_url || 'https://via.placeholder.com/400' }}
        className="w-full h-32 rounded-2xl mb-2"
        resizeMode="cover"
      />
      <Text className="text-sm font-medium text-[#1A1A1A]" numberOfLines={2}>
        {article.title}
      </Text>
    </TouchableOpacity>
  )
}

const CategorySection = ({ category }: { category: Category }) => {
  const router = useRouter()

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3 px-4">
        <Text className="text-2xl font-semibold text-[#1A1A1A]">{category.title}</Text>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(screens)/category-detail',
              params: { id: category.id },
            })
          }}
        >
          <Text className="text-sm font-medium text-[#477AFF]">Xem thêm</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {category.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ScrollView>
    </View>
  )
}

export default function ArticlesScreen() {
  const router = useRouter()
  const { unreadCount } = useNotifications()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [searching, setSearching] = useState(false)

  const loadArticles = async () => {
    try {
      const articlesByCategory = await ArticlesService.getAllArticles()

      const categoryList: Category[] = [
        {
          id: 'nutrition',
          title: 'Dinh dưỡng',
          articles: articlesByCategory.nutrition,
        },
        {
          id: 'home_workout',
          title: 'Lối sống',
          articles: articlesByCategory.home_workout,
        },
        {
          id: 'cooking_tips',
          title: 'Mẹo nấu ăn',
          articles: articlesByCategory.cooking_tips,
        },
      ]

      setCategories(categoryList)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    try {
      const results = await ArticlesService.searchArticles(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching articles:', error)
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadArticles()
  }

  if (loading) {
    return (
      <ImageBackground source={images.bgNews} className="flex-1" resizeMode="cover">
        <SafeAreaView className="flex-1" edges={['top']}>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        </SafeAreaView>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground source={images.bgNews} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-[#1A1A1A]">Bài viết</Text>
            <TouchableOpacity
              className="relative"
              onPress={() => router.push('/(screens)/notifications')}
            >
              <Notification size={24} color="#1A1A1A" variant="Outline" />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-cyan-500 rounded-full items-center justify-center px-1">
                  <Text className="text-white text-xs font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center bg-white rounded-full px-4 py-3 border border-[#EEF1F4]">
            <SearchNormal1 size={20} color="#94A3B8" variant="Outline" />
            <TextInput
              className="flex-1 ml-2 text-[#1A1A1A]"
              placeholder="Tìm kiếm..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#A78BFA"
              colors={['#A78BFA']}
            />
          }
        >
          {searching ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#A78BFA" />
            </View>
          ) : searchQuery ? (
            <View className="px-4">
              <Text className="text-lg font-semibold text-[#1A1A1A] mb-4">
                Kết quả tìm kiếm ({searchResults.length})
              </Text>
              {searchResults.length === 0 ? (
                <Text className="text-center text-[#637381] py-8">
                  Không tìm thấy bài viết phù hợp
                </Text>
              ) : (
                searchResults.map((article) => (
                  <TouchableOpacity
                    key={article.id}
                    className="bg-white rounded-2xl p-4 mb-3 flex-row"
                    onPress={() => {
                      router.push({
                        pathname: '/(screens)/article-detail',
                        params: { id: article.id },
                      })
                    }}
                  >
                    <Image
                      source={{ uri: article.image_url || 'https://via.placeholder.com/400' }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="flex-1 ml-3">
                      <Text
                        className="text-base font-semibold text-[#1A1A1A] mb-1"
                        numberOfLines={2}
                      >
                        {article.title}
                      </Text>
                      <Text className="text-sm text-[#637381]">
                        {ArticlesService.getCategoryName(article.category)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          ) : (
            categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}
