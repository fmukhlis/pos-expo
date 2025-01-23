import { View, Text, Modal } from 'react-native'
import React from 'react'

const PermissionModal = () => {
    return (
        <Modal
            visible

        >
            <View className='flex-1 justify-center items-center'>
                <View>
                    <Text>Create Permission</Text>
                </View>
            </View>
        </Modal>
    )
}

export default PermissionModal