import * as React from 'react';
import { View, Text, Card, CardItem, Icon, Button, ListItem, Grid, Col, Row } from 'native-base';

export default ({ lead }) => {
  return (
    <View >
      {/* <Text>{lead.name}</Text>
            <Text>{lead.parent_name}</Text>
            <Text>{lead.email}</Text>
            <Text>{lead.phone}</Text> */}

      <Card>

        <CardItem header style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{lead.name}</Text>
          <Button rounded small style={{ backgroundColor: 'purple', marginLeft: 6 }}>
            <Text style={{ textTransform: 'capitalize' }}>{lead.class_name}</Text>
          </Button>
          <Icon type='FontAwesome' name='pencil' style={{ position: 'absolute', right: 0 }} />
        </CardItem>

        <CardItem style={{ borderBottomColor: 'lightGrey', borderBottomWidth: 0.25 }}>
          {/* <View style={{ flexDirection: 'row' }}>
            <Icon name='calculator' style={{ padding: 5 }} />
            <Text>{lead.phone}</Text>
            <Icon name='paper-plane' style={{ padding: 5 }} />
            <Text>{lead.email}</Text>
          </View> */}

          {/* <Grid>
            <Row><Icon name='calculator' style={{ padding: 5, fontSize: 20, }} />
              <Text>{lead.phone}</Text>
              <Icon name='paper-plane' style={{ padding: 5, fontSize: 20, marginLeft: 10, }} />
              <Text>{lead.email}</Text></Row>
          </Grid> */}
          <Grid>
            <Col style={{ flexDirection: 'row' }}><Icon name='calculator' style={{ fontSize: 20, }} /><View style={{ flex: 1 }}><Text>{lead.phone}</Text></View></Col>
            <Col style={{ flexDirection: 'row' }}><Icon name='paper-plane' style={{ fontSize: 20 }} /><View style={{ flex: 1 }}><Text>{lead.email}</Text></View></Col>
          </Grid>

        </CardItem>
        <CardItem style={{ borderBottomColor: 'lightGrey', borderBottomWidth: 0.25 }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Text>School Board</Text>
            <Text style={{ textAlign: 'right', alignSelf: 'stretch' }}>School</Text> */}

            <Grid>
              <Col><Text>School Board</Text></Col>
              <Col style={{ marginLeft: 20 }}><Text>School</Text></Col>
            </Grid>
          </View>
        </CardItem>
        <CardItem>
          <View style={{ flexDirection: 'row' }}>
            {/* <Text>{lead.school_board}</Text>
            <Text style={{ marginLeft: 'auto' }}>{lead.school_name}</Text> */}
            <Grid>
              <Col><Text>{lead.school_board}</Text></Col>
              <Col style={{ marginLeft: 20 }}><Text>{lead.school_name}</Text></Col>
            </Grid>
          </View>
        </CardItem>
      </Card>
    </View >
  );
};
