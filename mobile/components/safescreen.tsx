import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function SafeScreen ({children} : {children:React.ReactNode}) {
    const insets = useSafeAreaInsets()
    return (
      <View className='flex-1 bg-background' style={{paddingTop:insets.top}}>
        {children}
      </View>
    )
}

export default SafeScreen
