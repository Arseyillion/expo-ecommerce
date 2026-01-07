import SafeScreen from '@/components/safescreen'
import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

function ProfileScreen() {
    return (
      <SafeScreen>
        <Text className='text-white'> ProfileScreen </Text>
      </SafeScreen>
    )
}

export default ProfileScreen
