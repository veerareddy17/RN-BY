import * as React from 'react';
import { Container, Content } from 'native-base';
import { StatusBar, ImageBackground, Image, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import { AuthenticationService } from '../../services/authentication-service';

export interface Props {
    navigation: NavigationScreenProp<any>;
    list: any;
}
export interface State {}
class Splash extends React.Component<Props, State> {
    static navigationOptions = { header: null };
    async componentDidMount() {
        // const userTokenExists = await AuthenticationService.authCheck();
        // // this.props.navigation.navigate(userTokenExists ? 'App' : 'Auth');
        this.props.navigation.navigate('Auth');
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <Container>
                <StatusBar backgroundColor="#813588" barStyle="light-content" />
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
