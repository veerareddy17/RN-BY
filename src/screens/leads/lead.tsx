import * as React from 'react';
import { View, Text, Card, CardItem, Icon } from 'native-base';

export default ({ lead }) => {
    return (
        <View>
            {/* <Text>{lead.name}</Text>
            <Text>{lead.parent_name}</Text>
            <Text>{lead.email}</Text>
            <Text>{lead.phone}</Text> */}

            <Card>
              <CardItem header>
                <Text style={{ fontWeight: 'bold' }}>{lead.name}</Text>
              </CardItem>
              <CardItem>
                  <View style={{flexDirection:'row'}}>
                  <Icon name='calculator' />
                  <Text>{lead.phone}</Text>
                  <Icon name='paper-plane' />
                  <Text>{lead.email}</Text>
                  </View>
              </CardItem>
            </Card>
        </View>
    );
};
