import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

interface PrimaryButton extends Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, 'children'> {
    children?: string | undefined
    isProcessing?: boolean | undefined
}


const PrimaryButtonLG = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryButton>(({
    children = 'Primary Button LG',
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
            className={`min-w-[80px] min-h-[40px] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (
                    <ActivityIndicator size={30} color="#ffffff" />
                )
                : (
                    <Text
                        className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-lg`}
                    >
                        {children}
                    </Text>
                )
            }
        </TouchableOpacity>
    )
})

const PrimaryButton = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryButton>(({
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
            className={`min-w-[70px] min-h-[35px] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (
                    <ActivityIndicator size={25} color="#ffffff" />
                )
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

const PrimaryButtonSM = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryButton>(({
    children = 'Primary Button SM',
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
            className={`min-w-[60px] min-h-[30px] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (
                    <ActivityIndicator size={20} color="#ffffff" />
                )
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
export { PrimaryButtonLG, PrimaryButton, PrimaryButtonSM }