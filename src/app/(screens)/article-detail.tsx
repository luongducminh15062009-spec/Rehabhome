import React, { useMemo, useState, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Heart } from 'iconsax-react-native'
import { Ionicons } from '@expo/vector-icons'
import { ArticlesService } from '@/services/articles.service'
import { useAuth } from '@/context/auth-provider'
import { Database } from '@/types/database.types'
import { getArticleSources } from '@/utils/article-sources'

const { width } = Dimensions.get('window')

type Article = Database['public']['Tables']['articles']['Row']

export default function ArticleDetailScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const params = useLocalSearchParams()
    const articleId = params.id as string

    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)

    // Load article from Supabase
    useEffect(() => {
        loadArticle()
        if (user?.id) {
            checkIfSaved()
        }
    }, [articleId, user])

    const loadArticle = async () => {
        try {
            const data = await ArticlesService.getArticleById(articleId)
            if (data) {
                setArticle(data)
            } else {
                Alert.alert('Lỗi', 'Không tìm thấy bài viết')
                router.back()
            }
        } catch (error) {
            console.error('Error loading article:', error)
            Alert.alert('Lỗi', 'Không thể tải bài viết')
        } finally {
            setLoading(false)
        }
    }

    const checkIfSaved = async () => {
        if (!user?.id) return
        const saved = await ArticlesService.isArticleSaved(user.id, articleId)
        setIsSaved(saved)
    }

    const handleSaveToggle = async () => {
        if (!user?.id) {
            Alert.alert('Thông báo', 'Vui lòng đăng nhập để lưu bài viết')
            return
        }

        try {
            if (isSaved) {
                const success = await ArticlesService.unsaveArticle(user.id, articleId)
                if (success) {
                    setIsSaved(false)
                    Alert.alert('Thành công', 'Đã bỏ lưu bài viết')
                }
            } else {
                const success = await ArticlesService.saveArticle(user.id, articleId)
                if (success) {
                    setIsSaved(true)
                    Alert.alert('Thành công', 'Đã lưu bài viết')
                }
            }
        } catch (error) {
            console.error('Error toggling save:', error)
            Alert.alert('Lỗi', 'Không thể lưu bài viết')
        }
    }

    const sources = useMemo(
        () =>
            article
                ? getArticleSources({
                      title: article.title,
                      content: article.content,
                      category: article.category,
                  })
                : [],
        [article],
    )

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#A78BFA" />
            </View>
        )
    }

    if (!article) {
        return null
    }

    // Parse content as markdown-style sections (skip Sources block — shown separately)
    const renderContent = () => {
        const content = article.content || 'Nội dung đang được cập nhật...'
        const lines = content.split('\n')
        const elements: React.ReactElement[] = []
        let key = 0
        let skippingSources = false

        lines.forEach((line) => {
            if (/^##\s*(Nguồn tham khảo|Sources|References|Tài liệu tham khảo)\s*$/i.test(line.trim())) {
                skippingSources = true
                return
            }
            if (skippingSources) {
                if (line.startsWith('## ')) {
                    skippingSources = false
                } else {
                    return
                }
            }

            if (line.startsWith('## ')) {
                elements.push(
                    <Text key={key++} className="text-lg font-semibold text-slate-900 mt-4 mb-2">
                        {line.replace('## ', '')}
                    </Text>,
                )
            } else if (line.startsWith('### ')) {
                elements.push(
                    <Text key={key++} className="text-base font-semibold text-slate-900 mt-3 mb-2">
                        {line.replace('### ', '')}
                    </Text>,
                )
            } else if (line.startsWith('- ')) {
                elements.push(
                    <View key={key++} className="flex-row mb-2 ml-2">
                        <Text className="text-slate-700 mr-2">•</Text>
                        <Text className="flex-1 text-base text-slate-700 leading-6">
                            {line.replace('- ', '')}
                        </Text>
                    </View>,
                )
            } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                elements.push(
                    <Text key={key++} className="text-base font-semibold text-slate-900 mt-2 mb-1">
                        {line.replace(/\*\*/g, '')}
                    </Text>,
                )
            } else if (line.trim()) {
                elements.push(
                    <Text key={key++} className="text-base text-slate-700 leading-6 mb-3">
                        {line}
                    </Text>,
                )
            }
        })

        return elements
    }

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
          {/* Header Image */}
          <View className="relative">
            <Image
              source={{ uri: article.image_url || 'https://via.placeholder.com/800' }}
              style={{ width, height: width * 0.6 }}
              resizeMode="cover"
            />
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-16 left-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-lg"
            >
              <ArrowLeft size={24} color="#0F172A" />
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveToggle}
              className="absolute top-16 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-lg"
            >
              <Heart
                size={24}
                color={isSaved ? "#EF4444" : "#0F172A"}
                variant={isSaved ? "Bold" : "Outline"}
              />
            </TouchableOpacity>
          </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Content */}
                <View className="px-4 py-6">
                    {/* Category Badge */}
                    <View className="bg-purple-100 dark:bg-purple-900 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            {ArticlesService.getCategoryName(article.category)}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-8">
                        {article.title}
                    </Text>

                    {/* Date */}
                    <Text className="text-sm text-slate-500 mb-4">
                        {new Date(article.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>

                    {/* Health disclaimer — Guideline 1.4.1 */}
                    <View className="mb-5 flex-row items-start gap-2 rounded-2xl bg-[#FFF8E6] px-3 py-3">
                        <Ionicons name="alert-circle" size={16} color="#F59E0B" style={{ marginTop: 2 }} />
                        <Text className="flex-1 text-[12px] leading-5 text-[#637381]">
                            Nội dung mang tính tham khảo về lối sống và dinh dưỡng, không phải tư vấn
                            y tế, không dùng để chẩn đoán hay điều trị. Hãy tham khảo bác sĩ khi cần.
                        </Text>
                    </View>

                    {/* Content - Markdown rendered */}
                    <View className="mb-6">{renderContent()}</View>

                    {/* Citations — Guideline 1.4.1 */}
                    <View className="mb-10 rounded-2xl border border-[#E8ECF0] bg-[#F8FAFC] px-4 py-4">
                        <Text className="text-base font-bold text-[#1A1A1A] mb-1">
                            Nguồn tham khảo
                        </Text>
                        <Text className="text-xs text-[#637381] mb-3">
                            Chạm vào liên kết để xem nguồn gốc thông tin sức khỏe trong bài viết.
                        </Text>
                        {sources.map((source) => (
                            <TouchableOpacity
                                key={source.url}
                                onPress={() => Linking.openURL(source.url)}
                                activeOpacity={0.7}
                                className="flex-row items-start py-2.5 border-t border-[#E8ECF0]"
                            >
                                <Ionicons
                                    name="link-outline"
                                    size={16}
                                    color="#477AFF"
                                    style={{ marginTop: 2, marginRight: 8 }}
                                />
                                <Text className="flex-1 text-sm leading-5 text-[#477AFF] underline">
                                    {source.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
