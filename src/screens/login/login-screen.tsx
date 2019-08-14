import * as React from 'react';
import { Container, Content, Text, Button, Form, Item, Input, Label, Icon, Spinner } from 'native-base';
import { StatusBar, ImageBackground, Dimensions, Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import images from '../../assets';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';

import { NetworkContext } from '../../provider/network-provider';
import styles from './login-style';
import { authenticate } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    requestLoginApi(email: string, password: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    error: any;
}
export interface State {
    showPassword: boolean;
    email: string;
    password: string;
}

class Login extends React.Component<Props, State> {
    static contextType = NetworkContext;
    constructor(props: Props) {
        super(props);
        this.state = {
            showPassword: true,
            email: '',
            password: 'admin',
        };
    }

    handlePress() {}

    handleSubmit = async () => {
        console.log(' User', this.state.email, this.state.password);
        await this.props.requestLoginApi('bde@example.com', 'admin');
        console.log('after login --state', this.props.userState);
        this.props.navigation.navigate(this.props.userState.user.token ? 'App' : 'Auth');
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <ScrollView>
                <Container>
                    <ImageBackground source={images.background} style={{ width, height }}>
                        {/* <StatusBar backgroundColor="purple" barStyle="light-content" /> */}
                        <Content contentContainerStyle={styles.containerStyle}>
                            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                                <Image source={images.logo} />
                            </View>
                            <View style={{}}>
                                <Form>
                                    <Item floatingLabel={true} style={styles.userName}>
                                        <Label style={{ marginLeft: 10 }}>Email</Label>
                                        <Input
                                            onChangeText={text => this.setState({ email: text })}
                                            style={{ marginLeft: 10 }}
                                        />
                                    </Item>
                                    <Item floatingLabel={true} style={styles.password}>
                                        <Label style={{ marginLeft: 10 }}>Password</Label>
                                        <Input
                                            secureTextEntry={this.state.showPassword}
                                            onChangeText={text => this.setState({ password: text })}
                                            style={{ marginLeft: 10 }}
                                        />
                                        <Icon
                                            active
                                            name="eye"
                                            onPress={() => this.setState({ showPassword: !this.state.showPassword })}
                                        />
                                    </Item>

                                    <Button block={true} onPress={this.handleSubmit} style={styles.submitButton}>
                                        <Text>Sign In</Text>
                                    </Button>
                                    {this.props.userState.isLoading ? (
                                        <View>
                                            <Spinner />
                                        </View>
                                    ) : (
                                        <View />
                                    )}
                                    <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                                        <Text onPress={this.handlePress} style={{ color: 'white' }}>
                                            Forgot Password?
                                        </Text>
                                    </View>
                                </Form>
                            </View>
                        </Content>
                    </ImageBackground>
                </Container>
            </ScrollView>
        );
    }
}
const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestLoginApi: bindActionCreators(authenticate, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);