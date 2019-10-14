import * as React from 'react';
import { View, Text, Card, CardItem, Icon, Button, ListItem, Grid, Col, Row } from 'native-base';
import images from '../../assets';
import { Image, TouchableOpacity } from 'react-native';
import { NetworkContext } from '../../provider/network-provider';
import { useContext } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import { sendOTP, otpInitAction, submitOTP } from '../../redux/actions/otp-actions';

export interface LeadProps {
    lead: any;
    otpState: any;
    sendOtp(phone: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    otpInitialState(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    submitOtp(otp: String): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}


const Leadx = (props: LeadProps) => {
    const context = useContext(NetworkContext);

    const [otp, setOTP] = React.useState('');
    const [phone, setPhone] = React.useState('');

    const openBottomSheetVerifyOTP = async () => {
        //props.sendOtp(lead.phone);
        console.log('props.lead.phone', props.lead.phone);
        setPhone(props.lead.phone);
        this.RBSheetReverifyOTP.open();
        //console.log('lead', lead);

    }
    //console.log('phone bottom sheet', phone);
    const onChangeTextBottomSheet = (text: string, fieldName: string) => {
        //this.setState({ email: text });
        setOTP(text);
        console.log('otp', { otp });
    };

    const closeBottomSheet = () => {
        props.otpInitialState();
        setOTP('');
        this.RBSheetReverifyOTP.close();
        //this.props.resetForgotPassword();
    };

    const demo = async () => {
        console.log('updated phone', phone);
    }
    const handleResend = async () => {
        console.log('phone resend', { phone });

        // await props.sendOtp(phone);
    };

    const submitOTP = async () => {
        // Keyboard.dismiss();
        // await this.props.forgotPassword(this.state.email);
        // this.setState({ email: '' });

        await props.submitOtp(otp);
        setOTP('');
    };

    return (
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
                            {props.lead.name}
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
                                {props.lead.classes.name}
                            </Text>
                        </Button>
                    </View>
                    {context.isConnected && !props.lead.is_otp_verified && (
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    openBottomSheetVerifyOTP();
                                }}
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
                            {/* <Icon name="phone-portrait" style={{ fontSize: 20, width: 20, color: '#555' }} /> */}
                            <Image resizeMode={'contain'} source={images.mobileIcon} style={{ width: 10 }} />
                            <Text
                                onPress={() => handleResend()}
                                style={{
                                    marginRight: 10,
                                    marginLeft: 7,
                                    fontSize: 14,
                                    color: '#555',
                                    fontFamily: 'system font',
                                }}
                            >
                                {props.lead.phone}
                            </Text>
                            {/* <Icon name="mail" style={{ fontSize: 20, width: 25, color: '#555' }} /> */}
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
                                {props.lead.email}
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
                                    {props.lead.board.name}
                                </Text>
                            </Col>
                            <Col style={{ marginLeft: 20 }}>
                                <Text style={{ flex: 1, color: '#555', fontFamily: 'system font' }} numberOfLines={1}>
                                    {props.lead.school_name}
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
                        // bottom: this.state.keyboardHeight,
                    },
                }}
            >
                <BottomSheet
                    keyBoardStyle="numeric"
                    type="inputTypeOTP"
                    actionType="Submit"
                    description="Please enter the OTP sent to customer's registered number"
                    currentState={props.otpState}
                    onChangeText={onChangeTextBottomSheet}
                    data={['OTP']}
                    close={closeBottomSheet}
                    submit={submitOTP}
                    resend={() => { handleResend() }}
                    title="Verify Customer"
                    value={otp}
                />
            </RBSheet>
        </View>
    );
};
const mapStateToProps = (state: AppState) => ({
    otpState: state.otpReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendOtp: bindActionCreators(sendOTP, dispatch),
    otpInitialState: bindActionCreators(otpInitAction, dispatch),
    submitOtp: bindActionCreators(submitOTP, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Leadx);
