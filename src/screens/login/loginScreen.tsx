import * as React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Left,
  Body,
  Right,
  Form,
  Item,
  Input,
  Label,
  Icon
} from 'native-base'
import { StatusBar, ImageBackground, Dimensions, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import images from "../../assets";
import { NavigationScreenProp } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch, bindActionCreators, AnyAction } from 'redux';

import { NetworkContext } from '../../provider/network-provider';
import { loginApi } from '../../redux/actions/userActions';
import { AppState } from '../../redux/reducers/index';
import styles from './loginStyle';
import AsyncStorage from '@react-native-community/async-storage';

export interface Props {
  navigation: NavigationScreenProp<any>;
  list: any;
  user: any;
  token: string;
  login(username: string, password: string): void;
  requestLoginApi(username: string, password: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}
export interface State {
  showPassword: boolean,
  username: string,
  password: string

}
class Login extends React.Component<Props, State> {
  static contextType = NetworkContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      showPassword: true,
      username: '',
      password: ''
    }
  }

  handlePress() { }

  handleSubmit = async () => {
    console.log(' User', this.state.username, this.state.password);

    await this.props.requestLoginApi(this.state.username, this.state.password);
    // comented let userData = JSON.parse(this.props.user);
    console.log('Props User token:-----', this.props.user.user.token);

    const userToken = await AsyncStorage.getItem('userToken');
    console.log('storage user :====', userToken);
    this.props.navigation.navigate(userToken ? 'Dashboard' : 'Login');
    // this.props.navigation.navigate('Dashboard');
  };

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <ScrollView>
        <Container>
          <ImageBackground source={images.background} style={{ width, height }}>
            <StatusBar backgroundColor="purple" barStyle="light-content" />
            <Content contentContainerStyle={styles.containerStyle}>
              <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                <Image source={images.logo} />
              </View>
              <View style={{}}>
                <Form>
                  <Item floatingLabel={true} style={styles.userName} >
                    <Label style={{ marginLeft: 10 }}>Email</Label>
                    <Input onChangeText={(text) => this.setState({ username: text })} style={{ marginLeft: 10 }} />
                  </Item>
                  <Item floatingLabel={true} style={styles.password}>
                    <Label style={{ marginLeft: 10 }}>Password</Label>
                    <Input secureTextEntry={this.state.showPassword} onChangeText={(text) => this.setState({ password: text })} style={{ marginLeft: 10 }} />
                    <Icon active name='eye' onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                  </Item>

                  <Button block={true} onPress={this.handleSubmit} style={styles.submitButton}>
                    <Text>Sign In</Text>
                  </Button>
                  <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <Text onPress={this.handlePress()} style={{ color: 'white' }}>Forgot Password?</Text>
                  </View>
                </Form>
              </View>
            </Content>
          </ImageBackground>
        </Container>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  requestLoginApi: bindActionCreators(loginApi, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
