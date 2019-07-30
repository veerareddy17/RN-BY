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
} from 'native-base'

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
  user: {
    username: 'abc'
    password: 'abc'
  }
}
class Login extends React.Component<Props, State> {
  static contextType = NetworkContext

  // handleSubmit = () => {
  //   const { username, password } = this.state.user

  //   if (username && password) {
  //     this.props.login(username, password)
  //   }
  // }

  // handleOnChange = e => {
  //   const { user } = { ...this.state }
  //   const currentState = user
  //   const { name, value } = e.target
  //   currentState[name] = value

  //   this.setState({ user: currentState })
  // }

  handleSubmit = () => {
    this.props.navigation.navigate('Dashboard')
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button>
              <Text>Header</Text>
            </Button>
          </Left>
          <Body>
            <Title>Login </Title>
            <Text>
              You are now {this.context.isConnected ? 'online' : 'offline'}
            </Text>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form>
            <Item regular>
              <Input placeholder="Username" />
            </Item>
            <Item regular>
              <Input placeholder="Password" />
            </Item>
          </Form>
          <Button onPress={this.handleSubmit}>
            <Text>Login</Text>
          </Button>
        </Content>
      </Container>
    )
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
