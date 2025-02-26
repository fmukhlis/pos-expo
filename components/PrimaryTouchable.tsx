import React, { ElementRef, forwardRef } from "react"
import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

interface PrimaryTouchable extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
    isProcessing?: boolean | undefined
}


const PrimaryTouchableLG = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryTouchable>(({
    children,
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
                ? (<ActivityIndicator size={30} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})

const PrimaryTouchable = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryTouchable>(({
    children,
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
            className={`border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (<ActivityIndicator size={25} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})

const PrimaryTouchableSM = forwardRef<ElementRef<typeof TouchableOpacity>, PrimaryTouchable>(({
    children,
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
                ? (<ActivityIndicator size={20} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})
export { PrimaryTouchableLG, PrimaryTouchable, PrimaryTouchableSM }