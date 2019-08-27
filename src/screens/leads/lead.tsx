import * as React from 'react';
import { View, Text, Card, CardItem, Icon, Button, ListItem, Grid, Col, Row } from 'native-base';

export default ({ lead }) => {
    return (
        <View>
            <Card>
                <CardItem header style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{lead.name}</Text>
                    <Button rounded small style={{ backgroundColor: 'purple', marginLeft: 6 }}>
                        <Text style={{ textTransform: 'capitalize' }}>{lead.class_name}</Text>
                    </Button>
                </CardItem>

                <CardItem style={{ borderBottomColor: 'lightGrey', borderBottomWidth: 0.25 }}>
                    <Grid>
                        <Col style={{ flexDirection: 'row' }}>
                            <Icon name="calculator" style={{ fontSize: 20 }} />
                            <View style={{ flex: 1 }}>
                                <Text>{lead.phone}</Text>
                            </View>
                        </Col>
                        <Col style={{ flexDirection: 'row' }}>
                            <Icon name="paper-plane" style={{ fontSize: 20 }} />
                            <View style={{ flex: 1 }}>
                                <Text>{lead.email}</Text>
                            </View>
                        </Col>
                    </Grid>
                </CardItem>
                <CardItem style={{ borderBottomColor: 'lightGrey', borderBottomWidth: 0.25 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Grid>
                            <Col>
                                <Text>School Board</Text>
                            </Col>
                            <Col style={{ marginLeft: 20 }}>
                                <Text>School</Text>
                            </Col>
                        </Grid>
                    </View>
                </CardItem>
                <CardItem>
                    <View style={{ flexDirection: 'row' }}>
                        <Grid>
                            <Col>
                                <Text>{lead.school_board}</Text>
                            </Col>
                            <Col style={{ marginLeft: 20 }}>
                                <Text>{lead.school_name}</Text>
                            </Col>
                        </Grid>
                    </View>
                </CardItem>
            </Card>
        </View>
    );
};
