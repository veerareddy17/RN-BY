import * as React from "react";
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
  List,
  ListItem
} from "native-base";

import {NavigationScreenProp} from 'react-navigation';

export interface Props {
  navigation: NavigationScreenProp<any>;
  list: any;
}
export interface State {}
class Login extends React.Component<Props, State> {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Text>Header</Text>
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>Login Content</Text>
          <Button onPress={()=>this.props.navigation.navigate('Dashboard')}/>
        </Content>
      </Container>
    );
  }
}

export default Login;
