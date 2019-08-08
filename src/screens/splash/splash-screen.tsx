import * as React from 'react';
import { Container, Content } from 'native-base';
import { StatusBar, ImageBackground, Image, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import storage from '../../database/storage-service';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
}
export interface State {}
class Splash extends React.Component<Props, State> {
    async componentDidMount() {
        const user = await storage.get<string>('user');
        if (user) {
            var userObj = JSON.parse(user);
            this.props.navigation.replace(userObj.token ? 'Dashboard' : 'Login');
        } else {
            this.props.navigation.replace('Login');
        }
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <Container>
                <StatusBar backgroundColor="purple" barStyle="light-content" />
                <ImageBackground source={images.background} style={{ width, height }}>
                    <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Image source={images.logo} />
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}

export default Splash;
