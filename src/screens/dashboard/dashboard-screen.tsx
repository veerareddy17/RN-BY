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
} from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import { Image, View } from 'react-native';
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
class Dashboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            campaignId: '',
            campaignName: '',
        };
    }

    componentDidMount() {}

    getLeads = () => {
        this.props.navigation.navigate('LeadList');
    };

    createLead = () => {
        this.props.navigation.navigate('CreateLead');
    };

    logout = async () => {
        await this.props.logout();
        if (this.props.userState.user == '') {
            // TODO: Need to pop all screens before navigating to login. Look for popToTop() method
            this.props.navigation.navigate('Login');
        }
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: 'purple' }} androidStatusBarColor="purple">
                    <Left>
                        <Button transparent></Button>
                    </Left>
                    <Body>
                        <Title>Dashboard</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.logout}>
                            <Icon name="ios-log-out" style={{ color: 'white' }} />
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <View style={{ alignItems: 'center', flexDirection: 'column', padding: 10 }}>
                        <Image source={images.workProgress} />
                    </View>
                </Content>

                <Footer>
                    <FooterTab style={{ backgroundColor: 'purple' }}>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 0}
                            // onPress={() => this.logout}
                        >
                            <Icon name="home" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Dashboard</Text>
                        </Button>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 1}
                            onPress={this.createLead}
                        >
                            <Icon name="add" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead Capture</Text>
                        </Button>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 2}
                            onPress={this.getLeads}
                        >
                            <Icon name="person" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead List</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

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
