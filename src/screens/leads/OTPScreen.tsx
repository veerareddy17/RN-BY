import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Left, Body, Right, Title } from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export default class OTPScreen extends Component {
    getCode(code: string) {
        console.log('code:', code);
    }

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
                    <OTPInputView
                        style={{ width: '80%', height: 200 }}
                        pinCount={4}
                        code=""
                        autoFocusOnLoad={true}
                        // codeInputFieldStyle={styles.borderStyleBase}
                        // // codeInputHighlightStyle={styles.borderStyleHighLighted}
                        // codeInputFieldStyle={styles.underlineStyleBase}
                        // codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={code => {
                            console.log(`Code is ${code}, you are good to go!`);
                        }}
                    />
                </Content>
            </Container>
        );
    }
}
