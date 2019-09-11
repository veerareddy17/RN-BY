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
    Spinner,
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
import { withNavigation } from 'react-navigation';
import { SiblingRequest } from '../../models/request/lead-request';

export interface CreateLeadProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    leadState: any;
    locationState: any;
    otpState: any;
    metaData: any;
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
    siblings: Array<SiblingRequest>;
}

class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    static contextType = NetworkContext;
    async componentDidMount() {
        try {
            this.focusListener = this.props.navigation.addListener('didFocus', async () => {
                // The screen is focused call any action
                if (this.context.isConnected) {
                    const selectedCampaign = await StorageService.get<string>(StorageConstants.SELECTED_CAMPAIGN);
                    const compaignList = this.props.campaignState.campaignList;
                    this.setState({ campaignList: compaignList });
                    this.setState({ campaign_id: selectedCampaign.id });
                    this.setState({ campaignName: selectedCampaign.name });
                } else {
                    /*
                show offline
                */
                }
            });
        } catch (error) {
            /*
            error to be handled
            */
        }
    }

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
        all_items.unshift(<Picker.Item label="Select" color="#ccc" value="" />);
        return all_items;
    };
    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) this.focusListener.remove();
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
            siblings: Array<SiblingRequest>(),
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
            siblings: values.siblings
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
            console.log('sibling values in lead req', this.state.leadRequest)
            await this.verifyOTP();

            // await this.props.createLead(this.state.leadRequest);
            // this.props.navigation.navigate('LeadList');
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
            campaign_id: campaign.id,
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
                    siblings: Array<SiblingRequest>(),
                }}
                onSubmit={values => {
                    this.handleSubmit(values)
                }
                }
                validationSchema={leadValidation}
            >
                {({ values, handleChange, errors, setFieldTouched, touched, handleBlur, isValid, handleSubmit, setFieldValue }) => (

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
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text>Campaign : </Text>
                                    {this.props.campaignState.isLoading ? (
                                        <View
                                            style={{
                                                flex: 1,
                                                height: 30,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Spinner size={15} color="#813588" style={{ marginTop: 0 }} />
                                        </View>
                                    ) : (
                                            <Text numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>
                                                {this.state.campaignName}
                                            </Text>
                                        )}
                                </View>
                                <Button
                                    onPress={() => {
                                        this.RBSheet.open();
                                    }}
                                    small
                                    bordered
                                    style={leadStyle.buttonChangeCampaingStyle}
                                >
                                    <Text style={{ color: '#813588', paddingLeft: 8, paddingRight: 8 }}>Change</Text>
                                </Button>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheet = ref;
                                    }}
                                    height={400}
                                    duration={150}
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
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.name && errors.name ? '#ff0000' : '#333',
                                                            },
                                                        ]}
                                                        onChangeText={handleChange('name')}
                                                        onBlur={handleBlur('name')}
                                                    >
                                                        Student Name*
                                                    </FloatingLabel>
                                                    <Error error={errors.name} touched={touched.name} />
                                                </View>
                                            </View>
                                            <View
                                                style={[
                                                    leadStyle.buttonPickerStyle,
                                                    {
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        borderColor:
                                                            touched.board_id && errors.board_id ? '#ff0000' : '#333',
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
                                                <View style={{ flex: 1 }}>
                                                    <FloatingLabel
                                                        value={values.school_name}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.school_name && errors.school_name
                                                                        ? '#ff0000'
                                                                        : '#333',
                                                            },
                                                        ]}
                                                        onChangeText={handleChange('school_name')}
                                                        onBlur={() => setFieldTouched('school_name')}
                                                    >
                                                        School Name*
                                                    </FloatingLabel>
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
                                                                        : '#333',
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
                                                <View style={[style.felxHalf]}>
                                                    <Error error={errors.school_name} touched={touched.school_name} />
                                                </View>
                                                <View style={[style.felxHalf, leadStyle.marginLeft]}>
                                                    <Error error={errors.classes_id} touched={touched.classes_id} />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', }}>
                                                <FieldArray
                                                    name="siblings"
                                                    render={arrayHelpers => (
                                                        <View style={{ flex: 1 }}>
                                                            {values.siblings.length > 0 ? <Text style={{ fontWeight: 'bold', color: '#555', paddingTop: 5, paddingBottom: 5 }}>Sibling Details</Text> : null}
                                                            {values.siblings.map((sibling, index) => (
                                                                <View key={index} style={{ flex: 1, marginBottom: 10 }}>
                                                                    <View style={{ flex: 1 }}>
                                                                        <FloatingLabel
                                                                            value={sibling.name}
                                                                            labelStyle={style.labelInput}
                                                                            inputStyle={style.input}
                                                                            style={[
                                                                                style.formInput,
                                                                                {
                                                                                    borderColor:
                                                                                        errors.siblings && errors.siblings[index] && touched.siblings && touched.siblings[index]
                                                                                            && errors.siblings[index]!.name && touched.siblings[index]!.name
                                                                                            ? '#ff0000'
                                                                                            : '#333',
                                                                                },
                                                                            ]}
                                                                            onChangeText={e => {
                                                                                handleChange(`siblings[${index}}.name`)
                                                                                setFieldValue(
                                                                                    `siblings.${index}.name`,
                                                                                    e,
                                                                                );

                                                                            }}
                                                                            onBlur={() => setFieldTouched(
                                                                                `siblings[${index}].name`,
                                                                            )}
                                                                        >
                                                                            Sibling Name
                                                    </FloatingLabel>
                                                                        {
                                                                            errors.siblings && errors.siblings[index] && touched.siblings && touched.siblings[index] ?
                                                                                <Error error={errors.siblings[index]!.name} touched={touched.siblings[index]!.name} />
                                                                                : null
                                                                        }

                                                                    </View>
                                                                    <View>
                                                                        <View
                                                                            style={[
                                                                                leadStyle.buttonPickerStyle,
                                                                                {
                                                                                    flex: 1,
                                                                                    flexDirection: 'row',
                                                                                    borderColor:
                                                                                        errors.siblings && errors.siblings[index] && touched.siblings && touched.siblings[index]
                                                                                            && errors.siblings[index]!.classes_id && touched.siblings[index]!.classes_id ? '#ff0000' : '#333',
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
                                                                                        Class
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
                                                                                        selectedValue={values.siblings[index].classes_id}
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
                                                                                        <Picker.Item label="Select" color="#ccc" value="" />
                                                                                        {this.updateClassDropdown()}
                                                                                    </Picker>
                                                                                </View>
                                                                            </Item>
                                                                        </View>
                                                                        {
                                                                            errors.siblings && errors.siblings[index] && touched.siblings && touched.siblings[index] ?
                                                                                <Error error={errors.siblings[index]!.classes_id} touched={touched.siblings[index]!.classes_id} />
                                                                                : null
                                                                        }
                                                                    </View>
                                                                    <Button iconLeft danger bordered style={{ justifyContent: 'center', marginTop: 5 }}
                                                                        onPress={() => arrayHelpers.remove(index)}
                                                                    ><Icon name='trash' /><Text>Remove</Text></Button>
                                                                </View>
                                                            ))}
                                                            <Button bordered style={{ justifyContent: 'center', marginTop: 5 }}
                                                                onPress={() => arrayHelpers.push({ name: '', classes_id: '' })}
                                                                disabled={values.siblings.length > 0 && errors.siblings ? true : false}
                                                            ><Text>{values.siblings.length > 0 ? 'Add More' : 'Add Sibling Data'}</Text></Button>
                                                        </View>
                                                    )}></FieldArray>
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
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.parent_name && errors.parent_name
                                                                        ? '#ff0000'
                                                                        : '#333',
                                                            },
                                                        ]}
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
                                                        style={[
                                                            style.formInput,
                                                            { borderColor: touched.phone && errors.phone ? '#ff0000' : '#333' },
                                                        ]}
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
                                                        keyboardType="email-address"
                                                        value={values.email}
                                                        labelStyle={style.labelInput}
                                                        inputStyle={style.input}
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.email && errors.email ? '#ff0000' : '#333',
                                                            },
                                                        ]}
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
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.address && errors.address
                                                                        ? '#ff0000'
                                                                        : '#333',
                                                            },
                                                        ]}
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
                                                            {
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                borderColor:
                                                                    touched.country && errors.country
                                                                        ? '#ff0000'
                                                                        : '#333',
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
                                                            {
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                borderColor:
                                                                    touched.state && errors.state ? '#ff0000' : '#333',
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
                                                                    {/* <Picker.Item label="Select" color="#ccc" value="" /> */}
                                                                    {values.country ? this.updateStatesDropdown() :
                                                                        <Picker.Item label="Select" color="#ccc" value="" />}
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
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.city && errors.city ? '#ff0000' : '#333',
                                                            },
                                                        ]}
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
                                                        style={[
                                                            style.formInput,
                                                            {
                                                                borderColor:
                                                                    touched.pincode && errors.pincode
                                                                        ? '#ff0000'
                                                                        : '#333',
                                                            },
                                                        ]}
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
                                                        style={{ borderRadius: 5, borderColor: '#333' }}
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
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Save</Text>
                                </Button>
                                <RBSheet
                                    ref={ref => {
                                        this.RBSheetOtp = ref;
                                    }}
                                    closeOnPressMask={false}
                                    closeOnDragDown={false}
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
    metaData: state.metaDataReducer,
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

export default withNavigation(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CreateLead),
);
