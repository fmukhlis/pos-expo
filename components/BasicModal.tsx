import { View, Text, Modal } from 'react-native'
import React from 'react'

const BasicModal = ({
    containerClassName = '',
    children,
    ...props
}: BasicModalProps) => {
    return (
        <Modal
            {...props}
            transparent
        >
            <View className={'flex-1 '}>
                <View
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
                    className={containerClassName}
                >
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default BasicModal

interface BasicModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    containerClassName?: string
}