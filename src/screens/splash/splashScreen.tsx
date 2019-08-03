import * as React from 'react'
import {
  Container,
  Content,

} from 'native-base';
import { StatusBar, ImageBackground, Image, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import images from "../../assets";
import AsyncStorage from '@react-native-community/async-storage';

export interface Props {
  navigation: NavigationScreenProp<any>;
  list: any;
}
export interface State { }
class Splash extends React.Component<Props, State> {

  async componentDidMount() {

    const userToken = await AsyncStorage.getItem('userToken');
    console.log('storage user :====', userToken);
    this.props.navigation.navigate(userToken ? 'Dashboard' : 'Login');
    // setTimeout(() => {
    //   this.props.navigation.navigate('Login');
    // }, 5000);
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <Container>
        <StatusBar backgroundColor="purple" barStyle="light-content" />
        <ImageBackground source={images.background} style={{ width, height }}>
          <Content contentContainerStyle={{ justifyContent: 'center', alignItems: "center", flex: 1 }}>
            <Image source={images.logo} />
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}

export default Splash;
