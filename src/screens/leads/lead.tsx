import * as React from 'react';
import { View, Text, Card, CardItem, Icon, Button, ListItem } from 'native-base';

export default ({ lead }) => {
  return (
    <View>
      {/* <Text>{lead.name}</Text>
            <Text>{lead.parent_name}</Text>
            <Text>{lead.email}</Text>
            <Text>{lead.phone}</Text> */}

      <Card>
    
        <CardItem header style={{flexDirection:'row'}}>
          <Text style={{ fontWeight: 'bold' }}>{lead.name}</Text>
          <Button rounded small style={{backgroundColor:'purple'}}>
            <Text>{lead.class_name}</Text>
          </Button>
          <Icon type='FontAwesome' name='pencil' style={{position:'absolute', right:0}}/>
        </CardItem>
        <CardItem>
          <View style={{ flexDirection: 'row' }}>
            <Icon name='calculator' />
            <Text>{lead.phone}</Text>
            <Icon name='paper-plane' />
            <Text>{lead.email}</Text>
          </View>
        </CardItem>
        <CardItem>
          <View style={{ flexDirection: 'row' }}>
            <Text>School Board</Text>
            <Text style={{marginLeft:100}}>School</Text>
          </View>
        </CardItem>
        <CardItem>
          <View style={{ flexDirection: 'row' }}>
            <Text>{lead.school_board}</Text>
            <Text style={{marginLeft:150}}>{lead.school_name}</Text>
          </View>
        </CardItem>
      </Card>
    </View>
  );
};
