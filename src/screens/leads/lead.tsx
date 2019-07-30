import * as React from 'react'
import { View, Text } from 'native-base'

export default ({ lead: { id, name, username } }) => {
  return (
    <View>
      <Text>{id}</Text>
      <Text>{name}</Text>
      <Text>{username}</Text>
    </View>
  )
}
