import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    Platform,
} from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import { NavigationScreenProp } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Spinner } from 'native-base';
import store from '../../redux/store';
import FloatLabelTextInput from '../floating-label/floating-label';
import images from '../../assets';

export interface Props {
    navigation?: NavigationScreenProp<any>;
    data: Array<Object>;
    statuses?: Array<String>;
    // description?: String;
    title: String;
    actionType?: String;
    type: String;
    close: Function;
    onChangeText?: Function;
    onPress?: void;
    submit?: Function;
    currentcampaign?: string;
    currentState: any;
    keyBoardStyle?: string;
    resend?: Function;
    value?: string;
}
export interface State {
    email: string;
    error: string;
    hasError: boolean;
}

export default class BottomSheet extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            email: '',
            hasError: true,
            error: '',
        };
    }

    onBlur() {}
    onChangeHandle = (text: String, item: String) => {
        this.props.onChangeText(text, item);
    };
    _onPressClose = () => {
        this.props.close();
        this.setState({ email: '' });
    };
    _selectCard = (index: Number, item: Object) => {
        this.props.onPress(index, item);
        this.props.close();
    };
    handleSubmit = async () => {
        if (this.props.value === '') {
            this.setState({ error: 'Email Id is a required field' });
            this.setState({ hasError: true });
            return;
        }

        if (this.validate(this.props.value)) {
            await this.props.submit();
            if (this.props.currentState.error) {
                console.log('inside');
                this.setState({ hasError: true });
                console.log('state error', this.state.hasError);
            }
        } else {
            this.setState({ error: 'Email Id must be a valid email' });
            this.setState({ hasError: true });
        }
    };
    handleResend = () => {
        this.props.resend();
    };

    validate = (text: string) => {
        console.log('validate', this.state.hasError);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.props.currentState.error) {
            this.props.currentState.error = '';
        }
        if (reg.test(text) === false) {
            return false;
        } else {
            this.setState({ error: '' });
            this.setState({ email: text });
            this.setState({ hasError: false });
            return true;
        }
    };

    renderItem(type: String) {
        switch (type) {
            case 'inputType':
                return (
                    <View style={{ width: '100%' }}>
                        {this.props.data.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View
                                        key={index}
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            height: 65,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginLeft: 20,
                                                    marginRight: 20,
                                                    flexDirection: 'row',
                                                    borderColor: '#888',
                                                    borderRadius: 5,
                                                    borderWidth: 1,
                                                }}
                                            >
                                                <FloatLabelTextInput
                                                    placeholder={item}
                                                    keyboardType={this.props.keyBoardStyle}
                                                    onChangeText={(text: String) => {
                                                        this.validate(text);
                                                        this.onChangeHandle(text, item);
                                                    }}
                                                    value={this.props.value}
                                                    returnKeyType="done"
                                                    onSubmitEditing={() => this.handleSubmit()}
                                                />
                                                <View
                                                    style={{
                                                        padding: 8,
                                                        backgroundColor: '#fff',
                                                        borderTopRightRadius: 5,
                                                        borderBottomRightRadius: 5,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    {this.props.currentState.isLoading ? (
                                        <View style={{ marginTop: 10 }}>
                                            <ActivityIndicator size="small" />
                                        </View>
                                    ) : null}
                                    {this.props.currentState.error ? (
                                        <View style={{ marginLeft: 20 }}>
                                            <Text style={{ color: '#ff0000', fontSize: 11 }}>
                                                {this.props.currentState.error}
                                            </Text>
                                        </View>
                                    ) : null}
                                    {this.state.hasError ? (
                                        <View style={{ marginLeft: 20 }}>
                                            <Text style={{ color: '#ff0000', fontSize: 11 }}>{this.state.error}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                );
            case 'List':
                return (
                    <FlatList
                        style={{}}
                        data={this.props.data}
                        renderItem={({ item, index }) => (
                            <View key={item.id} style={{ flexDirection: 'row', flex: 1 }}>
                                <TouchableOpacity
                                    disabled={this.props.data[index].id == this.props.currentcampaign ? true : false}
                                    onPress={() => this._selectCard(index, item)}
                                    style={{
                                        borderBottomWidth: 1,
                                        borderColor: '#f3f3f3',
                                        flex: 1,
                                        marginHorizontal: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 50,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{ flex: 0.9 }}>
                                            <Text
                                                style={{
                                                    color:
                                                        this.props.data[index].id == this.props.currentcampaign
                                                            ? '#813588'
                                                            : '#333',
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </View>

                                        {this.props.data[index].id == this.props.currentcampaign ? (
                                            <View
                                                style={{
                                                    flex: 0.1,
                                                }}
                                            >
                                                <Icon
                                                    name="checkmark"
                                                    style={{
                                                        color: '#813588',
                                                        marginLeft: 10,
                                                    }}
                                                ></Icon>
                                            </View>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                );
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={this._onPressClose}>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 60,
                                height: 60,
                                borderBottomRightRadius: 60,
                                backgroundColor: '#813588',
                                borderWidth: 1,
                                borderColor: '#813588',
                            }}
                        >
                            <Text style={{ marginRight: 10 }}>
                                <Icon style={{ color: '#fff', fontSize: 30 }} name="close" />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center', height: 60 }}>
                        <Text
                            style={{
                                fontSize: Platform.OS === 'ios' ? 18 : 20,
                                alignSelf: 'center',
                                marginRight: 60,
                                fontWeight: '700',
                                color: '#555555',
                            }}
                        >
                            {this.props.title}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {this.props.currentState &&
                    this.props.currentState.forgotPasswordResponse &&
                    this.props.currentState.forgotPasswordResponse.success ? (
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={images.emailBox} />
                        </View>
                    ) : this.props.type == 'inputType' ? (
                        <View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginLeft: 60,
                                    marginRight: 60,
                                    marginBottom: 5,
                                    color: '#555',
                                }}
                            >
                                We will send you a link to reset your password
                            </Text>
                            <Text
                                style={{
                                    marginLeft: 60,
                                    marginRight: 60,
                                    textAlign: 'center',
                                    color: '#555',
                                }}
                            >
                                Enter you registered email address
                            </Text>
                        </View>
                    ) : null}
                    {this.props.currentState &&
                    this.props.currentState.forgotPasswordResponse &&
                    this.props.currentState.forgotPasswordResponse.success ? (
                        <Text
                            style={{
                                textAlignVertical: 'center',
                                marginLeft: 60,
                                marginRight: 60,
                                marginTop: 15,
                                textAlign: 'center',
                                color: '#555',
                            }}
                        >
                            We have sent a reset password link to your email account
                        </Text>
                    ) : this.props.data.length == 0 ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        this.renderItem(this.props.type)
                    )}
                </View>
                {this.props.currentState &&
                this.props.currentState.forgotPasswordResponse &&
                this.props.currentState.forgotPasswordResponse.success ? null : this.props.actionType != null ? (
                    <TouchableOpacity
                        disabled={this.state.hasError}
                        onPress={() => this.handleSubmit()}
                        style={{
                            height: 50,
                            backgroundColor: this.state.hasError ? '#9A9A9A' : '#813588',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{this.props.actionType}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    labelInput: {
        color: '#555555',
        fontSize: 14,
    },
    formInput: {
        borderWidth: 1.5,
        borderColor: '#333',
        paddingBottom: 5,
    },
    input: {
        borderWidth: 0,
        marginTop: 10,
        paddingBottom: 2,
    },
});
