import * as React from 'react';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, List, ListItem } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
}
export interface State {}
class Dashboard extends React.Component<Props, State> {
    async componentDidMount() {
        try {
            let userData = await AsyncStorage.getItem('user');
            console.log(userData);
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
                <Header>
                    <Left>
                        <Button transparent>
                            <Text>Header</Text>
                        </Button>
                    </Left>
                    <Body></Body>
                    <Right />
                </Header>
                <Content>
                    <Text>Dashboard Content</Text>
                    <Button onPress={this.getLeads}>
                        <Text>Get leads</Text>
                    </Button>
                    <Button onPress={this.createLead}>
                        <Text>Create lead</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;
