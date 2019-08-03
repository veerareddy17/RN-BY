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
    Spinner,
} from 'native-base';

import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';

import { NetworkContext } from '../../provider/network-provider';
import { loginApi } from '../../redux/actions/userLoginActions';
import { AppState } from '../../redux/store';
import store from '../../redux/store';
import { View } from 'react-native';
import storage from '../../database/storage';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    userState: any;
    error: any;
    requestLoginApi(username: string, password: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}
export interface State {}
class Login extends React.Component<Props, State> {
    static contextType = NetworkContext;

    handleSubmit = async () => {
        await this.props.requestLoginApi('test@example.com', 'password');
        console.log('after login --state', store.getState());

        const userToken = await storage.getUserToken();
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
                            <Input placeholder="Username" />
                        </Item>
                        <Item regular>
                            <Input placeholder="Password" />
                        </Item>
                    </Form>
                    <Button onPress={this.handleSubmit}>
                        <Text>Login</Text>
                    </Button>
                    {this.props.userState.isLoading ? (
                        <View>
                            <Spinner />
                            <Text>Logging In...</Text>
                        </View>
                    ) : (
                        <View />
                    )}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestLoginApi: bindActionCreators(loginApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
