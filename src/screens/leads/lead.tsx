import * as React from 'react';
import { View, Text } from 'native-base';

export default ({ lead }) => {
    return (
        <View>
            <Text>{lead.name}</Text>
            <Text>{lead.parent_name}</Text>
            <Text>{lead.email}</Text>
            <Text>{lead.phone}</Text>
        </View>
    );
};
