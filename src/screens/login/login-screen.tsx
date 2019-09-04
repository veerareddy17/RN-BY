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
import { forgotPassword, initStateForgotPassword } from '../../redux/actions/forgot-password-action';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    locationState: LocationState;
    forgotPasswordState: any;
    requestLoginApi(
        email: string,
        password: string,
        latitude: number,
        longitude: number,
    ): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<boolean>;
    forgotPassword(email: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    resetForgotPassword(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
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

    componentDidMount = async () => {
        if (this.props.userState.user) {
            this.props.navigation.navigate(this.props.userState.user.token ? 'App' : 'Auth');
        }
    }

    handlePress = () => {
        this.RBSheetForgotPass.open();
    }

    closeBottomSheet = () => {
        this.RBSheetForgotPass.close();
        this.props.resetForgotPassword();

    }

    onChangeTextBottomSheet = (text: string, fieldName: string) => {
        console.log('text,item', text, fieldName)
        this.setState({ email: text })
        console.log('state in onchange', this.state)
    }

    submitForgotPassword = async () => {

        console.log('state in submit', this.state)
        await this.props.forgotPassword(this.state.email);
        console.log('forgot password response', this.props.forgotPasswordState.forgotPasswordResponse);
        if (this.props.forgotPasswordState.forgotPasswordResponse.success) {
            this.RBSheetForgotPass.close();
        }
    }

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
                type: 'danger',
            });
        }
    };
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <Container>
                <StatusBar backgroundColor="#813588" barStyle="light-content" />
                <ScrollView keyboardShouldPersistTaps="always">
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
                                            <Item floatingLabel style={loginStyle.userName}>
                                                <Label style={{ marginLeft: 10 }}>Email</Label>
                                                <Input
                                                    keyboardType="email-address"
                                                    onChangeText={handleChange('email')}
                                                    onBlur={() => setFieldTouched('email')}
                                                    style={{ marginLeft: 10 }}
                                                    returnKeyType="next"
                                                    blurOnSubmit={false}
                                                        onSubmitEditing={() => this.focusTheField('password')}
                                                        autoCapitalize='none'
                                                />
                                            </Item>
                                            <Item floatingLabel style={loginStyle.password}>
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
                                                    name={this.state.showPassword ? 'eye-off' : 'eye'}
                                                    onPress={e => {
                                                        e.preventDefault();
                                                        this.setState({ showPassword: !this.state.showPassword });
                                                    }}
                                                />
                                            </Item>
                                            {errors.password || errors.email || this.props.userState.error ? (
                                                <View>
                                                    {errors.email ? (
                                                        <Text style={loginStyle.error}>{errors.email}</Text>
                                                    ) : errors.password ? (
                                                        <Text style={loginStyle.error}>{errors.password}</Text>
                                                    ) : this.props.userState.error ? (
                                                        <Text style={loginStyle.error}>Invalid Email Id/Password</Text>
                                                    ) : (
                                                        <Text />
                                                    )}
                                                </View>
                                            ) : (
                                                <View />
                                            )}

                                            <Button block={true} onPress={handleSubmit} style={loginStyle.submitButton}>
                                                <Text style={{ fontSize: 16 }}>Login</Text>
                                            </Button>
                                            {this.props.userState.isLoading ? (
                                                <View>
                                                    <Spinner />
                                                </View>
                                            ) : null}

                                            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                                                <Text
                                                    onPress={this.handlePress}
                                                    style={{ color: '#fff', fontSize: 14 }}
                                                >
                                                    Forgot Password?
                                                </Text>
                                            </View>
                                        </Form>
                                    )}
                                </Formik>
                            </View>
                            <RBSheet
                                ref={ref => {
                                    this.RBSheetForgotPass = ref;
                                }}
                                closeOnPressMask={false}
                                duration={10}
                                customStyles={{
                                    container: {
                                        height: 400,
                                        borderTopRightRadius: 20,
                                        borderTopLeftRadius: 20
                                    }
                                }}
                            >

                                <BottomSheet
                                    keyBoardStyle="email-address"
                                    type="inputType"
                                    actionType="Submit"
                                    currentState={this.props.forgotPasswordState}
                                    onChangeText={this.onChangeTextBottomSheet}
                                    data={["Email Id",]}
                                    close={this.closeBottomSheet}
                                    description="Enter your registered email id"
                                    submit={this.submitForgotPassword}
                                    title='Forgot Password'
                                />
                            </RBSheet>
                        </Content>
                    </ImageBackground>
                </ScrollView>
            </Container>
        );
    }
}
const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
    locationState: state.locationReducer,
    forgotPasswordState: state.forgotPasswordReducer
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestLoginApi: bindActionCreators(authenticate, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
    forgotPassword: bindActionCreators(forgotPassword, dispatch),
    resetForgotPassword: bindActionCreators(initStateForgotPassword, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
