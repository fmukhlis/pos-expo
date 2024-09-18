import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'

interface CustomButton extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
    classNames?: string
    isLoading?: boolean
}

const CustomButton = forwardRef<ElementRef<typeof TouchableOpacity>, CustomButton>(({
    children,
    classNames = '',
    ...props
}, forwardedRef) => {

    return (
        <TouchableOpacity
            {...props}
            ref={forwardedRef}
            activeOpacity={0.7}
            className={`bg-light-accent dark:bg-dark-accent justify-center items-center rounded ${classNames} disabled:opacity-50`}
        >
            {children}
        </TouchableOpacity>
    )
})

export default CustomButton