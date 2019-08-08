import React, { Component } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Container, Header, Content, Button, Text, Left, Body, Right, Title, Item, Input, Toast } from 'native-base';
import styles from './otp-style';
import storage from '../../database/storage-service';

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

    handleSubmit = async () => {
        console.log('OTP entered', this.state.otp);
        const storedOTP = await storage.get<string>('OTP');
        console.log('From storage->', storedOTP);
        if (storedOTP === JSON.stringify(this.state.otp)) {
            console.log('Lead created successfully...');
            // Toast.show({
            //     text: 'Lead created successfully...',
            // });
            this.props.navigation.navigate('Dashboard');
        } else {
            console.log('OTP mismatch...Click Re-send');
        }
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
                            keyboardType="number-pad"
                            onChangeText={text => this.setState({ otp: text })}
                        />
                    </Item>
                    <Button block={true} onPress={this.handleSubmit} style={styles.submitButton}>
                        <Text>Submit</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export default OTPScreen;
