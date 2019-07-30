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

export interface Props {
  navigation: any;
  list: any;
}
export interface State {}
class Dashboard extends React.Component<Props, State> {

  getLeads = () => {
    store.dispatch(fetchAllLeads())
    this.props.navigation.navigate('LeadList')
  }

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
           <Button onPress={this.getLeads}>
              <Text>Get leads</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}

export default Dashboard;
