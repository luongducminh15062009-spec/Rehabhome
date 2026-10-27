import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

interface NumericStepperProps {
    value: number
    onChange: (value: number) => void
    unit: string
    step?: number
    min?: number
    max?: number
    decimalPlaces?: number
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const formatValue = (value: number, decimalPlaces: number) =>
    decimalPlaces > 0 ? value.toFixed(decimalPlaces) : String(Math.round(value))

const NumericStepper: React.FC<NumericStepperProps> = ({
    value,
    onChange,
    unit,
    step = 1,
    min = 0,
    max = 999,
    decimalPlaces = 0,
}) => {
    const [text, setText] = useState(formatValue(value, decimalPlaces))
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (!isEditing) {
            setText(formatValue(value, decimalPlaces))
        }
    }, [value, decimalPlaces, isEditing])

    const commitText = (raw: string) => {
        const normalized = raw.replace(',', '.').trim()
        const parsed = Number(normalized)

        if (!normalized || Number.isNaN(parsed)) {
            setText(formatValue(value, decimalPlaces))
            return
        }

        const next = Number(clamp(parsed, min, max).toFixed(decimalPlaces))
        onChange(next)
        setText(formatValue(next, decimalPlaces))
    }

    const handleIncrement = () => {
        const newValue = Number(clamp(value + step, min, max).toFixed(decimalPlaces))
        onChange(newValue)
    }

    const handleDecrement = () => {
        const newValue = Number(clamp(value - step, min, max).toFixed(decimalPlaces))
        onChange(newValue)
    }

    return (
        <View className="items-center justify-center py-12">
            <View className="flex-row items-center gap-8">
                <TouchableOpacity
                    onPress={handleDecrement}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
                    disabled={value <= min}
                >
                    <Text className="text-2xl text-gray-600">−</Text>
                </TouchableOpacity>

                <View className="items-center min-w-[140px]">
                    <TextInput
                        value={text}
                        onChangeText={(next) => {
                            const allowed =
                                decimalPlaces > 0
                                    ? next.replace(/[^0-9.,]/g, '')
                                    : next.replace(/[^0-9]/g, '')
                            setText(allowed)
                        }}
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => {
                            setIsEditing(false)
                            commitText(text)
                        }}
                        onSubmitEditing={() => commitText(text)}
                        keyboardType={decimalPlaces > 0 ? 'decimal-pad' : 'number-pad'}
                        selectTextOnFocus
                        textAlign="center"
                        className="text-6xl font-bold text-primary py-0 min-w-[140px]"
                        style={{ lineHeight: 72 }}
                    />
                    <Text className="text-sm text-gray-500 mt-2">({unit})</Text>
                    <Text className="text-xs text-gray-400 mt-1">Chạm để nhập số</Text>
                </View>

                <TouchableOpacity
                    onPress={handleIncrement}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
                    disabled={value >= max}
                >
                    <Text className="text-2xl text-gray-600">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NumericStepper
