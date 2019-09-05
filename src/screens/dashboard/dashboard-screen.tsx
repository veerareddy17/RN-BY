import * as React from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right,
    Footer,
    FooterTab,
    Card,
    CardItem,
    List,
    ListItem,
    Item,
    Spinner,
} from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import { Image, View, Platform, Dimensions, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { logout } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { fetchCampaigns, selectedCampaign } from '../../redux/actions/campaign-actions';
import { withNavigation } from 'react-navigation';
import { NetworkContext } from '../../provider/network-provider';
import { fetchMetaData } from '../../redux/actions/meta-data-actions';

export interface Props {
    navigation: NavigationScreenProp<any>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    campaignState: any;
    metaData: any;
    fetchMetaData(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
}

export interface State {
    campaignName: string;
    campaignId: string;
    campaignList: Array<String>;
}
const window = Dimensions.get('window');
class Dashboard extends React.Component<Props, State> {
    // static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     return {
    //         title: 'Dashboard',
    //         headerRight: (
    //             <Button transparent onPress={() => params.logout()}>
    //                 <Icon name="ios-log-out" style={{ color: 'white' }} />
    //             </Button>
    //         ),
    //     };
    // };
    static contextType = NetworkContext;
    constructor(props: Props) {
        super(props);
        this.state = {
            campaignId: '',
            campaignName: '',
            campaignList: [],
        };
    }

    componentDidMount() {
        try {
            console.log('inside did mount');
            if (this.context.isConnected) {
                console.log('inside');
                this.focusListener = this.props.navigation.addListener('didFocus', async () => {
                    const selectedCampaign = await StorageService.get<string>(StorageConstants.SELECTED_CAMPAIGN);
                    await this.props.fetchMetaData();
                    await this.props.fetchCampaigns();
                    console.log('campagin state', this.props.campaignState);
                    const compaignList = this.props.campaignState.campaignList;
                    this.setState({ campaignList: compaignList });
                    this.setState({ campaignId: selectedCampaign.id });
                    this.setState({ campaignName: selectedCampaign.name });


                });
            } else {
                /*
            show offline
            */
            }
        } catch (error) {
            /*
            error to be handled
            */
        }
    }

    componentWillUnmount() {
        // Remove the event listener
        console.log('listener removed');
        this.focusListener.remove();
    }

    getLeads = () => {
        this.props.navigation.navigate('LeadList'); // Can be set to 'FilteredLeads' screen
    };

    logout = async () => {
        await this.props.logout();
        if (this.props.userState.user == '') {
            // TODO: Need to pop all screens before navigating to login. Look for popToTop() method
            this.props.navigation.navigate('Auth');
        }
    };

    confirmLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.logout() },
            ],
            { cancelable: false },
        );
    };

    closeBottomSheet = () => {
        this.RBSheet.close();
    };

    onPressCampaign = (index: number, campaign: Object) => {
        console.log('on click bottom sheet', campaign);
        this.props.selectCampaign(campaign);
        this.setState({
            ...this.state,
            campaignName: campaign.name,
            campaignId: campaign.id,
        });
    };

    render() {
        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Left />
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold' }}>Dashboard</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.logout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                ) : (
                        <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                            <Body>
                                <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 10 }}>
                                    Dashboard
                            </Title>
                            </Body>
                            <Right>
                                <Button transparent onPress={this.confirmLogout}>
                                    <Icon name="ios-log-out" style={{ color: 'white' }} />
                                </Button>
                            </Right>
                        </Header>
                    )}

                <Content style={{ backgroundColor: '#eee' }}>
                    <View style={styles.containerStyle}>
                        <View style={styles.sliderContainerStyle}></View>
                    </View>
                    <Card
                        style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20, marginBottom: 20 }}
                    >
                        <CardItem
                            header
                            style={{
                                justifyContent: 'center',
                                paddingTop: 0,
                                paddingBottom: 0,
                                height: 80,
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    top: -50,
                                }}
                            >
                                <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 10 }}>
                                    Hi Praveen
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: '#fbd4ff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: '#813588',
                                        width: 95,
                                        height: 95,
                                    }}
                                >
                                    <Text style={{ fontSize: 30, color: '#813588', fontWeight: 'bold' }}>20</Text>
                                </View>
                                <Text style={{ fontSize: 16, color: '#813588', fontWeight: 'bold' }}>Total Leads</Text>
                            </View>
                        </CardItem>
                        <CardItem style={{ flexDirection: 'column', paddingTop: 0 }}>
                            <Item>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={this.getLeads}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1 }}>
                                        Leads today
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>05</Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                            <Item>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={this.getLeads}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1 }}>
                                        Leads this week
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>15</Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={this.getLeads}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text
                                        style={{
                                            color: '#555',
                                            paddingLeft: 0,
                                            fontSize: 16,
                                            flex: 1,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Leads this month
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>935</Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                        </CardItem>
                    </Card>
                    <Card style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20 }}>
                        <CardItem header style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold', color: '#555' }}>Current Campaign</Text>
                        </CardItem>
                        <CardItem>
                            {this.props.campaignState.isLoading ? (
                                <View style={{ flex: 1, height: 30 }}>
                                    <Spinner size={15} color="#813588" style={{ marginTop: -25 }} />
                                </View>
                            ) : (
                                    <Text numberOfLines={1} style={{ flex: 1, marginRight: 10, color: '#555' }}>
                                        {this.state.campaignName}
                                    </Text>
                                )}
                            <Button
                                small
                                bordered
                                onPress={() => {
                                    this.RBSheet.open();
                                }}
                                style={{ borderColor: '#813588' }}
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
                                    currentcampaign={this.state.campaignId}
                                    data={this.state.campaignList}
                                    close={this.closeBottomSheet}
                                    title="Change Campaign"
                                    onPress={this.onPressCampaign}
                                />
                            </RBSheet>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 1.6,
    },
    sliderContainerStyle: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#813588',
    },
    // slider: {
    //     height: window.width / 1.7,
    //     width: window.width,
    //     position: 'absolute',
    //     bottom: 0,
    //     marginLeft: window.width / 2,
    //     backgroundColor: '#9DD6EB',
    // },
});
const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
    campaignState: state.campaignReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    fetchMetaData: bindActionCreators(fetchMetaData, dispatch)
});

export default withNavigation(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Dashboard),
);
