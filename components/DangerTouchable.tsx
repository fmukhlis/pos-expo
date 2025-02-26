import React, { ElementRef, forwardRef } from "react"
import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

interface DangerTouchableProps extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
    isProcessing?: boolean | undefined
}


const DangerTouchableLG = forwardRef<ElementRef<typeof TouchableOpacity>, DangerTouchableProps>(({
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
            className={`min-w-[80px] min-h-[40px] border-2 border-r-rose-400 border-t-rose-400 border-b-rose-600 border-l-rose-600 bg-rose-500 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (<ActivityIndicator size={30} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})

const DangerTouchable = forwardRef<ElementRef<typeof TouchableOpacity>, DangerTouchableProps>(({
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
            className={`border-2 border-r-rose-400 border-t-rose-400 border-b-rose-600 border-l-rose-600 bg-rose-500 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (<ActivityIndicator size={25} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})

const DangerTouchableSM = forwardRef<ElementRef<typeof TouchableOpacity>, DangerTouchableProps>(({
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
            className={`min-w-[60px] min-h-[30px] border-2 border-r-rose-400 border-t-rose-400 border-b-rose-600 border-l-rose-600 bg-rose-500 justify-center items-center rounded ${className} ${(disabled || isProcessing) ? 'opacity-70' : ''}`}
            disabled={disabled || isProcessing}
        >
            {isProcessing
                ? (<ActivityIndicator size={20} color="#ffffff" />)
                : (children)
            }
        </TouchableOpacity>
    )
})
export { DangerTouchableLG, DangerTouchable, DangerTouchableSM }