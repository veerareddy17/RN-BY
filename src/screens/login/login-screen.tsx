import { Formik } from 'formik';
import * as React from 'react';
import { Container, Content, Text, Button, Form, Item, Input, Label, Icon, Spinner, Toast } from 'native-base';
import { ImageBackground, Dimensions, Image, View, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import images from '../../assets';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { NetworkContext } from '../../provider/network-provider';
import loginStyle from './login-style';
import { authenticate } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
import { loginValidation } from '../../validations/validation-model';
import { captureLocation } from '../../redux/actions/location-action';
import { Error } from '../error/error';
import { LocationState } from '../../redux/init/location-initial-state';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    locationState: LocationState;
    requestLoginApi(
        email: string,
        password: string,
        latitude: number,
        longitude: number,
    ): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<boolean>;
    userState: any;
    error: any;
}
export interface State {
    showPassword: boolean;
    email: string;
    password: string;
    latitude: number;
    longitude: number;
    input: any;
}
export interface LoginRequestData {
    email: string;
    password: string;
}

class Login extends React.Component<Props, State> {
    static contextType = NetworkContext;
    static navigationOptions = { header: null };
    constructor(props: Props) {
        super(props);
        this.state = {
            showPassword: true,
            email: '',
            password: '',
            latitude: 0,
            longitude: 0,
            input: {},
        };
    }
    focusTheField = (id: string) => {
        this.state.input[id]._root.focus();
    };

    async componentDidMount() { }
        if (this.props.userState.user) {
            this.props.navigation.navigate(this.props.userState.user.token ? 'App' : 'Auth');
        }
    };

    handlePress() { }

    handleSubmit = async (values: LoginRequestData) => {
        if (this.context.isConnected) {
            await this.props.captureLocation();
            console.log('location on submit', this.props.locationState.location);
            await this.props.requestLoginApi(
                values.email,
                values.password,
                this.props.locationState.location.latitude,
                this.props.locationState.location.longitude,
            );
            this.props.navigation.navigate(this.props.userState.user.token ? 'Campaigns' : 'Auth');
        } else {
            Toast.show({
                text: 'No Internet Connection',
                buttonText: 'Ok',
                type: 'danger',
            });
        }
    };
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <ScrollView>
                <StatusBar backgroundColor="#813588" barStyle="light-content" />
                <Container>
                    <ImageBackground source={images.background} style={{ width, height }}>
                        <Content contentContainerStyle={loginStyle.containerStyle}>
                            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                                <Image source={images.logo} />
                            </View>
                            <View style={{}}>
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    onSubmit={values => this.handleSubmit(values)}
                                    validationSchema={loginValidation}
                                >
                                    {({
                                        values,
                                        handleChange,
                                        errors,
                                        setFieldTouched,
                                        touched,
                                        isValid,
                                        handleSubmit,
                                    }) => (
                                            <Form>
                                                <Item floatingLabel={true} style={loginStyle.userName}>
                                                    <Label style={{ marginLeft: 10 }}>Email</Label>
                                                    <Input
                                                        keyboardType="email-address"
                                                        onChangeText={handleChange('email')}
                                                        onBlur={() => setFieldTouched('email')}
                                                        style={{ marginLeft: 10 }}
                                                        returnKeyType="next"
                                                        blurOnSubmit={false}
                                                    onSubmitEditing={() => this.focusTheField('password')}
                                                    autoCapitalize="none"
                                                    />
                                                </Item>
                                                <Item floatingLabel={true} style={loginStyle.password}>
                                                    <Label style={{ marginLeft: 10 }}>Password</Label>
                                                    <Input
                                                        secureTextEntry={this.state.showPassword}
                                                        value={values.password}
                                                        onChangeText={handleChange('password')}
                                                        onBlur={() => setFieldTouched('password')}
                                                        style={{ marginLeft: 10 }}
                                                        returnKeyType="done"
                                                    getRef={input => {
                                                        this.state.input['password'] = input;
                                                    }}
                                                    onSubmitEditing={() => this.handleSubmit(values)}
                                                    />
                                                    <Icon
                                                        active
                                                        name="eye"
                                                        onPress={() =>
                                                            this.setState({ showPassword: !this.state.showPassword })
                                                        }
                                                    />
                                                </Item>
                                                {errors.password || errors.email || this.props.userState.error ? (
                                                    <View>
                                                        {(errors.email) ? <Text style={loginStyle.error}>{errors.email}</Text>
                                                            : errors.password ? <Text style={loginStyle.error}>{errors.password}</Text>
                                                                : this.props.userState.error ? <Text style={loginStyle.error}>Invalid Email Id/Password</Text> : <Text />}
                                                    </View>
                                                ) : (
                                                        <View />
                                                    )}

                                                <Button block={true} onPress={handleSubmit} style={loginStyle.submitButton}>
                                                <Text style={{fontSize: 16}}>Login</Text>
                                                </Button>
                                                {this.props.userState.isLoading ? (
                                                    <View>
                                                        <Spinner />
                                                    </View>
                                                ) : (
                                                        <View />
                                                    )}
                                                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                                                <Text onPress={this.handlePress} style={{ color: '#fff', fontSize: 14 }}>
                                                        Forgot Password?
                                                </Text>
                                                </View>
                                            </Form>
                                        )}
                                </Formik>
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
    locationState: state.locationReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestLoginApi: bindActionCreators(authenticate, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
