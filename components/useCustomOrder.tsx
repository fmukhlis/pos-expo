import React, { useState } from 'react'

export default function useCustomOrder() {

    const [currentInput, setCurrentInput] = useState('')
    const [note, setNote] = useState('')

    const addToSale = () => {

    }

    console.log(currentInput)
    const updateCurrentInput = (value: string) => {
        setCurrentInput((prev) => {
            if (prev.length >= 9) {
                return (prev)
            }
            if (value === '0' && prev === '') {
                return (prev)
            }
            return (prev + value)
        })
    }

    const updateNote = (value: string) => {
        setNote(value)
    }

    const clearCurrentInput = () => {
        setCurrentInput('')
    }

    return {
        addToSale,
        clearCurrentInput,
        currentInput,
        note,
        updateCurrentInput,
        updateNote,
    }
}
