import * as React from 'react'
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
import { ImageBackground, Dimensions, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import images from "../../assets";
import { NavigationScreenProp } from 'react-navigation'
import { connect } from 'react-redux'
import { NetworkContext } from '../../provider/network-provider'
import { login, logout } from '../../services/userService'
export interface Props {
  navigation: NavigationScreenProp<any>
  list: any
  login(username: string, password: string): void
}
export interface State {
  
    username: string,
    password:string
  
}
class Login extends React.Component<Props, State> {
  static contextType = NetworkContext

  handlePress() { }
  
  handleSubmit = () => {
    // this.props.navigation.navigate('Dashboard')
    // console.log('submit method',this.state.username);
    this.props.login(this.state.username,this.state.password);
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <ScrollView>
      <Container>
        <ImageBackground source={images.background} style={{ width, height }}>

          <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch', flex: 1 }}>
            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
              <Image source={images.logo} />
            </View>
            <Form>
            <Item floatingLabel={true} style={{ backgroundColor: 'white', borderRadius: 5, marginRight: 20, marginLeft: 20 }} >
                  <Label>Email</Label>
                  <Input onChangeText={(text) => this.setState({username: text})}/>
                </Item>
                <Item floatingLabel={true} style={{ backgroundColor: 'white', borderRadius: 5, marginRight: 20, marginLeft: 20, marginBottom: 20 }}>
                  <Label>Password</Label>
                  <Input onChangeText={(text) => this.setState({password: text})}/>
                  <Icon active name='eye' />
                </Item>
                <Button block={true} onPress={this.handleSubmit} style={{ backgroundColor: 'purple', borderRadius: 5, borderColor: 'white', borderWidth: 1, marginRight: 20, marginLeft: 20,marginBottom: 20 }}>
                  <Text>Sign In</Text>
                </Button>
                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                  <Text onPress={this.handlePress()} style={{color:'white'}}>Forgot Password?</Text>
                </View>
                </Form>
          </Content>
          </ImageBackground>
      </Container>
      </ScrollView>
        );
      }
    }
    
// const mapStateToProps = state => {
//   console.log(state)
//   const { user } = state
//   return { user }
// }

const mapDispatchToProps = dispatch => {
  return {
          login: (username, password) => {
          dispatch(login(username, password))
        },
      }
    }
    
    export default connect(mapDispatchToProps)(Login)
