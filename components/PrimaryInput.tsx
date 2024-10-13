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
                className={`relative bg-light-secondaryBackground dark:bg-dark-tertiaryBackground px-3 flex-row rounded items-center border border-light-secondaryText/30 dark:border-dark-secondaryText/30 focus:border-light-secondaryText/70 dark:focus:border-dark-secondaryText/80 ${containerClassName}`}
            >
                <TextInput
                    {...props}
                    ref={forwardedRef}
                    className={`text-base text-light-primaryText dark:text-dark-primaryText flex-1 ${className}`}
                    secureTextEntry={type === 'password' && !isPasswordShowed}
                >
                    {children}
                </TextInput>
                {type === 'password' &&
                    <TouchableOpacity
                        className='absolute right-0 items-center w-[50px] h-5/6 justify-center bg-light-secondaryBackground dark:bg-dark-tertiaryBackground border-l border-light-secondaryText/30 dark:border-dark-secondaryText/30'
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