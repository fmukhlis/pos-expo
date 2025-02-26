import React from "react"
import { ActivityIndicator } from "react-native"
import { useTheme } from "@/contexts/ThemeProvider"
import { Colors } from "@/constants/Colors"

const CustomActivityIndicator = (props: Omit<React.ComponentPropsWithoutRef<typeof ActivityIndicator>, 'color'>) => {
    const { colorScheme } = useTheme()

    return <ActivityIndicator
        {...props}
        color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
    />
}

export default CustomActivityIndicator