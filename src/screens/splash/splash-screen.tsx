import * as React from "react";
import {
  Container,
  Content,

} from 'native-base';
import { ImageBackground, Image, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import images from "../../assets";

export interface Props {
  navigation: NavigationScreenProp<any>;
  list: any;
}
export interface State { }
class Splash extends React.Component<Props, State> {

  componentDidMount(){
      setTimeout(() => {
          this.props.navigation.navigate('Login');
      }, 3000);
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <Container>
        <ImageBackground source={images.background} style={{ width, height }}>
          <Content contentContainerStyle={{ justifyContent: 'center', alignItems: "center", flex: 1 }}>
            <Image source={images.logo} />
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

export default Splash;
