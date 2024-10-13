import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

interface SecondaryButton extends Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, 'children'> {
    children?: string | undefined
    isProcessing?: boolean | undefined
}

const SecondaryButton = forwardRef<ElementRef<typeof TouchableOpacity>, SecondaryButton>(({
    children = 'Primary Button',
    className = '',
    disabled = false,
    isProcessing = false,
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            activeOpacity={0.7}
            className={`min-w-[70px] min-h-[35px] border-2 border-r-gray-400 border-t-gray-400 border-b-gray-600 border-l-gray-600 bg-gray-500 dark:bg-dark-gray-300 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? <ActivityIndicator size={25} color="#ffffff" />
                : (
                    <Text
                        className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-base`}
                    >
                        {children}
                    </Text>
                )
            }
        </TouchableOpacity>
    )
})

const SecondaryButtonSM = forwardRef<ElementRef<typeof TouchableOpacity>, SecondaryButton>(({
    children = 'Primary Button',
    className = '',
    disabled = false,
    isProcessing = false,
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            activeOpacity={0.7}
            className={`min-w-[60px] min-h-[30px] border-2 border-r-gray-400 border-t-gray-400 border-b-gray-600 border-l-gray-600 bg-gray-500 dark:bg-gray-300 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? <ActivityIndicator size={20} color="#ffffff" />
                : (
                    <Text
                        className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-sm`}
                    >
                        {children}
                    </Text>
                )
            }
        </TouchableOpacity>
    )
})
export { SecondaryButton, SecondaryButtonSM }