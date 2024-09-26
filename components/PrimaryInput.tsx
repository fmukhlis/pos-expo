import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useState } from 'react'
import { Icon } from './Icon'


interface PrimaryInputProps extends ComponentPropsWithoutRef<typeof TextInput> {
    containerClassName?: string
    type?: 'text' | 'password'
}

const PrimaryInput = forwardRef<ElementRef<typeof TextInput>, PrimaryInputProps>(
    ({ className, children, containerClassName, type = 'text', ...props }, forwardedRef) => {

        const [isPasswordShowed, setIsPasswordShowed] = useState(false)

        const handleShowPasswordPressed = () => {
            setIsPasswordShowed((prev) => (!prev))
        }

        return (
            <View
                className={`bg-light-secondaryBackground dark:bg-dark-tertiaryBackground pl-4 flex-row rounded items-center border border-light-tertiaryBackground dark:border-dark-secondaryText focus:border-light-primaryText dark:focus:border-dark-primaryText ${containerClassName}`}
            >
                <TextInput
                    {...props}
                    ref={forwardedRef}
                    className={`peer text-light-primaryText dark:text-dark-primaryText flex-1 ${className}`}
                    secureTextEntry={type === 'password' && !isPasswordShowed}
                >
                    {children}
                </TextInput>
                {type === 'password' &&
                    <TouchableOpacity
                        className='h-full justify-center px-4'
                        onPress={handleShowPasswordPressed}
                        activeOpacity={0.7}
                    >
                        <Icon size={20} className='text-light-secondaryText dark:text-dark-secondaryText' name={isPasswordShowed ? 'eye-off-outline' : 'eye-outline'} />
                    </TouchableOpacity>
                }
            </View>
        )
    }
)

export default PrimaryInput