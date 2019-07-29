import * as React from 'react'
import { View, Text } from 'native-base'

export default ({ lead }) => {
  return (
    <View>
      <Text>{lead.id}</Text>
      <Text>{lead.name}</Text>
      <Text>{lead.username}</Text>
    </View>
  )
}
