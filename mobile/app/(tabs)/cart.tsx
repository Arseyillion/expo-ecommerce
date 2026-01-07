import SafeScreen from '@/components/safescreen'
import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

function CartScreen() {
    return (
      <SafeScreen>
        <Text className='text-white'> CartScreen </Text>
      </SafeScreen>
    )
}

export default CartScreen
