import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useEffect, useState } from 'react'
import { Icon } from './Icon'


interface CodeInputProps extends ComponentPropsWithoutRef<typeof TextInput> {
    containerClassName?: string
    type?: 'text' | 'password'
}

const CodeInput = forwardRef<ElementRef<typeof TextInput>, CodeInputProps>(
    ({ className = '', children, containerClassName, value = '', onChangeText, ...props }, forwardedRef) => {

        const [textInputValue, setTextInputValue] = useState(value)

        const [textShown, setTextShown] = useState(() => {
            const result: string[] = Array(6).fill('')
            for (let i = 0; (i < value.length) && (i < 6); i++) {
                result[i] = value[i]
            }
            return result
        })

        useEffect(() => {
            setTextShown(() => {
                const result: string[] = Array(6).fill('')
                for (let i = 0; (i < textInputValue.length) && (i < 6); i++) {
                    result[i] = textInputValue[i]
                }
                return result
            })
        }, [textInputValue])

        const handleChangeText = (newValue: string) => {
            if (onChangeText) {
                onChangeText(newValue)
            }
            setTextInputValue(newValue)
        }

        return (
            <View
                className={`relative flex-row h-[30px] rounded w-44 ${containerClassName}`}
            >
                <View className='absolute w-full h-full  justify-center flex-row space-x-[11px]'>
                    {textShown.map((item, index) => (
                        <Text key={index} className={`w-[15px] text-base text-center font-bold ${!item ? 'border-b-2' : ''}`}>{item}</Text>
                    ))}
                </View>

                <TextInput
                    {...props}
                    ref={forwardedRef}
                    className={`pl-[15px] w-full h-full text-transparent text-[15px] tracking-[17px] font-[monospace] ${className}`}
                    maxLength={6}
                    value={textInputValue}
                    onChangeText={handleChangeText}
                >
                    {children}
                </TextInput>
            </View>
        )
    }
)

export default CodeInput