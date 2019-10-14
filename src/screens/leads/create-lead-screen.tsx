import { Formik, FieldArray } from 'formik';

import * as React from 'react';
import { Component } from 'react';
import {
    Text,
    Button,
    View,
    Picker,
    Container,
    Header,
    Body,
    Title,
    Right,
    Content,
    Card,
    CardItem,
    Label,
    Icon,
    Textarea,
    Item,
    Left,
    Footer,
    FooterTab,
    ListItem,
    Spinner,
    Toast,
    Input,
    CheckBox,
} from 'native-base';

import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { fetchCampaigns, selectedCampaign } from '../../redux/actions/campaign-actions';
import { createLeadApi } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { AppState } from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';
import leadStyle from './lead-style';
import style from '../style/styles';

var FloatingLabel = require('react-native-floating-labels');

import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { captureLocation } from '../../redux/actions/location-action';
import { leadValidation } from '../../validations/validation-model';
import { Error } from '../error/error';
import { submitOTP, otpInitAction, sendOTP } from '../../redux/actions/otp-actions';
import { LeadRequest } from '../../models/request';
import { withNavigation } from 'react-navigation';
import { SiblingRequest } from '../../models/request/lead-request';
import { AlertError } from '../error/alert-error';
import { ToastError } from '../error/toast-error';
import { logout } from '../../redux/actions/user-actions';
import { MetaResponse } from '../../models/response/meta-response';
import { Alert, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import FloatLabelTextInput from '../../components/floating-label/floating-label';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { throwStatement } from '@babel/types';
import { CONSTANTS } from '../../helpers/app-constants';

export interface CreateLeadProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    leadState: any;
    locationState: any;
    otpState: any;
    metaData: any;
    errorState: any;
    userState: any;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    createLead(newLead: any): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    sendOtp(phone: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    submitOtp(otp: String): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    otpInitialState(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface CreateLeadState {
    leadRequest: {};
    campaignName: string;
    name: string;
    parent_name: string;
    email: string;
    phone: string;
    classes_id: string;
    board_id: string;
    school_name: string;
    address: string;
    comments: string;
    campaign_id: string;
    country_id?: number;
    otp: String;
    state_id?: number;
    country: string;
    state: string;
    city: string;
    campaignList: Array<String>;
    statuses: Array<String>;
    pin_code: string;
    proceedWithoutOtp: boolean;
    is_otp_verified: boolean;
    location: { latitude: number; longitude: number };
    sync_status: boolean;
    siblings: Array<SiblingRequest>;
    showLoadingSpinner: boolean;
    alternate_phone: string;
}

class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    static contextType = NetworkContext;

    constructor(props: CreateLeadProps) {
        super(props);
        this.onPressCampaign = this.onPressCampaign.bind(this);
        this.state = {
            leadRequest: new LeadRequest(),
            campaignList: [],
            campaignName: '',
            name: '',
            parent_name: '',
            email: '',
            otp: '',
            phone: '',
            classes_id: '',
            board_id: '',
            school_name: '',
            statuses: [],
            address: '',
            comments: '',
            pin_code: '',
            city: '',
            campaign_id: '',
            country: '',
            state: '',
            is_otp_verified: false,
            proceedWithoutOtp: false,
            location: { latitude: 0, longitude: 0 },
            sync_status: false,
            siblings: Array<SiblingRequest>(),
            showLoadingSpinner: false,
            alternate_phone: '',
        };
    }

    async componentDidMount() {
        try {
            this.focusListener = this.props.navigation.addListener('didFocus', async () => {
                const selectedCampaign = this.props.campaignState.selectedCampaign;
                const compaignList = this.props.campaignState.campaignList;
                this.setState({
                    campaignList: compaignList,
                    campaign_id: selectedCampaign.id,
                    campaignName: selectedCampaign.name,
                    proceedWithoutOtp: false,
                });
                this.formik.resetForm();
                this.props.otpInitialState();
                this.checkUserLogIn();
            });
        } catch (error) {
            /*
            error to be handled
            */
        }
    }

    checkUserLogIn = () => {
        if (
            (this.context.isConnected && this.props.userState.user.token === '') ||
            (!this.context.isConnected && !this.props.userState.user.isOfflineLoggedIn)
        ) {
            this.logout(true);
        }
    };

    logout = async (isAutoLogOff: boolean) => {
        await this.props.logout();
        isAutoLogOff
            ? AlertError.reLoginAlert(this.context.isConnected, this.props.navigation)
            : this.props.navigation.navigate('Auth');
    };

    updateClassDropdown = () => {
        const all_items = this.props.metaData.classesResponse.map((_class, i) => {
            return <Picker.Item key={_class.id} color="#333" label={_class.name} value={_class.id} />;
        });
        return all_items;
    };

    updateBoardDropdown = () => {
        const all_items = this.props.metaData.boardResponse.map((_board, i) => {
            return <Picker.Item key={_board.id} color="#333" label={_board.name} value={_board.id} />;
        });
        return all_items;
    };

    updateStatesDropdown = () => {
        const all_items = this.props.metaData.stateResponse.map((_state, i) => {
            return <Picker.Item key={_state.id} color="#333" label={_state.name} value={_state.id} />;
        });
        return all_items;
    };
    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) this.focusListener.remove();
    }

    backToDashboard = () => {
        this.props.navigation.navigate('Dashboard');
    };

    handleResend = async () => {
        await this.props.sendOtp(this.state.phone);
    };

    onPressSendOtp = async (phone: string) => {
        await this.props.sendOtp(phone);
    };

    onPressCheckBoxAlert = () => {
        let name: string;
        if (this.context.isConnected) {
            name = 'OK';
        } else {
            name = 'Submit';
        }
        Alert.alert(
            'Alert',
            'This Lead will be captured without OTP verification',
            [
                {
                    text: name,
                    onPress: () => {
                        this.context.isConnected ? null : this.submitOffline();
                    },
                },
            ],
            { cancelable: false },
        );
    };

    onPressSubmitOTP = async (otp: string) => {
        await this.props.submitOtp(otp);
    };

    submitOffline = async () => {
        await this.props.createLead(this.state.leadRequest);
        this.setState({ showLoadingSpinner: false });
        this.props.navigation.navigate('LeadList');
        return;
    };

    handleSubmit = async values => {
        this.setState({
            name: values.name,
            board_id: values.board_id,
            school_name: values.school_name,
            classes_id: values.classes_id,
            parent_name: values.parent_name,
            phone: values.phone,
            email: values.email,
            address: values.address,
            country_id: CONSTANTS.COUNTRY,
            state_id: values.state,
            city: values.city,
            pin_code: values.pincode,
            siblings: values.siblings,
            comments: values.comments,
            alternate_phone: values.alternateMobileNumber,
        });
        try {
            this.setState({ showLoadingSpinner: true });
            try {
                await this.props.captureLocation();
                this.setState({ showLoadingSpinner: false });
            } catch (errors) {
                this.setState({ showLoadingSpinner: false });
                if (this.props.errorState.showAlertError) {
                    AlertError.alertErr(errors);
                    return;
                }
                if (this.props.errorState.showToastError) {
                    ToastError.toastErr(errors);
                    return;
                }
            }
            if (this.props.errorState.showAlertError) {
                this.setState({ showLoadingSpinner: false });
                AlertError.alertErr(this.props.errorState.error);
                return;
            }
            if (this.props.errorState.showToastError) {
                this.setState({ showLoadingSpinner: false });
                ToastError.toastErr(this.props.errorState.error);
                return;
            }
            let locObj = {
                latitude: this.props.locationState.location.latitude,
                longitude: this.props.locationState.location.longitude,
            };
            this.setState({ location: locObj });
            this.setState({ sync_status: this.context.isConnected ? true : false });
            this.setState({
                is_otp_verified: !this.context.isConnected ? false : this.state.proceedWithoutOtp ? false : true,
            });

            let req = this.state;
            this.setState({ leadRequest: req });
            //If app offline then no OTP verification

            if (!this.context.isConnected) {
                this.setState({ showLoadingSpinner: true });
                this.onPressCheckBoxAlert();
                return;
            }
            await this.props.createLead(this.state.leadRequest);
            if (this.props.errorState.showAlertError) {
                this.setState({ showLoadingSpinner: false });
                AlertError.alertErr(this.props.errorState.error);
                return;
            }
            if (this.props.errorState.showToastError) {
                this.setState({ showLoadingSpinner: false });
                ToastError.toastErr(this.props.errorState.error);
                return;
            }
            if (!this.props.leadState.error) {
                this.setState({ showLoadingSpinner: false });
                this.props.navigation.navigate('LeadList');
            }
        } catch (error) {
            /*
                error to be handled
                */
        }
    };

    closeBottomSheet = () => {
        this.RBSheet.close();
        this.RBSheetOtp.close();
        this.props.otpInitialState();
    };

    onChangeOtpText = (text: String, fieldName: String) => {
        this.setState({ otp: text });
    };

    onPressCampaign = async (index: number, selectedCampaign: MetaResponse) => {
        try {
            await this.props.captureLocation();
        } catch (errors) {
            if (this.props.errorState.showAlertError) {
                AlertError.alertErr(errors);
                return;
            }
            if (this.props.errorState.showToastError) {
                ToastError.toastErr(errors);
                return;
            }
        }
        await this.props.selectCampaign(selectedCampaign);
        this.setState({
            campaign_id: selectedCampaign.id,
            campaignName: selectedCampaign.name,
        });
    };

    onPressOpenRBSheet = async () => {
        await this.props.fetchCampaigns();
        this.setState({ campaignList: this.props.campaignState.campaignList });
        this.RBSheet.open();
    };

    render() {
        return (
            <Formik
                ref={ref => (this.formik = ref)}
                enableReinitialize
                initialValues={{
                    name: '',
                    board_id: '',
                    school_name: '',
                    classes_id: '',
                    parent_name: '',
                    phone: '',
                    alternateMobileNumber: '',
                    email: '',
                    address: '',
                    country: '',
                    state: '',
                    city: '',
                    pincode: '',
                    otp: '',
                    proceedWithoutOtp: this.context.isConnected ? false : true,
                    siblings: Array<SiblingRequest>(),
                    comments: '',
                }}
                onSubmit={values => {
                    this.handleSubmit(values);
                }}
                validationSchema={leadValidation}
            >
                {({
                    values,
                    handleChange,
                    errors,
                    setFieldTouched,
                    touched,
                    handleBlur,
                    isValid,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <Container>
                        {Platform.OS === 'ios' ? (
                            <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                                <Left>
                                    <ListItem icon onPress={this.backToDashboard} style={{ marginLeft: 10 }}>
                                        <Icon name="arrow-back" style={{ color: '#fff' }} />
                                    </ListItem>
                                </Left>
                                <Body style={{ flex: 3 }}>
                                    <Title style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                                        Create Lead
                                    </Title>
                                </Body>
                                <Right />
                            </Header>
                        ) : (
                            <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                                <Left style={{ paddingRight: 10 }}>
                                    <ListItem icon onPress={this.backToDashboard} style={{ marginLeft: 10 }}>
                                        <Icon name="arrow-back" style={{ color: '#fff' }} />
                                    </ListItem>
                                </Left>
                                <Body style={{ flex: 3, paddingLeft: 20 }}>
                                    <Title
                                        style={{
                                            color: '#fff',
                                            fontSize: 18,
                                            fontWeight: '700',
                                            fontFamily: 'system font',
                                        }}
                                    >
                                        Create Lead
                                    </Title>
                                </Body>
                                <Right />
                            </Header>
                        )}

                        <Content style={{ backgroundColor: '#f6f6f6' }}>
                            <View style={leadStyle.campaingStyle}>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                    <SpinnerOverlay visible={this.state.showLoadingSpinner} />
                                    <Text style={{ fontFamily: 'system font' }}>Campaign : </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{ flex: 1, marginRight: 10, fontFamily: 'system font' }}
                                    >
                                        {this.state.campaignName}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.onPressOpenRBSheet();
                                    }}
                                    style={leadStyle.buttonChangeCampaingStyle}
                                >
                                    {this.props.campaignState.isLoading ? (
                                        <View
                                            style={{
                                                flex: 1,
                                                height: 22,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Spinner size={15} color="#813588" style={{ marginTop: 0 }} />
                                        </View>
                                    ) : (
                                        <Text
                                            uppercase={false}
                                            style={{
                                                color: '#813588',
                                                textAlign: 'center',
                                                fontSize: 14,
                                                fontFamily: 'system font',
                                            }}
                                        >
                                            Change
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheet = ref;
                                    }}
                                    height={400}
                                    animationType="fade"
                                    duration={100}
                                    closeOnPressMask={false}
                                    closeOnDragDown={false}
                                    customStyles={{
                                        container: {
                                            flex: 1,
                                            borderTopRightRadius: 20,
                                            borderTopLeftRadius: 20,
                                        },
                                    }}
                                >
                                    <BottomSheet
                                        type="List"
                                        currentcampaign={this.state.campaign_id}
                                        data={this.state.campaignList}
                                        close={this.closeBottomSheet}
                                        title="Change Campaign"
                                        onPress={this.onPressCampaign}
                                    />
                                </RBSheet>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Card style={{ marginBottom: 20, marginLeft: 0, marginRight: 0, marginTop: 0 }}>
                                    <CardItem header style={{ paddingBottom: 0 }}>
                                        <Text style={{ fontWeight: '700', color: '#555' }}>Mobile Number</Text>
                                    </CardItem>
                                    <CardItem style={{ paddingBottom: 0 }}>
                                        <Body>
                                            <View
                                                style={{
                                                    marginBottom: 5,
                                                    flexDirection: 'row',
                                                    flex: 1,
                                                    borderRadius: 5,
                                                    borderColor: touched.phone && errors.phone ? '#ff0000' : '#888',
                                                    borderWidth: 1,
                                                }}
                                            >
                                                <FloatLabelTextInput
                                                    placeholder={'Mobile Number*'}
                                                    keyboardType="phone-pad"
                                                    value={values.phone}
                                                    maxLength={10}
                                                    onChangeText={handleChange('phone')}
                                                    onBlur={() => setFieldTouched('phone')}
                                                />
                                                <View
                                                    style={{
                                                        borderTopRightRadius: 5,
                                                        borderBottomRightRadius: 5,
                                                        borderLeftWidth: 1,
                                                        borderLeftColor:
                                                            touched.phone && errors.phone ? '#ff0000' : '#888',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        disabled={
                                                            !this.context.isConnected ||
                                                            values.phone === '' ||
                                                            errors.phone
                                                                ? true
                                                                : false
                                                        }
                                                        onPress={() => this.onPressSendOtp(values.phone)}
                                                        style={{
                                                            height: 50,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingLeft: 10,
                                                            paddingRight: 10,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color:
                                                                    !this.context.isConnected ||
                                                                    values.phone === '' ||
                                                                    errors.phone
                                                                        ? '#ccc'
                                                                        : '#813588',
                                                                fontFamily: 'system font',
                                                            }}
                                                            uppercase={false}
                                                        >
                                                            {this.props.otpState.otp || this.props.otpState.error
                                                                ? 'Resend OTP'
                                                                : 'Send OTP'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        color: this.props.otpState.otp
                                                            ? '#008000'
                                                            : this.props.otpState.error
                                                            ? '#FF0000'
                                                            : 'transparent',
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    {touched.phone && errors.phone ? (
                                                        <Error error={errors.phone} touched={touched.phone} />
                                                    ) : this.props.otpState.otp ? (
                                                        'OTP sent successfully'
                                                    ) : this.props.otpState.error ? (
                                                        this.props.otpState.error
                                                    ) : (
                                                        ''
                                                    )}
                                                </Text>
                                            </View>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card style={{ marginBottom: 20, marginLeft: 0, marginRight: 0, marginTop: 0 }}>
                                    <CardItem header style={{ paddingBottom: 0 }}>
                                        <Text style={{ fontWeight: '700', color: '#555' }}>Student Details</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <View
                                                style={{
                                                    marginBottom: 5,
                                                    flexDirection: 'row',
                                                    borderRadius: 5,
                                                    borderColor: touched.name && errors.name ? '#ff0000' : '#888',
                                                    borderWidth: 1,
                                                }}
                                            >
                                                <FloatLabelTextInput
                                                    placeholder={'Student Name*'}
                                                    value={values.name}
                                                    onChangeText={handleChange('name')}
                                                    onBlur={() => setFieldTouched('name')}
                                                />
                                                <View
                                                    style={{
                                                        padding: 8,
                                                        backgroundColor: '#fff',
                                                        borderTopRightRadius: 5,
                                                        borderBottomRightRadius: 5,
                                                    }}
                                                />
                                            </View>
                                            <View>
                                                <Error error={errors.name} touched={touched.name} />
                                            </View>
                                            <View
                                                style={[
                                                    leadStyle.buttonPickerStyle,
                                                    {
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        borderColor:
                                                            touched.board_id && errors.board_id ? '#ff0000' : '#888',
                                                    },
                                                ]}
                                            >
                                                <Item picker style={{ borderBottomWidth: 0, flex: 1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Label
                                                            style={{
                                                                fontSize: 11,
                                                                color: '#555',
                                                                marginTop: 10,
                                                                marginLeft: 10,
                                                            }}
                                                        >
                                                            School Board*
                                                        </Label>
                                                        <Picker
                                                            mode="dropdown"
                                                            iosIcon={<Icon name="arrow-down" />}
                                                            style={{
                                                                fontSize: 15,
                                                                height: 30,
                                                            }}
                                                            placeholder="Select"
                                                            placeholderStyle={{ color: '#bfc6ea' }}
                                                            placeholderIconColor="#007aff"
                                                            selectedValue={values.board_id}
                                                            onValueChange={value => {
                                                                handleChange('board_id')(value);
                                                                setFieldTouched('board_id', true);
                                                            }}
                                                        >
                                                            <Picker.Item label="Select" color="#ccc" value="" />
                                                            {this.updateBoardDropdown()}
                                                        </Picker>
                                                    </View>
                                                </Item>
                                            </View>
                                            <Error error={errors.board_id} touched={touched.board_id} />
                                            <View style={{ flexDirection: 'row' }}>
                                                <View
                                                    style={{
                                                        marginBottom: 0,
                                                        marginTop: 5,
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        borderRadius: 5,
                                                        borderColor:
                                                            touched.school_name && errors.school_name
                                                                ? '#ff0000'
                                                                : '#888',
                                                        borderWidth: 1,
                                                    }}
                                                >
                                                    <FloatLabelTextInput
                                                        placeholder={'School Name*'}
                                                        value={values.school_name}
                                                        onChangeText={handleChange('school_name')}
                                                        onBlur={() => setFieldTouched('school_name')}
                                                    />
                                                    <View
                                                        style={{
                                                            padding: 8,
                                                            backgroundColor: '#fff',
                                                            borderTopRightRadius: 5,
                                                            borderBottomRightRadius: 5,
                                                        }}
                                                    />
                                                </View>
                                                <View style={[leadStyle.marginLeft, style.flexQuater]}>
                                                    <View
                                                        style={[
                                                            leadStyle.buttonPickerStyle,
                                                            {
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                borderColor:
                                                                    touched.classes_id && errors.classes_id
                                                                        ? '#ff0000'
                                                                        : '#888',
                                                                marginBottom: 0,
                                                            },
                                                        ]}
                                                    >
                                                        <Item picker style={{ borderBottomWidth: 0, flex: 1 }}>
                                                            <View style={{ flex: 1 }}>
                                                                <Label
                                                                    style={{
                                                                        fontSize: 11,
                                                                        color: '#555',
                                                                        marginTop: 10,
                                                                        marginLeft: 10,
                                                                    }}
                                                                >
                                                                    Class*
                                                                </Label>
                                                                <Picker
                                                                    mode="dropdown"
                                                                    iosIcon={<Icon name="arrow-down" />}
                                                                    placeholder="Select"
                                                                    placeholderStyle={{ color: '#bfc6ea' }}
                                                                    placeholderIconColor="#007aff"
                                                                    style={{
                                                                        fontSize: 15,
                                                                        height: 30,
                                                                    }}
                                                                    selectedValue={values.classes_id}
                                                                    onValueChange={value => {
                                                                        handleChange('classes_id')(value);
                                                                        setFieldTouched('classes_id', true);
                                                                    }}
                                                                >
                                                                    <Picker.Item label="Select" color="#ccc" value="" />
                                                                    {this.updateClassDropdown()}
                                                                </Picker>
                                                            </View>
                                                        </Item>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flex: 1,
                                                    marginBottom: 10,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={[style.felxHalf, { marginTop: 5 }]}>
                                                    <Error error={errors.school_name} touched={touched.school_name} />
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft, { marginTop: 5 }]}>
                                                    <Error error={errors.classes_id} touched={touched.classes_id} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <FieldArray
                                                    name="siblings"
                                                    render={arrayHelpers => (
                                                        <View style={{ flex: 1 }}>
                                                            {values.siblings.map((sibling, index) => (
                                                                <View key={index} style={{ flex: 1, marginBottom: 10 }}>
                                                                    <View style={{ flex: 1 }}>
                                                                        <View
                                                                            style={{
                                                                                flex: 1,
                                                                                flexDirection: 'row',
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    fontWeight: '700',
                                                                                    color: '#555',
                                                                                }}
                                                                            >
                                                                                Sibling {index + 1}
                                                                            </Text>
                                                                            <TouchableOpacity
                                                                                onPress={() =>
                                                                                    arrayHelpers.remove(index)
                                                                                }
                                                                                style={{
                                                                                    justifyContent: 'flex-end',
                                                                                    flex: 1,
                                                                                    flexDirection: 'row',
                                                                                    alignItems: 'center',
                                                                                }}
                                                                            >
                                                                                <Icon
                                                                                    name="trash"
                                                                                    style={{
                                                                                        fontSize: 20,
                                                                                        width: 20,
                                                                                        color: '#FF0000',
                                                                                        marginRight: 2,
                                                                                    }}
                                                                                />
                                                                                <Text
                                                                                    style={{
                                                                                        color: '#FF0000',
                                                                                        fontFamily: 'system font',
                                                                                        fontSize: 14,
                                                                                    }}
                                                                                >
                                                                                    Remove
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        <View
                                                                            style={{
                                                                                marginBottom: 5,
                                                                                marginTop: 5,
                                                                                flexDirection: 'row',
                                                                                flex: 1,
                                                                                borderRadius: 5,
                                                                                borderColor:
                                                                                    errors.siblings &&
                                                                                    errors.siblings[index] &&
                                                                                    touched.siblings &&
                                                                                    touched.siblings[index] &&
                                                                                    errors.siblings[index]!.name &&
                                                                                    touched.siblings[index]!.name
                                                                                        ? '#ff0000'
                                                                                        : '#888',
                                                                                borderWidth: 1,
                                                                            }}
                                                                        >
                                                                            <FloatLabelTextInput
                                                                                placeholder={'Sibling Name'}
                                                                                value={sibling.name}
                                                                                onChangeText={e => {
                                                                                    handleChange(
                                                                                        `siblings[${index}}.name`,
                                                                                    );
                                                                                    setFieldValue(
                                                                                        `siblings.${index}.name`,
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onBlur={() =>
                                                                                    setFieldTouched(
                                                                                        `siblings[${index}].name`,
                                                                                    )
                                                                                }
                                                                            />
                                                                            <View
                                                                                style={{
                                                                                    padding: 8,
                                                                                    backgroundColor: '#fff',
                                                                                    borderTopRightRadius: 5,
                                                                                    borderBottomRightRadius: 5,
                                                                                }}
                                                                            />
                                                                        </View>
                                                                        {errors.siblings &&
                                                                        errors.siblings[index] &&
                                                                        touched.siblings &&
                                                                        touched.siblings[index] ? (
                                                                            <Error
                                                                                error={errors.siblings[index]!.name}
                                                                                touched={touched.siblings[index]!.name}
                                                                            />
                                                                        ) : null}
                                                                    </View>
                                                                    <View>
                                                                        <View
                                                                            style={[
                                                                                leadStyle.buttonPickerStyle,
                                                                                {
                                                                                    flex: 1,
                                                                                    flexDirection: 'row',
                                                                                    borderColor:
                                                                                        errors.siblings &&
                                                                                        errors.siblings[index] &&
                                                                                        touched.siblings &&
                                                                                        touched.siblings[index] &&
                                                                                        errors.siblings[index]!
                                                                                            .classes_id &&
                                                                                        touched.siblings[index]!
                                                                                            .classes_id
                                                                                            ? '#ff0000'
                                                                                            : '#888',
                                                                                    marginBottom: 0,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Item
                                                                                picker
                                                                                style={{
                                                                                    borderBottomWidth: 0,
                                                                                    flex: 1,
                                                                                }}
                                                                            >
                                                                                <View style={{ flex: 1 }}>
                                                                                    <Label
                                                                                        style={{
                                                                                            fontSize: 11,
                                                                                            color: '#555',
                                                                                            marginTop: 10,
                                                                                            marginLeft: 10,
                                                                                        }}
                                                                                    >
                                                                                        Class
                                                                                    </Label>
                                                                                    <Picker
                                                                                        mode="dropdown"
                                                                                        iosIcon={
                                                                                            <Icon name="arrow-down" />
                                                                                        }
                                                                                        style={{
                                                                                            fontSize: 15,
                                                                                            height: 30,
                                                                                        }}
                                                                                        placeholder="Select"
                                                                                        placeholderStyle={{
                                                                                            color: '#bfc6ea',
                                                                                        }}
                                                                                        placeholderIconColor="#007aff"
                                                                                        selectedValue={
                                                                                            values.siblings[index]
                                                                                                .classes_id
                                                                                        }
                                                                                        onValueChange={e => {
                                                                                            setFieldValue(
                                                                                                `siblings.${index}.classes_id`,
                                                                                                e,
                                                                                            );
                                                                                            setFieldTouched(
                                                                                                `siblings.${index}.classes_id`,
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <Picker.Item
                                                                                            label="Select"
                                                                                            color="#ccc"
                                                                                            value=""
                                                                                        />
                                                                                        {this.updateClassDropdown()}
                                                                                    </Picker>
                                                                                </View>
                                                                            </Item>
                                                                        </View>
                                                                        {errors.siblings &&
                                                                        errors.siblings[index] &&
                                                                        touched.siblings &&
                                                                        touched.siblings[index] ? (
                                                                            <View style={{ marginTop: 5 }}>
                                                                                <Error
                                                                                    error={
                                                                                        errors.siblings[index]!
                                                                                            .classes_id
                                                                                    }
                                                                                    touched={
                                                                                        touched.siblings[index]!
                                                                                            .classes_id
                                                                                    }
                                                                                />
                                                                            </View>
                                                                        ) : null}
                                                                    </View>
                                                                </View>
                                                            ))}
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    arrayHelpers.push({ name: '', classes_id: '' })
                                                                }
                                                                disabled={
                                                                    values.siblings.length > 0 && errors.siblings
                                                                        ? true
                                                                        : false
                                                                }
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Icon
                                                                    style={{
                                                                        color:
                                                                            values.siblings.length > 0 &&
                                                                            errors.siblings
                                                                                ? '#ccc'
                                                                                : '#813588',
                                                                        marginLeft: 0,
                                                                        marginRight: 10,
                                                                        fontSize: 16,
                                                                        fontWeight: '700',
                                                                    }}
                                                                    name="add"
                                                                />
                                                                <Text
                                                                    uppercase={false}
                                                                    style={{
                                                                        color:
                                                                            values.siblings.length > 0 &&
                                                                            errors.siblings
                                                                                ? '#ccc'
                                                                                : '#813588',
                                                                        fontFamily: 'system font',
                                                                        paddingLeft: 0,
                                                                        fontWeight: '700',
                                                                        fontSize: 14,
                                                                    }}
                                                                >
                                                                    Add Sibling Details
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                ></FieldArray>
                                            </View>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card style={{ marginBottom: 20, marginLeft: 0, marginRight: 0, marginTop: 0 }}>
                                    <CardItem header style={{ paddingBottom: 0 }}>
                                        <Text style={{ fontWeight: '700', color: '#555' }}>Parent Details</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor:
                                                                touched.parent_name && errors.parent_name
                                                                    ? '#ff0000'
                                                                    : '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'Parent Name*'}
                                                            value={values.parent_name}
                                                            onChangeText={handleChange('parent_name')}
                                                            onBlur={() => setFieldTouched('parent_name')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                    <Error error={errors.parent_name} touched={touched.parent_name} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor: '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'Alternate Mobile Number'}
                                                            value={values.alternateMobileNumber}
                                                            keyboardType="phone-pad"
                                                            maxLength={10}
                                                            onChangeText={handleChange('alternateMobileNumber')}
                                                            onBlur={() => setFieldTouched('alternateMobileNumber')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                    <Error
                                                        error={errors.alternateMobileNumber}
                                                        touched={touched.alternateMobileNumber}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor:
                                                                touched.email && errors.email ? '#ff0000' : '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'Email*'}
                                                            keyboardType="email-address"
                                                            value={values.email}
                                                            onChangeText={handleChange('email')}
                                                            onBlur={() => setFieldTouched('email')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                    <Error error={errors.email} touched={touched.email} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor:
                                                                touched.address && errors.address ? '#ff0000' : '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'Address*'}
                                                            value={values.address}
                                                            onChangeText={handleChange('address')}
                                                            onBlur={() => setFieldTouched('address')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                    <Error error={errors.address} touched={touched.address} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View
                                                    style={[
                                                        leadStyle.buttonPickerStyle,
                                                        {
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            borderColor:
                                                                touched.state && errors.state ? '#ff0000' : '#888',
                                                        },
                                                    ]}
                                                >
                                                    <Item picker style={{ borderBottomWidth: 0, flex: 1 }}>
                                                        <View style={{ flex: 1, marginBottom: 10 }}>
                                                            <Label
                                                                style={{
                                                                    fontSize: 11,
                                                                    color: '#555',
                                                                    marginTop: 10,
                                                                    marginLeft: 10,
                                                                }}
                                                            >
                                                                State*
                                                            </Label>
                                                            <Picker
                                                                mode="dropdown"
                                                                iosIcon={<Icon name="arrow-down" />}
                                                                placeholder="Select"
                                                                placeholderStyle={{ color: '#bfc6ea' }}
                                                                placeholderIconColor="#007aff"
                                                                style={{ fontSize: 15, height: 30 }}
                                                                selectedValue={values.state}
                                                                onValueChange={value => {
                                                                    handleChange('state')(value);
                                                                    setFieldTouched('state', true);
                                                                }}
                                                            >
                                                                <Picker.Item label="Select" color="#ccc" value="" />
                                                                {this.updateStatesDropdown()}
                                                            </Picker>
                                                        </View>
                                                    </Item>
                                                </View>
                                                <Error error={errors.state} touched={touched.state} />
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={[style.felxHalf]}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor:
                                                                touched.city && errors.city ? '#ff0000' : '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'City*'}
                                                            value={values.city}
                                                            onChangeText={handleChange('city')}
                                                            onBlur={() => setFieldTouched('city')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft]}>
                                                    <View
                                                        style={{
                                                            marginBottom: 5,
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            borderRadius: 5,
                                                            borderColor:
                                                                touched.pincode && errors.pincode ? '#ff0000' : '#888',
                                                            borderWidth: 1,
                                                        }}
                                                    >
                                                        <FloatLabelTextInput
                                                            placeholder={'Pin Code*'}
                                                            value={values.pincode}
                                                            keyboardType="phone-pad"
                                                            maxLength={6}
                                                            onChangeText={handleChange('pincode')}
                                                            onBlur={() => setFieldTouched('pincode')}
                                                        />
                                                        <View
                                                            style={{
                                                                padding: 8,
                                                                backgroundColor: '#fff',
                                                                borderTopRightRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flex: 1,
                                                    marginBottom: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={[style.felxHalf]}>
                                                    <Error error={errors.city} touched={touched.city} />
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft]}>
                                                    <Error error={errors.pincode} touched={touched.pincode} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View>{isValid}</View>
                                                    <Textarea
                                                        underline={true}
                                                        style={{ borderRadius: 5, borderColor: '#888' }}
                                                        rowSpan={5}
                                                        bordered={true}
                                                        placeholder="Comments"
                                                        onChangeText={handleChange('comments')}
                                                        value={values.comments}
                                                    />
                                                </View>
                                            </View>
                                        </Body>
                                    </CardItem>
                                </Card>
                                {this.context.isConnected && (
                                    <Card style={{ marginBottom: 20, marginLeft: 0, marginRight: 0, marginTop: 0 }}>
                                        <CardItem header style={{ paddingBottom: 0 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#555' }}>OTP</Text>
                                        </CardItem>
                                        <CardItem>
                                            <Body>
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                flex: 1,
                                                                borderRadius: 5,
                                                                borderColor:
                                                                    touched.otp && errors.otp ? '#ff0000' : '#888',
                                                                borderWidth: 1,
                                                            }}
                                                        >
                                                            <FloatLabelTextInput
                                                                placeholder={'OTP'}
                                                                keyboardType="numeric"
                                                                editable={!this.state.proceedWithoutOtp}
                                                                value={values.otp}
                                                                onChangeText={handleChange('otp')}
                                                                onBlur={() => {
                                                                    {
                                                                        values.otp && this.onPressSubmitOTP(values.otp);
                                                                    }
                                                                    setFieldTouched('otp');
                                                                }}
                                                                onSubmitEditing={() =>
                                                                    this.onPressSubmitOTP(values.otp)
                                                                }
                                                            />
                                                            <View
                                                                style={{
                                                                    padding: 8,
                                                                    backgroundColor: '#fff',
                                                                    borderTopRightRadius: 5,
                                                                    borderBottomRightRadius: 5,
                                                                }}
                                                            />
                                                        </View>
                                                        {errors.otp && touched.otp ? (
                                                            <View style={{ marginVertical: 5 }}>
                                                                <Error error={errors.otp} touched={touched.otp} />
                                                            </View>
                                                        ) : this.props.otpState.validated === true ? (
                                                            <Text style={{ color: '#008000', marginVertical: 5 }}>
                                                                Valid OTP
                                                            </Text>
                                                        ) : this.props.otpState.validated === false ? (
                                                            <Text style={{ color: '#FF0000', marginVertical: 5 }}>
                                                                Invalid OTP
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                </View>
                                                <View style={{ width: '100%' }}>
                                                    <ListItem
                                                        style={{ marginLeft: 0, borderBottomWidth: 0 }}
                                                        onPress={async e => {
                                                            e.preventDefault();
                                                            handleChange('proceedWithoutOtp')(
                                                                !this.state.proceedWithoutOtp,
                                                            );
                                                            setFieldTouched('proceedWithoutOtp', true);
                                                            await this.setState({
                                                                proceedWithoutOtp: !this.state.proceedWithoutOtp,
                                                            });
                                                            {
                                                                this.state.proceedWithoutOtp
                                                                    ? this.onPressCheckBoxAlert()
                                                                    : null;
                                                            }
                                                        }}
                                                    >
                                                        <CheckBox
                                                            style={{
                                                                borderColor: this.state.proceedWithoutOtp
                                                                    ? '#039be5'
                                                                    : '#555',
                                                                paddingLeft: 0,
                                                            }}
                                                            checked={this.state.proceedWithoutOtp}
                                                            onPress={async e => {
                                                                e.preventDefault();
                                                                handleChange('proceedWithoutOtp')(
                                                                    !this.state.proceedWithoutOtp,
                                                                );
                                                                setFieldTouched('proceedWithoutOtp', true);
                                                                await this.setState({
                                                                    proceedWithoutOtp: !this.state.proceedWithoutOtp,
                                                                });
                                                                {
                                                                    this.state.proceedWithoutOtp
                                                                        ? this.onPressCheckBoxAlert()
                                                                        : null;
                                                                }
                                                            }}
                                                        />
                                                        <Body>
                                                            <Text
                                                                style={[
                                                                    leadStyle.marginLeft,
                                                                    { fontFamily: 'system font', color: '#555' },
                                                                ]}
                                                            >
                                                                Proceed without OTP{' '}
                                                            </Text>
                                                        </Body>
                                                    </ListItem>
                                                </View>
                                            </Body>
                                        </CardItem>
                                    </Card>
                                )}
                            </View>
                        </Content>
                        {!this.context.isConnected && (
                            <View
                                style={{
                                    backgroundColor: '#555',
                                    bottom: 55,
                                    position: 'absolute',
                                    padding: 2,
                                    paddingLeft: 20,
                                    width: '100%',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'system font' }}>
                                    No Internet
                                </Text>
                            </View>
                        )}
                        <Footer>
                            <FooterTab>
                                <Button
                                    disabled={!isValid ? true : false}
                                    full={true}
                                    onPress={handleSubmit}
                                    style={{ backgroundColor: !isValid ? '#ccc' : '#813588' }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Save</Text>
                                </Button>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheetOtp = ref;
                                    }}
                                    closeOnPressMask={false}
                                    closeOnDragDown={false}
                                    animationType="fade"
                                    duration={100}
                                    customStyles={{
                                        container: {
                                            height: 400,
                                            borderTopRightRadius: 20,
                                            borderTopLeftRadius: 20,
                                        },
                                    }}
                                >
                                    <BottomSheet
                                        keyBoardStyle="numeric"
                                        type="inputTypeOTP"
                                        actionType="Submit"
                                        currentState={this.props.otpState}
                                        onChangeText={this.onChangeOtpText}
                                        data={['OTP']}
                                        close={this.closeBottomSheet}
                                        submit={this.submitOtp}
                                        resend={this.handleResend}
                                        title="Enter the OTP"
                                    />
                                </RBSheet>
                            </FooterTab>
                        </Footer>
                    </Container>
                )}
            </Formik>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
    campaignState: state.campaignReducer,
    leadState: state.leadReducer,
    locationState: state.locationReducer,
    otpState: state.otpReducer,
    metaData: state.metaDataReducer,
    errorState: state.errorReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
    createLead: bindActionCreators(createLeadApi, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    sendOtp: bindActionCreators(sendOTP, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
    submitOtp: bindActionCreators(submitOTP, dispatch),
    otpInitialState: bindActionCreators(otpInitAction, dispatch),
});

export default withNavigation(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CreateLead),
);
