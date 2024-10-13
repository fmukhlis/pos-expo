import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'

const CustomTouchableOpacity = forwardRef<ElementRef<typeof TouchableOpacity>, ComponentPropsWithoutRef<typeof TouchableOpacity>>(({
    children,
    className = '',
    disabled = false,
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            activeOpacity={0.7}
            disabled={disabled}
            className={`border-2 border-l-blue-400 border-t-blue-400 border-b-blue-600 border-r-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${className} ${disabled ? 'opacity-70' : ''}`}
        >
            {children}
        </TouchableOpacity>
    )
})

export default CustomTouchableOpacity