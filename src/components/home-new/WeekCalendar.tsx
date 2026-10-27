import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

type DayItem = {
  day: string
  date: number
  fullDate: string
}

type Props = {
  selectedDate?: string
  onDateSelect?: (date: string) => void
}

const WeekCalendar = ({ selectedDate: controlledDate, onDateSelect }: Props) => {
  const scrollViewRef = useRef<ScrollView>(null)

  const isToday = (fullDate: string) => {
    const today = new Date().toISOString().split('T')[0]
    return fullDate === today
  }

  const getAllDates = (): DayItem[] => {
    const today = new Date()
    const dates: DayItem[] = []
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    for (let i = 15; i >= 1; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      })
    }

    dates.push({
      day: dayNames[today.getDay()],
      date: today.getDate(),
      fullDate: today.toISOString().split('T')[0],
    })

    for (let i = 1; i <= 15; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      })
    }

    return dates
  }

  const [allDates] = useState<DayItem[]>(getAllDates())
  const [selectedDate, setSelectedDate] = useState<string>(
    controlledDate || new Date().toISOString().split('T')[0],
  )
  const todayIndex = allDates.findIndex((item) => isToday(item.fullDate))

  useEffect(() => {
    if (controlledDate) setSelectedDate(controlledDate)
  }, [controlledDate])

  useEffect(() => {
    if (scrollViewRef.current && todayIndex >= 0) {
      setTimeout(() => {
        const itemWidth = 56
        const scrollPosition = Math.max(0, todayIndex * itemWidth - 100)
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true })
      }, 100)
    }
  }, [todayIndex])

  const handleDatePress = (date: string) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 4 }}
      decelerationRate="fast"
      className="mb-5"
    >
      {allDates.map((item, index) => {
        const selected = item.fullDate === selectedDate

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleDatePress(item.fullDate)}
            className="items-center justify-center mr-2"
            activeOpacity={0.7}
          >
            <View
              className={`items-center justify-center w-12 h-[68px] rounded-2xl ${
                selected ? 'bg-white' : 'bg-white/40'
              }`}
              style={
                selected
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      elevation: 3,
                    }
                  : undefined
              }
            >
              <Text
                className={`text-xs mb-1 ${selected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
              >
                {item.day}
              </Text>
              <Text className={`text-lg font-bold ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.date}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

export default WeekCalendar
