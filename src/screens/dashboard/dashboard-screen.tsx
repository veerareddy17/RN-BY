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
} from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import { Image, View, Platform, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { logout } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
export interface Props {
    navigation: NavigationScreenProp<any>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
}
export interface State {
    campaignId: any;
    campaignName: any;
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

    constructor(props: Props) {
        super(props);
        this.state = {
            campaignId: '',
            campaignName: '',
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ logout: this.logout });
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
                            <Title style={{ color: 'white', fontWeight: 'bold',fontSize: 18, marginLeft: 10 }}>Dashboard</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.logout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                )}

                <Content style={{ backgroundColor: '#eee' }}>
                    <View style={styles.containerStyle}>
                        <View style={styles.sliderContainerStyle}></View>
                    </View>
                    <Card style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
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
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1}}>Leads today</Text>
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
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1 }}>Leads this week</Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24}}>15</Text>
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
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1, textTransform: 'none' }}>Leads this month</Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>935</Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                        </CardItem>
                    </Card>
                    <Card style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20 }}>
                        <CardItem header style={{borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                            <Text style={{ fontWeight: 'bold', color: '#555' }}>Current Campaign</Text>
                        </CardItem>
                        <CardItem>
                            <Text numberOfLines={1} style={{ flex: 1, marginRight: 10, color: '#555' }}>
                                RR Arcade
                            </Text>
                            <Button small bordered style={{ borderColor: '#813588' }}>
                                <Text style={{ color: '#813588' }}>Change</Text>
                            </Button>
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Dashboard);
