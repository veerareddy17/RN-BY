import { Formik } from 'formik';

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
    Input,
    Icon,
    Textarea,
    Item,
    Left,
    Footer,
    FooterTab,
    Row,
    Grid,
    ListItem,
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

import { StorageConstants } from '../../helpers/storage-constants';
import StorageService from '../../database/storage-service';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { captureLocation } from '../../redux/actions/location-action';
import { leadValidation } from '../../validations/validation-model';
import { Error } from '../error/error';
import { submitOTP, verifyOTP, otpInitAction } from '../../redux/actions/otp-actions';
import { LeadRequest } from '../../models/request';

export interface CreateLeadProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    leadState: any;
    locationState: any;
    otpState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    createLead(newLead: any): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    generateAndVerifyOTP(phone: string, connection: boolean): (dispatch: Dispatch<AnyAction>) => Promise<void>;
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
    isOTPVerified: boolean;
    location: { latitude: number; longitude: number };
    sync_status: boolean;
}

class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    static contextType = NetworkContext;
    async componentDidMount() {
        try {
            const selectedCampaign = await StorageService.get<string>(StorageConstants.SELECTED_CAMPAIGN);
            await this.props.fetchCampaigns();
            const compaignList = this.props.campaignState.campaignList;
            this.setState({ campaignList: compaignList });
            let statuseList = new Array(compaignList.length);
            for (let i = 0; i < statuseList.length; i++) {
                statuseList[i] = 'visible';
            }
            this.setState({ statuses: statuseList });
            this.setState({ campaign_id: selectedCampaign.id });
            this.setState({ campaignName: selectedCampaign.name });
        } catch (error) {
            {
                /*
            error to be handled
            */
            }
        }

        if (this.context.isConnected) {
            await this.props.fetchCampaigns();
        } else {
            {
                /*
            show offline
            */
            }
        }
    }

    backToDashboard = () => {
        this.props.navigation.navigate('Dashboard');
    };

    submitOtp = async () => {
        await this.props.submitOtp(this.state.otp);
        if (!this.props.otpState.error) {
            await this.RBSheetOtp.close();
            await this.props.createLead(this.state.leadRequest);
            this.props.navigation.navigate('LeadList');
        }
    };

    handleResend = async () => {
        await this.props.generateAndVerifyOTP(this.state.phone, this.context.isConnected);
    };

    verifyOTP = async () => {
        await this.props.generateAndVerifyOTP(this.state.phone, this.context.isConnected);
        if (this.props.otpState.otp.success) {
            await this.RBSheetOtp.open();
        }
    };

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
            isOTPVerified: false,
            location: { latitude: 0, longitude: 0 },
            sync_status: false,
        };
    }

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
            country_id: values.country,
            state_id: values.state,
            city: values.city,
            pin_code: values.pincode,
        });
        try {
            await this.props.captureLocation();
            let locObj = {
                latitude: this.props.locationState.location.latitude,
                longitude: this.props.locationState.location.longitude,
            };

            this.setState({ location: locObj });
            this.setState({ sync_status: this.context.isConnected ? true : false });

            let req = this.state;

            this.setState({ leadRequest: req });

            await this.verifyOTP();
        } catch (error) {
            {
                /*
            error to be handled
            */
            }
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

    onPressCampaign = (index: number, campaign: Object) => {
        this.props.selectCampaign(campaign);
        this.setState({
            ...this.state,
            campaignName: campaign.name,
            statuses: this.state.statuses.map((val, id) => {
                if (id == index) {
                    return 'invisible';
                }
                if (val == 'invisible') {
                    return (this.state.statuses[id] = 'visible');
                }
                return val;
            }),
        });
    };

    render() {
        return (
            <Formik
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
                }}
                onSubmit={values => this.handleSubmit(values)}
                validationSchema={leadValidation}
            >
                {({ values, handleChange, errors, setFieldTouched, touched, handleBlur, isValid, handleSubmit }) => (
                    <Container>
                        <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                            <Left>
                                <ListItem icon onPress={this.backToDashboard}>
                                    <Left>
                                        <Icon name="arrow-back" style={{ color: 'white' }} />
                                    </Left>
                                </ListItem>
                            </Left>
                            <Body>
                                <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Capture Lead</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Content>
                            <View style={leadStyle.campaingStyle}>
                                <Text numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>
                                    Campaign : {this.state.campaignName}
                                </Text>
                                <Button
                                    onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            statuses: this.state.statuses.map((val, id) => {
                                                return 'visible';
                                            }),
                                        });
                                        this.RBSheet.open();
                                    }}
                                    small
                                    bordered
                                    style={leadStyle.buttonChangeCampaingStyle}
                                >
                                    <Text style={{ color: '#813588' }}>Change</Text>
                                </Button>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheet = ref;
                                    }}
                                    height={400}
                                    duration={150}
                                    closeOnDragDown={true}
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
                                        data={this.state.campaignList}
                                        statuses={this.state.statuses}
                                        close={this.closeBottomSheet}
                                        title="Change Campaign"
                                        onPress={this.onPressCampaign}
                                    />
                                </RBSheet>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Card>
                                    <CardItem header style={{ paddingBottom: 0 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#555' }}>Student Details</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.name}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('name')}
                                                        onBlur={handleBlur('name')}
                                                    >
                                                        Student Name*
                                                    </FloatingLabel>
                                                    <Error error={errors.name} touched={touched.name} />
                                                </View>
                                            </View>
                                            <View
                                                style={[leadStyle.buttonPickerStyle, { flex: 1, flexDirection: 'row' }]}
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
                                                            <Picker.Item label="CBSC" value="1" />
                                                            <Picker.Item label="ICSC" value="2" />
                                                            <Picker.Item label="SBSC" value="3" />
                                                        </Picker>
                                                    </View>
                                                </Item>
                                            </View>
                                            <Error error={errors.board_id} touched={touched.board_id} />
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.school_name}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('school_name')}
                                                        onBlur={() => setFieldTouched('school_name')}
                                                    >
                                                        School Name*
                                                    </FloatingLabel>
                                                    <Error error={errors.school_name} touched={touched.school_name} />
                                                </View>
                                                <View style={[leadStyle.marginLeft, style.flexQuater]}>
                                                    <View
                                                        style={[
                                                            leadStyle.buttonPickerStyle,
                                                            { flex: 1, flexDirection: 'row' },
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
                                                                    Class*
                                                                </Label>
                                                                <Picker
                                                                    mode="dropdown"
                                                                    iosIcon={<Icon name="arrow-down" />}
                                                                    placeholder="Select"
                                                                    placeholderStyle={{ color: '#bfc6ea' }}
                                                                    placeholderIconColor="#007aff"
                                                                    style={{ fontSize: 15, height: 30 }}
                                                                    selectedValue={values.classes_id}
                                                                    onValueChange={value => {
                                                                        handleChange('classes_id')(value);
                                                                        setFieldTouched('classes_id', true);
                                                                    }}
                                                                >
                                                                    <Picker.Item label="Select" color="#ccc" value="" />
                                                                    <Picker.Item label="1" value="1" />
                                                                    <Picker.Item label="2" value="2" />
                                                                    <Picker.Item label="3" value="3" />
                                                                    <Picker.Item label="4" value="4" />
                                                                </Picker>
                                                            </View>
                                                        </Item>
                                                    </View>
                                                    <Error error={errors.classes_id} touched={touched.classes_id} />
                                                </View>
                                            </View>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card>
                                    <CardItem header style={{ paddingBottom: 0 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#555' }}>Parent Details</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.parent_name}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('parent_name')}
                                                        onBlur={() => setFieldTouched('parent_name')}
                                                    >
                                                        Parent Name*
                                                    </FloatingLabel>
                                                    <Error error={errors.parent_name} touched={touched.parent_name} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.phone}
                                                        keyboardType="phone-pad"
                                                        maxLength={10}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('phone')}
                                                        onBlur={() => setFieldTouched('phone')}
                                                    >
                                                        Mobile Number*
                                                    </FloatingLabel>
                                                </View>
                                            </View>
                                            <Error error={errors.phone} touched={touched.phone} />
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.alternateMobileNumber}
                                                        keyboardType="phone-pad"
                                                        maxLength={10}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('alternateMobileNumber')}
                                                        onBlur={() => setFieldTouched('alternateMobileNumber')}
                                                    >
                                                        Alternate Mobile Number
                                                    </FloatingLabel>
                                                    <Error
                                                        error={errors.alternateMobileNumber}
                                                        touched={touched.alternateMobileNumber}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.email}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('email')}
                                                        onBlur={() => setFieldTouched('email')}
                                                    >
                                                        Email*
                                                    </FloatingLabel>
                                                    <Error error={errors.email} touched={touched.email} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.address}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('address')}
                                                        onBlur={() => setFieldTouched('address')}
                                                    >
                                                        Address*
                                                    </FloatingLabel>
                                                    <Error error={errors.address} touched={touched.address} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={style.felxHalf}>
                                                    <View
                                                        style={[
                                                            leadStyle.buttonPickerStyle,
                                                            { flex: 1, flexDirection: 'row' },
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
                                                                    Country*
                                                                </Label>
                                                                <Picker
                                                                    mode="dropdown"
                                                                    iosIcon={<Icon name="arrow-down" />}
                                                                    placeholder="Select"
                                                                    placeholderStyle={{ color: '#bfc6ea' }}
                                                                    placeholderIconColor="#007aff"
                                                                    style={{ fontSize: 15, height: 30 }}
                                                                    selectedValue={values.country}
                                                                    onValueChange={value => {
                                                                        handleChange('country')(value);
                                                                        setFieldTouched('country', true);
                                                                    }}
                                                                >
                                                                    <Picker.Item label="Select" color="#ccc" value="" />
                                                                    <Picker.Item label="India" value="1" />
                                                                    <Picker.Item label="Sri Lanka" value="2" />
                                                                </Picker>
                                                            </View>
                                                        </Item>
                                                    </View>
                                                    <Error error={errors.country} touched={touched.country} />
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft]}>
                                                    <View
                                                        style={[
                                                            leadStyle.buttonPickerStyle,
                                                            { flex: 1, flexDirection: 'row' },
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
                                                                    <Picker.Item label="Karnataka" value="1" />
                                                                    <Picker.Item label="Madya Pradesh" value="2" />
                                                                </Picker>
                                                            </View>
                                                        </Item>
                                                    </View>
                                                    <Error error={errors.state} touched={touched.state} />
                                                </View>
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
                                                    <FloatingLabel
                                                        value={values.city}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('city')}
                                                        onBlur={() => setFieldTouched('city')}
                                                    >
                                                        City*
                                                    </FloatingLabel>
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft]}>
                                                    <FloatingLabel
                                                        value={values.pincode}
                                                        keyboardType="phone-pad"
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={style.formInput}
                                                        onChangeText={handleChange('pincode')}
                                                        onBlur={() => setFieldTouched('pincode')}
                                                    >
                                                        Pin Code*
                                                    </FloatingLabel>
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
                                                        style={{ borderRadius: 5 }}
                                                        rowSpan={5}
                                                        bordered={true}
                                                        placeholder="Comments"
                                                    />
                                                </View>
                                            </View>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </View>
                        </Content>
                        <Footer>
                            <FooterTab>
                                <Button full={true} onPress={handleSubmit} style={{ backgroundColor: '#813588' }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                                </Button>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheetOtp = ref;
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
    campaignState: state.campaignReducer,
    leadState: state.leadReducer,
    locationState: state.locationReducer,
    otpState: state.otpReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    createLead: bindActionCreators(createLeadApi, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    generateAndVerifyOTP: bindActionCreators(verifyOTP, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
    submitOtp: bindActionCreators(submitOTP, dispatch),
    otpInitialState: bindActionCreators(otpInitAction, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateLead);
