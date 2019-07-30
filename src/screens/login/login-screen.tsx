import * as React from "react";
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
  Label,
  Input,
  Icon
} from 'native-base';

import { NavigationScreenProp } from 'react-navigation';
import { ImageBackground, Dimensions, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import loginStyles from "./login-style";
import images from "../../assets";

export interface Props {
  navigation: NavigationScreenProp<any>;
  list: any;
}
export interface State { }

class Login extends React.Component<Props, State> {
  handlePress() { }
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
                  <Input />
                </Item>
                <Item floatingLabel={true} style={{ backgroundColor: 'white', borderRadius: 5, marginRight: 20, marginLeft: 20, marginBottom: 20 }}>
                  <Label>Password</Label>
                  <Input />
                  <Icon active name='eye' />
                </Item>
                <Button block={true} style={{ backgroundColor: 'purple', borderRadius: 5, borderColor: 'white', borderWidth: 1, marginRight: 20, marginLeft: 20,marginBottom: 20 }}>
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

export default Login;
