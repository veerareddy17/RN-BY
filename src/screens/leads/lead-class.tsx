import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator, ImageBackground, Dimensions, Image, Alert, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import {
    View,
    Header,
    Container,
    Content,
    Left,
    Button,
    Title,
    Right,
    Body,
    ListItem,
    Icon,
    Text,
    Card,
    Tabs,
    Tab,
    CardItem,
    Grid,
    Col,
    Toast,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import { fetchAllLeadsApi, resetLeads, verifyLead } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { logout } from '../../redux/actions/user-actions';
import images from '../../assets';
import { fetchLeadReport } from '../../redux/actions/lead-report-action';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { sendOTP, otpInitAction, submitOTP } from '../../redux/actions/otp-actions';

export interface LeadProps {
    navigation: NavigationScreenProp<any>;
    callVerifyLoadLead: Function;
    lead: any;
    otpState: any;
    leadState: any;
    sendOtp(phone: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    otpInitialState(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    submitOtp(otp: String): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    verifyLead(leadId: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchLeadReport(): (dispatch: Dispatch, getState: any) => Promise<void>;
    fetchLeads(pageNumber: number, isOtpVerified: boolean): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    resetLead(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface LeadState {
    otp: string;
    phone: string;
    keyboardHeight: number;
}

class Lead extends Component<LeadProps, LeadState> {
    static contextType = NetworkContext;

    constructor(props: LeadProps) {
        super(props);
        this.state = {
            otp: '',
            phone: '',
            keyboardHeight: 0,
        };
    }
    openBottomSheetVerifyOTP = () => {
        this.props.sendOtp(this.props.lead.phone)
        this.setState({ phone: this.props.lead.phone })
        this.RBSheetReverifyOTP.open();

    }

    onChangeTextBottomSheet = (text: string, fieldName: string) => {
        this.setState({ otp: text });
    };

    closeBottomSheet = () => {
        this.props.otpInitialState();
        this.RBSheetReverifyOTP.close();
    };

    handleResend = async () => {
        await this.props.sendOtp(this.state.phone);
    };

    submitOTP = async () => {
        console.log('state', this.state)
        Keyboard.dismiss();
        await this.props.submitOtp(this.state.otp);
        if (this.props.otpState.validated === true) {
            Toast.show({
                text: "OTP verified successfully",
                position: 'top',
                buttonText: 'Ok',
                duration: 5000,
                type: 'success',
            });
            this.props.verifyLead(this.props.lead.id);
            //this.props.navigation.navigate('LeadList');
            this.RBSheetReverifyOTP.close();
            this.props.callVerifyLoadLead();


        }
    };

    render() {
        return (
            // <Container>
            //     <Content>
            <View style={{ paddingTop: 0 }}>
                <Card
                    style={{
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderBottomWidth: 0,
                        borderRightWidth: 0,
                        borderRadius: 5,
                    }}
                >
                    <CardItem
                        header
                        style={{
                            paddingBottom: 0,
                            paddingTop: 12,
                            paddingLeft: 12,
                            paddingRight: 12,
                            flexDirection: 'row',
                        }}
                    >
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontWeight: '700',
                                    fontSize: 16,
                                    color: '#555',
                                    fontFamily: 'system font',
                                }}
                            >
                                {this.props.lead.name}
                            </Text>
                            <Button
                                rounded
                                small
                                style={{
                                    backgroundColor: '#813588',
                                    marginLeft: 3,
                                    marginRight: 6,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 25,
                                }}
                            >
                                <Text
                                    style={{
                                        textTransform: 'capitalize',
                                        fontSize: 12,
                                        fontFamily: 'system font',
                                    }}
                                >
                                    {this.props.lead.classes.name}
                                </Text>
                            </Button>
                        </View>
                        {this.context.isConnected && !this.props.lead.is_otp_verified && (
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.openBottomSheetVerifyOTP()}
                                    style={{
                                        marginLeft: 'auto',
                                        marginTop: -23,
                                        marginRight: -12,
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderTopRightRadius: 3,
                                        borderWidth: 1,
                                        borderColor: '#813588',
                                    }}
                                >
                                    <Text style={{ color: '#813588', fontSize: 12, fontFamily: 'system font' }}>
                                        Verify Now
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </CardItem>

                    <CardItem
                        style={{
                            borderBottomColor: '#f6f6f6',
                            borderBottomWidth: 1,
                            paddingTop: 10,
                            paddingBottom: 5,
                            paddingLeft: 12,
                            paddingRight: 12,
                        }}
                    >
                        <Grid>
                            <Col style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode={'contain'} source={images.mobileIcon} style={{ width: 10 }} />
                                <Text

                                    style={{
                                        marginRight: 10,
                                        marginLeft: 7,
                                        fontSize: 14,
                                        color: '#555',
                                        fontFamily: 'system font',
                                    }}
                                >
                                    {this.props.lead.phone}
                                </Text>
                                <Image resizeMode={'contain'} source={images.emailIcon} style={{ width: 19 }} />
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 14,
                                        marginLeft: 7,
                                        color: '#555',
                                        fontFamily: 'system font',
                                    }}
                                    numberOfLines={1}
                                >
                                    {this.props.lead.email}
                                </Text>
                            </Col>
                        </Grid>
                    </CardItem>
                    <CardItem style={{ paddingTop: 5, paddingBottom: 0, paddingLeft: 12, paddingRight: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Grid>
                                <Col>
                                    <Text style={{ fontSize: 10, color: '#555', fontFamily: 'system font' }}>
                                        School Board
                                </Text>
                                </Col>
                                <Col style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 10, color: '#555', fontFamily: 'system font' }}>School</Text>
                                </Col>
                            </Grid>
                        </View>
                    </CardItem>
                    <CardItem style={{ paddingTop: 5, paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Grid>
                                <Col>
                                    <Text style={{ flex: 1, color: '#555', fontFamily: 'system font' }} numberOfLines={1}>
                                        {this.props.lead.board.name}
                                    </Text>
                                </Col>
                                <Col style={{ marginLeft: 20 }}>
                                    <Text style={{ flex: 1, color: '#555', fontFamily: 'system font' }} numberOfLines={1}>
                                        {this.props.lead.school_name}
                                    </Text>
                                </Col>
                            </Grid>
                        </View>
                    </CardItem>
                </Card>
                <RBSheet
                    ref={ref => {
                        this.RBSheetReverifyOTP = ref;
                    }}
                    closeOnPressMask={false}
                    animationType="fade"
                    duration={100}
                    height={280}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            bottom: this.state.keyboardHeight,
                        },
                    }}
                >
                    <BottomSheet
                        keyBoardStyle="numeric"
                        type="inputTypeOTP"
                        actionType="Submit"
                        description="Please enter the OTP sent to customer's registered number"
                        currentState={this.props.otpState}
                        onChangeText={this.onChangeTextBottomSheet}
                        data={['OTP']}
                        close={this.closeBottomSheet}
                        submit={this.submitOTP}
                        resend={this.handleResend}
                        title="Verify Customer"
                        value={this.state.otp}
                    />
                </RBSheet>
            </View>
        );

    }
}

const mapStateToProps = (state: AppState) => ({
    otpState: state.otpReducer,
    leadState: state.leadReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({

    sendOtp: bindActionCreators(sendOTP, dispatch),
    otpInitialState: bindActionCreators(otpInitAction, dispatch),
    submitOtp: bindActionCreators(submitOTP, dispatch),
    verifyLead: bindActionCreators(verifyLead, dispatch),
    fetchLeadReport: bindActionCreators(fetchLeadReport, dispatch),
    resetLead: bindActionCreators(resetLeads, dispatch),
    fetchLeads: bindActionCreators(fetchAllLeadsApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Lead);
