import { createContext, useContext } from "react"

const ThemeContext = createContext<{ colorScheme: 'dark' | 'light' }>({
    colorScheme: 'light',
})

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('The useTheme() hook must be used within an ThemeProvider')
    }
    return context
}

export const ThemeProvider = ThemeContext.Provider