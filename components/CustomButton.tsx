import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'

interface CustomButton extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
    classNames?: string
}

const CustomButton = forwardRef<ElementRef<typeof TouchableOpacity>, CustomButton>(({
    children,
    classNames = '',
    disabled = false,
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            disabled={disabled}
            activeOpacity={0.7}
            className={`border-2 border-l-blue-400 border-t-blue-400 border-b-blue-600 border-r-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${classNames} ${disabled ? 'opacity-70' : ''}`}
        >
            {children}
        </TouchableOpacity>
    )
})

export default CustomButton