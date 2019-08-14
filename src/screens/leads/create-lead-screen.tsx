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
} from 'native-base';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { fetchCampaigns } from '../../redux/actions/campaign-actions';
import { createLeadApi, verifyOTP } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { AppState } from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';
import styles from './lead-style';
import { StorageConstants } from '../../helpers/storage-constants';
import StorageService from '../../database/storage-service';
export interface CreateLeadProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    leadState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    createLead(newLead: any): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    generateAndVerifyOTP(phone: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface CreateLeadState {
    // lead: {};
    // selectedCampaign: '';
    campaignName: string;
    name: string;
    parent_name: string;
    email: string;
    phone: string;
    class_name: string;
    school_board: string;
    school_name: string;
    address: string;
    comments: string;
    campaign_id: string;
    country_id?: number;
    state_id?: number;
    country: string;
    state: string;
    city: string;
    pin_code: string;
}

//const Item = Picker.Item;
class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    static contextType = NetworkContext;
    static navigationOptions = {
        title: 'Capture Lead',
    };
    async componentDidMount() {
        try {
            const selectedCampaign = await StorageService.get<string>(StorageConstants.SELECTED_CAMPAIGN);
            this.setState({ campaign_id: selectedCampaign.id });
            this.setState({ campaignName: selectedCampaign.name });
        } catch (error) {
            console.log('Something went wrong', error);
        }

        if (this.context.isConnected) {
            await this.props.fetchCampaigns();
        } else {
            console.log('Show Offline pop-up');
        }
    }

    verifyOTP = async () => {
        await this.props.generateAndVerifyOTP(this.state.phone);
        console.log('OTP sent --->', this.props.leadState.otp);
        if (this.props.leadState.otp.status == 'ok') {
            this.props.navigation.navigate('OTP');
        }
    };

    constructor(props: CreateLeadProps) {
        super(props);
        this.state = {
            campaignName: 'INOX Cinema2',
            name: 'Ramesh K',
            parent_name: 'Suresh',
            email: 'zack@abc.com',
            phone: '7019432993', //'6361253956',
            class_name: 'class 9',
            school_board: 'CSKD',
            school_name: 'CDC',
            address: 'sadasd',
            comments: '',
            country_id: 101,
            state_id: 17,
            pin_code: '560095',
            city: 'blore',
            campaign_id: '722f088d-a34c-4c5e-bf9d-42810fa0bcaa',
            country: 'India',
            state: 'Kar',
        };
    }

    handleSubmit = async () => {
        console.log('state', this.state);
        const newLead = this.state;
        console.log('new Const', newLead);
        // uncomment below and pass state
        try {
            await this.verifyOTP();
            await this.props.createLead(newLead);
            // this.props.navigation.navigate('LeadList');
        } catch (error) {
            console.log('Error in createlead api call');
        }
    };

    loadDashboard = () => {
        this.props.navigation.navigate('Dashboard');
    };

    onBoardChange(value: string) {
        this.setState({
            school_board: value,
        });
    }
    onCountryChange(value: string) {
        console.log('onset country id', this.state, value, parseInt(value));
        const id = parseInt(value);
        this.setState({
            country_id: id,
            country: value,
        });
        console.log('onset country id', this.state, value, parseInt(value));
    }

    onStateChange(value: string) {
        console.log('onset state id', parseInt(value));
        this.setState({
            state_id: parseInt(value),
            state: value,
        });
        console.log('after state id', this.state, value, parseInt(value));
    }
    onClassChange(value: string) {
        this.setState({
            class_name: value,
        });
    }
    render() {
        return (
            <Container>
                <Content>
                    <View style={styles.campaingStyle}>
                        <Text>Your Campaign:{this.state.campaignName}</Text>
                        <Button small bordered style={styles.buttonChangeCampaingStyle}>
                            <Text style={{ color: 'purple' }}>Change</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Card>
                            <CardItem header>
                                <Text style={{ fontWeight: 'bold' }}>Student Details</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Student Name</Label>
                                        <Input
                                            onChangeText={text => this.setState({ name: text })}
                                            value={this.state.name}
                                            style={styles.borderStyle}
                                        />
                                    </Item>
                                    <Button style={{ backgroundColor: '#fdfdfd', marginBottom: 10 }}>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" />}
                                            style={{ width: undefined }}
                                            placeholder="Select your Board"
                                            placeholderStyle={{ color: '#bfc6ea' }}
                                            placeholderIconColor="#007aff"
                                            selectedValue={this.state.school_board}
                                            onValueChange={this.onBoardChange.bind(this)}
                                        >
                                            <Picker.Item label="Karnataka Board" value="Karnataka Board" />
                                            <Picker.Item label="Madya Pradesh Board" value="Madya Pradesh Board" />
                                            <Picker.Item label="Delhi Board" value="Delhi Board" />
                                        </Picker>
                                    </Button>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Item floatingLabel={true} style={{ marginBottom: 15, width: 180 }}>
                                            <Label style={{ marginLeft: 10 }}>School</Label>
                                            <Input
                                                onChangeText={text => this.setState({ school_name: text })}
                                                value={this.state.school_name}
                                                style={styles.borderStyle}
                                            />
                                        </Item>
                                        <Button
                                            style={{
                                                backgroundColor: '#F8F8F8',
                                                marginBottom: 10,
                                                width: 125,
                                                marginLeft: 15,
                                                height: 50,
                                            }}
                                        >
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                placeholder="Gender"
                                                placeholderStyle={{ color: '#bfc6ea' }}
                                                placeholderIconColor="#007aff"
                                                style={{ width: undefined }}
                                                selectedValue={this.state.class_name}
                                                onValueChange={this.onClassChange.bind(this)}
                                            >
                                                <Picker.Item label="Class 1" value="Class 1" />
                                                <Picker.Item label="Class 2" value="Class 2" />
                                                <Picker.Item label="Class 3" value="Class 3" />
                                                <Picker.Item label="Class 4" value="Class 4" />
                                            </Picker>
                                        </Button>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>

                        <Card>
                            <CardItem header>
                                <Text style={{ fontWeight: 'bold' }}>Parent Details</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Parent Name</Label>
                                        <Input
                                            onChangeText={text => this.setState({ parent_name: text })}
                                            value={this.state.parent_name}
                                            style={styles.borderStyle}
                                        />
                                    </Item>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Mobile Number</Label>
                                        <Input
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            onChangeText={text => this.setState({ phone: text })}
                                            value={String(this.state.phone)}
                                            style={styles.borderStyle}
                                        />
                                    </Item>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Alternate Mobile Number</Label>
                                        <Input keyboardType="phone-pad" maxLength={10} style={styles.borderStyle} />
                                    </Item>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Email</Label>
                                        <Input
                                            autoCompleteType="email"
                                            onChangeText={text => this.setState({ email: text })}
                                            value={this.state.email}
                                            style={styles.borderStyle}
                                        />
                                    </Item>
                                    <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                                        <Label style={{ marginLeft: 10 }}>Address</Label>
                                        <Input
                                            onChangeText={text => this.setState({ address: text })}
                                            value={this.state.address}
                                            style={styles.borderStyle}
                                        />
                                    </Item>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Button
                                            style={{
                                                backgroundColor: '#F8F8F8',
                                                marginBottom: 10,
                                                width: 155,
                                                height: 50,
                                            }}
                                        >
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                placeholder="Country"
                                                placeholderStyle={{ color: '#bfc6ea' }}
                                                placeholderIconColor="#007aff"
                                                style={{ width: undefined }}
                                                selectedValue={this.state.country}
                                                onValueChange={this.onCountryChange.bind(this)}
                                            >
                                                <Picker.Item label="India" value="1" />
                                                <Picker.Item label="Sri Lanka" value="2" />
                                            </Picker>
                                        </Button>
                                        <Button
                                            style={{
                                                backgroundColor: '#F8F8F8',
                                                marginBottom: 10,
                                                width: 155,
                                                height: 50,
                                                marginLeft: 10,
                                            }}
                                        >
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                placeholder="State"
                                                placeholderStyle={{ color: '#bfc6ea' }}
                                                placeholderIconColor="#007aff"
                                                style={{ width: undefined }}
                                                selectedValue={this.state.state}
                                                onValueChange={this.onStateChange.bind(this)}
                                            >
                                                <Picker.Item label="Karnataka" value="1" />
                                                <Picker.Item label="Madya Pradesh" value="2" />
                                            </Picker>
                                        </Button>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Item floatingLabel={true} style={{ width: 155 }}>
                                            <Label style={{ marginLeft: 10 }}>City</Label>
                                            <Input
                                                onChangeText={text => this.setState({ city: text })}
                                                value={this.state.city}
                                                style={styles.borderStyle}
                                            />
                                        </Item>
                                        <Item floatingLabel={true} style={{ width: 155, marginLeft: 10 }}>
                                            <Label style={{ marginLeft: 10 }}>Pin code</Label>
                                            <Input style={styles.borderStyle} />
                                        </Item>
                                    </View>

                                    <Textarea
                                        rowSpan={5}
                                        onChangeText={text => this.setState({ comments: text })}
                                        style={styles.borderTextareaStyle}
                                        value={this.state.comments}
                                        placeholder="Comments"
                                    />
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}></View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full={true} onPress={this.handleSubmit} style={{ backgroundColor: 'purple' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    campaignState: state.campaignReducer,
    leadState: state.leadReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    createLead: bindActionCreators(createLeadApi, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    generateAndVerifyOTP: bindActionCreators(verifyOTP, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateLead);
