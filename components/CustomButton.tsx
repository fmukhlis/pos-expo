import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'

interface CustomButton extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
    classNames?: string
    isLoading?: boolean
}

const CustomButton = forwardRef<ElementRef<typeof TouchableOpacity>, CustomButton>(({
    children,
    classNames = '',
    isLoading = false,
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            activeOpacity={0.7}
            className={`justify-center items-center h-[55px] rounded ${classNames} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            {children}
        </TouchableOpacity>
    )
})

export default CustomButton