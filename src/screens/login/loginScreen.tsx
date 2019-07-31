import * as React from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Left,
    Body,
    Right,
    Form,
    Item,
    Input,
    Label,
} from 'native-base';

import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';

import { NetworkContext } from '../../provider/network-provider';
import { login, logout } from '../../services/userService';
import { loginApi } from '../../redux/actions/userActions';
import { AppState } from '../../redux/reducers/index';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    login(username: string, password: string): void;
    requestLoginApi(username: string, password: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}
export interface State {
    user: {
        username: 'abc';
        password: 'abc';
    };
}
class Login extends React.Component<Props, State> {
    static contextType = NetworkContext;

    handleSubmit = async () => {
        await this.props.requestLoginApi('test@example.com', 'password');
        // let userData = JSON.parse(this.props.user);
        console.log('Props User token:-----', this.props.user.user.token);

        const userToken = await AsyncStorage.getItem('userToken');
        console.log('storage user :====', userToken);
        this.props.navigation.navigate(userToken ? 'Dashboard' : 'Login');
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button>
                            <Text>Header</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Login </Title>
                        <Text>You are now {this.context.isConnected ? 'online' : 'offline'}</Text>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Item regular>
                            <Input placeholder="Username" value={this.props.token} />
                        </Item>
                        <Item regular>
                            <Input placeholder="Password" />
                        </Item>
                    </Form>
                    <Button onPress={this.handleSubmit}>
                        <Text>Login</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // return {
    //     login: (username, password) => {
    //         dispatch(login(username, password));
    //     },
    // };
    requestLoginApi: bindActionCreators(loginApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
