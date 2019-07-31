import * as React from 'react';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, List, ListItem } from 'native-base';

import { NavigationScreenProp } from 'react-navigation';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
}
export interface State {}
class Splash extends React.Component<Props, State> {
    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate('Login');
        }, 3000);
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Text>Header</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Home</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Text>Splash Content</Text>
                </Content>
            </Container>
        );
    }
}

export default Splash;
