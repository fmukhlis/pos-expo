import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

interface DangerButton extends Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, 'children'> {
    children?: string | undefined
    isProcessing?: boolean | undefined
}

const DangerButtonLG = forwardRef<ElementRef<typeof TouchableOpacity>, DangerButton>(({
    children = 'Danger Button LG',
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
            className={`min-w-[80px] min-h-[40px] border-2 border-r-rose-500 border-t-rose-500 border-b-rose-700 border-l-rose-700 bg-rose-600 dark:bg-rose-400 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? <ActivityIndicator size={30} color="#ffffff" />
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

const DangerButton = forwardRef<ElementRef<typeof TouchableOpacity>, DangerButton>(({
    children = 'Danger Button',
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
            className={`min-w-[70px] min-h-[35px] border-2 border-r-rose-500 border-t-rose-500 border-b-rose-700 border-l-rose-700 bg-rose-600 dark:bg-rose-400 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
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

const DangerButtonSM = forwardRef<ElementRef<typeof TouchableOpacity>, DangerButton>(({
    children = 'Danger Button SM',
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
            className={`min-w-[60px] min-h-[30px] border-2 border-r-rose-500 border-t-rose-500 border-b-rose-700 border-l-rose-700 bg-rose-600 dark:bg-rose-400 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
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
export { DangerButtonLG, DangerButton, DangerButtonSM }