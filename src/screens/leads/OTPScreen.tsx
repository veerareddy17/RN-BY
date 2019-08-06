import React, { Component } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Container, Header, Content, Button, Text, Left, Body, Right, Title, Item, Input } from 'native-base';
import styles from './OTPStyle';

export interface Props {
    navigation: NavigationScreenProp<any>;
}
export interface State {
    otp: string;
}

class OTPScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            otp: '',
        };
    }

    getCode = (code: string) => {
        console.log('code:', code);
    };

    handleSubmit = () => {
        console.log('OTP entered');
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Enter OTP</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Item regular>
                        <Input
                            style={styles.otp}
                            placeholder="OTP"
                            onChangeText={text => this.setState({ otp: text })}
                        />
                    </Item>
                    <Button block={true} onPress={this.handleSubmit} style={styles.submitButton}>
                        <Text>Sign In</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export default OTPScreen;
