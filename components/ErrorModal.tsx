import { View, Text, Modal, TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { Icon } from './Icon'
import { PrimaryButton } from './PrimaryButton'

const ErrorModal = ({
    onVisibleChange,
    onRequestClose,
    errorMessage,
    ...props
}: ErrorModal) => {

    const [modalVisible, setModalVisible] = React.useState(errorMessage !== '')

    useEffect(() => {
        setModalVisible(errorMessage !== '')
    }, [errorMessage])

    return (
        <Modal
            {...props}
            transparent
            animationType='fade'
            visible={modalVisible}
            onRequestClose={(event) => {
                if (onRequestClose) {
                    onRequestClose(event)
                } else {
                    if (onVisibleChange) {
                        onVisibleChange(false)
                    }
                }
            }}
        >
            <View
                className='flex-1 items-center justify-center'
            >
                <View
                    className='px-5 py-4 bg-white rounded w-[300] items-center'
                    style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                >
                    <View className='w-full flex-row justify-between'>
                        <Text className='text-xl font-bold'>
                            Error
                        </Text>
                        <TouchableHighlight
                            underlayColor={'#e5e7eb'}
                            onPress={() => {
                                if (onVisibleChange) {
                                    onVisibleChange(false)
                                }
                            }}>
                            <Icon name='close' />
                        </TouchableHighlight>
                    </View>
                    <Text className='w-full mt-2 mb-1'>
                        {errorMessage}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default ErrorModal

interface ErrorModal extends React.ComponentPropsWithoutRef<typeof Modal> {
    onVisibleChange: (visible: boolean) => void
    errorMessage: string
}