import { View, Text, Modal, TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { Icon } from './Icon'
import { PrimaryButtonSM } from './PrimaryButton'

const AlertModal = ({
    alertTitle,
    alertMessage,
    onRequestClose,
    ...props
}: AlertModalProps) => {

    const [modalVisible, setModalVisible] = React.useState(!!alertMessage)

    const [description, setDescription] = React.useState(alertMessage)

    useEffect(() => {
        setModalVisible(!!alertMessage)
    }, [alertMessage])

    useEffect(() => {
        if (modalVisible) {
            setDescription(alertMessage)
        }
    }, [modalVisible])

    return (
        <Modal
            {...props}
            transparent
            animationType='fade'
            visible={modalVisible}
            onRequestClose={onRequestClose}
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
                            {alertTitle}
                        </Text>
                        <TouchableHighlight
                            underlayColor={'#e5e7eb'}
                            onPress={onRequestClose}>
                            <Icon name='close' />
                        </TouchableHighlight>
                    </View>
                    <Text className='w-full mt-2 mb-1'>
                        {description ?? 'Alert description not set.'}
                    </Text>
                    <PrimaryButtonSM
                        onPress={onRequestClose}
                        className='mt-3'
                    >
                        Ok
                    </PrimaryButtonSM>
                </View>
            </View>
        </Modal>
    )
}

export default AlertModal

interface AlertModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    alertTitle: string
    alertMessage: string | null
}