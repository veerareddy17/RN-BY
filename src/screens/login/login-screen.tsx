import { Formik } from 'formik';

import * as React from 'react';

import { Container, Content, Text, Button, Form, Item, Input, Label, Icon, Spinner } from 'native-base';
import { ImageBackground, Dimensions, Image, View, PermissionsAndroid, Platform } from 'react-native';
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
import requestLocationPermission from '../../permissions/permission';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
//import { GeoPosition } from 'react-native-geolocation-service';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
    user: any;
    token: string;
    locationState: any;
    requestLoginApi(
        email: string,
        password: string,
        latitude: number,
        longitude: number,
    ): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    error: any;
}
export interface State {
    showPassword: boolean;
    email: string;
    password: string;
    latitude: number;
    longitude: number;
}

class Login extends React.Component<Props, State> {
    static navigationOptions = { header: null };
    static contextType = NetworkContext;
    constructor(props: Props) {
        super(props);
        this.state = {
            showPassword: true,
            email: '',
            password: '',
            latitude: 0,
            longitude: 0,
        };
    }

    async componentDidMount() {
        if (Platform.OS == 'android') {
            const locationPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (!locationPermission) {
                requestLocationPermission();
            }
        }
    }

    getLocation = () => {
        console.log('did mount');
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    console.log('position', position);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    resolve(true);
                },
                err => {
                    console.log('error', err);
                    reject(reject);
                },
                { enableHighAccuracy: false },
            );
            // Geolocation.getCurrentPosition((pos) => {
            //     resolve(pos);
            // },
            //     (err) => {
            //         reject(err);
            //     },
            //     { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 })
        });
    };

    handlePress() {}

    handleSubmit = async values => {
        //await this.captureLocation();
        // await this.getLocation();
        console.log('after position', this.state);
        this.setState({
            latitude: 12.92881,
            longitude: 77.56139,
        });
        await this.props.requestLoginApi(values.email, values.password, this.state.latitude, this.state.longitude);
        this.props.navigation.navigate(this.props.userState.user.token ? 'CampaignList' : 'Auth');
    };

    // captureLocation = async () => {
    //     await Geolocation.getCurrentPosition((position) => {
    //         this.successFuntion(position);
    //     },
    //         (error) => {
    //             console.log('error', error)
    //         });
    // }

    // successFuntion = (position: GeolocationResponse) => {
    //     console.log('position', position)
    //     this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    //     console.log('state', this.state)
    // }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <ScrollView>
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
                                                    onChangeText={handleChange('email')}
                                                    onBlur={() => setFieldTouched('email')}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </Item>
                                            <Error error={errors.email} touched={touched.email} />
                                            <Item floatingLabel={true} style={loginStyle.password}>
                                                <Label style={{ marginLeft: 10 }}>Password</Label>
                                                <Input
                                                    secureTextEntry={this.state.showPassword}
                                                    value={values.password}
                                                    onChangeText={handleChange('password')}
                                                    onBlur={() => setFieldTouched('password')}
                                                    style={{ marginLeft: 10 }}
                                                />
                                                <Icon
                                                    active
                                                    name="eye"
                                                    onPress={() =>
                                                        this.setState({ showPassword: !this.state.showPassword })
                                                    }
                                                />
                                            </Item>
                                            <Error error={errors.password} touched={touched.password} />
                                            <Button block={true} onPress={handleSubmit} style={loginStyle.submitButton}>
                                                <Text>Sign In</Text>
                                            </Button>
                                            {this.props.locationState.isLoading ? (
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
