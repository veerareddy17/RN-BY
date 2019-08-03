import * as React from 'react';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, List, ListItem, Footer, FooterTab } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import images from '../../assets';
import { Image, View } from 'react-native';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
}
export interface State { }
class Dashboard extends React.Component<Props, State> {
    async componentDidMount() {
        try {
            let userData = await AsyncStorage.getItem('userToken');
        } catch (error) {
            console.log('Something went wrong', error);
        }
    }
    getLeads = () => {
        this.props.navigation.navigate('LeadList');
    };
    createLead = () => {
        this.props.navigation.navigate('CreateLead');
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: 'purple' }} androidStatusBarColor="purple">
                    <Left>
                        <Button transparent>

                        </Button>
                    </Left>
                    <Body><Title>Dashboard</Title></Body>
                    <Right />
                </Header>

                <Content>
                    {/* <Button onPress={this.getLeads}>
                        <Text>Get leads</Text>
                    </Button>
                    <Button onPress={this.createLead}>
                        <Text>Create lead</Text>
                    </Button> */}
                    <View style={{ alignItems: 'center', flexDirection: 'column', padding: 10 }}>
                        <Image source={images.workProgress} />
                    </View>
                </Content>

                <Footer>
                    <FooterTab style={{ backgroundColor: 'purple' }}>
                        <Button
                            vertical
                        //   active={props.navigationState.index === 0}
                        // onPress={() => this.props.navigation.navigate('Dashboard')}
                        >
                            <Icon name="home" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Dashboard</Text>
                        </Button>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 1}
                            onPress={this.createLead}
                        >
                            <Icon name="add" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead Capture</Text>

                        </Button>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 2}
                            onPress={this.getLeads}
                        >
                            <Icon name="person" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead List</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default Dashboard;
