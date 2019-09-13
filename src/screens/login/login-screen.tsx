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
import { LocationState } from '../../redux/init/location-initial-state';
import { forgotPassword, initStateForgotPassword } from '../../redux/actions/forgot-password-action';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fetchCampaigns } from '../../redux/actions/campaign-actions';
import { fetchMetaData } from '../../redux/actions/meta-data-actions';
import { AlertError } from '../error/alert-error';
import { ToastError } from '../error/toast-error';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    locationState: LocationState;
    forgotPasswordState: any;
    metaData: any;
    campaignState: any;
    errorState: any;
    requestLoginApi(
        email: string,
        password: string,
        latitude: number,
        longitude: number,
    ): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<boolean>;
    forgotPassword(email: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    resetForgotPassword(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchMetaData(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
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
        const selectedCampaign = this.props.campaignState.selectedCampaign;
        if (this.context.isConnected) {
            if (this.props.userState.user.token) {
                this.props.navigation.navigate(selectedCampaign === null ? 'Campaigns' : 'App');
                return;
            }
        }
        this.props.navigation.navigate('Auth');
    };

    handlePress = () => {
        this.RBSheetForgotPass.open();
    };

    closeBottomSheet = () => {
        this.RBSheetForgotPass.close();
        this.props.resetForgotPassword();
    };

    onChangeTextBottomSheet = (text: string, fieldName: string) => {
        this.setState({ email: text });
    };

    submitForgotPassword = async () => {
        await this.props.forgotPassword(this.state.email);
        if (this.props.forgotPasswordState.forgotPasswordResponse.success) {
            this.RBSheetForgotPass.close();
        }
    };

    handleSubmit = async (values: LoginRequestData) => {
        if (this.context.isConnected) {
            await this.props.captureLocation();
            await this.props.requestLoginApi(
                values.email,
                values.password,
                this.props.locationState.location.latitude,
                this.props.locationState.location.longitude,
            );
            if (this.props.errorState.showAlertError) {
                AlertError.alertErr(this.props.errorState.error);
                return;
            }
            if (this.props.errorState.showToastError) {
                ToastError.toastErr(this.props.errorState.error);
                return;
            }
            // if (!this.props.errorState.showAlertError && !this.props.errorState.showToastError) {
            await this.props.fetchMetaData();
            await this.props.fetchCampaigns();
            if (this.props.errorState.showAlertError) {
                AlertError.alertErr(this.props.errorState.error);
            }
            if (this.props.errorState.showToastError) {
                ToastError.toastErr(this.props.errorState.error);
            }
            if (!this.props.errorState.showAlertError && !this.props.errorState.showToastError) {
                this.props.navigation.navigate(this.props.userState.user.token ? 'Campaigns' : 'Auth');
            }
            // }
            return;
        }
        await this.props.requestLoginApi(
            values.email,
            values.password,
            this.props.locationState.location.latitude,
            this.props.locationState.location.longitude,
        );
        this.props.navigation.navigate(this.props.userState.error ? 'Auth' : 'Campaigns');
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
                                                    autoCapitalize="none"
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
                                                    style={{ paddingTop: 0 }}
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
                                                    {!this.context.isConnected ? (
                                                        <Text style={loginStyle.error}>No Internet Connection</Text>
                                                    ) : errors.email ? (
                                                        <Text style={loginStyle.error}>{errors.email}</Text>
                                                    ) : errors.password ? (
                                                        <Text style={loginStyle.error}>{errors.password}</Text>
                                                    ) : this.props.userState.error ? (
                                                        this.props.errorState.showAlertError ? (
                                                            <Text style={loginStyle.error}>
                                                                {this.props.userState.error[0].message}
                                                            </Text>
                                                        ) : (
                                                            <Text />
                                                        )
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
                                            {this.props.userState.isLoading || this.props.metaData.isLoading ? (
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
                                        borderTopLeftRadius: 20,
                                    },
                                }}
                            >
                                <BottomSheet
                                    keyBoardStyle="email-address"
                                    type="inputType"
                                    actionType="Submit"
                                    currentState={this.props.forgotPasswordState}
                                    onChangeText={this.onChangeTextBottomSheet}
                                    data={['Email Id']}
                                    close={this.closeBottomSheet}
                                    description="Enter your registered email id"
                                    submit={this.submitForgotPassword}
                                    title="Forgot Password"
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
    forgotPasswordState: state.forgotPasswordReducer,
    campaignState: state.campaignReducer,
    metaData: state.metaDataReducer,
    errorState: state.errorReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestLoginApi: bindActionCreators(authenticate, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    fetchMetaData: bindActionCreators(fetchMetaData, dispatch),
    forgotPassword: bindActionCreators(forgotPassword, dispatch),
    resetForgotPassword: bindActionCreators(initStateForgotPassword, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
