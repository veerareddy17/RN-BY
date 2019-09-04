import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import { NavigationScreenProp } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Spinner } from 'native-base';
import store from '../../redux/store';

export interface Props {
    navigation?: NavigationScreenProp<any>;
    data: Array<Object>;
    statuses?: Array<String>;
    description?: String;
    title: String;
    actionType?: String;
    type: String;
    close: void;
    onChangeText?: void;
    onPress?: void;
    submit?: Function;
    currentState: any;
    keyBoardStyle?: string
    resend?: Function;
}
export interface State {

}

export default class BottomSheet extends React.Component<Props, State> {

    onBlur() {
        console.log('#####: onBlur');
    }
    onChangeHandle = (text: String, item: String) => {
        console.log('text,item', text, item)
        this.props.onChangeText(text, item)
    }
    _onPressClose = () => {
        this.props.close();

    }
    _selectCard = (index: Number, item: Object) => {
        this.props.onPress(index, item);
        this.props.close();
    }
    handleSubmit = () => {
        this.props.submit();
    }
    handleResend = () => {
        this.props.resend();
    }
    renderItem(type: String) {
        console.log('current state in bottom sheet', this.props.currentState)
        switch (type) {
            case "inputType":
                return <KeyboardAwareScrollView
                    style={{ width: "100%", }}>
                    {this.props.data.map((item, index) => {
                        return <View>
                            <View key={index}
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    height: 65,
                                }}>
                                <View style={{
                                    flex: 1, borderWidth: 1,
                                    borderColor: "rgba(136,136,136,0.4)",
                                    backgroundColor: "rgba(252,252,252,0.6)",
                                    marginLeft: 40, marginRight: 40, borderRadius: 5, marginTop: 10
                                }}>
                                    <FloatingLabel
                                        keyboardType={this.props.keyBoardStyle}
                                        labelStyle={styles.labelInput}
                                        inputStyle={styles.input}
                                        onChangeText={(text: String) => { this.onChangeHandle(text, item) }}
                                        onBlur={this.onBlur}
                                    >{item}</FloatingLabel>
                                </View>
                            </View>
                            <View style={{ marginLeft: 40, marginRight: 40, borderRadius: 5, marginTop: 5 }}>
                                {this.props.currentState.isLoading ?
                                    (<View>
                                        <Spinner />
                                    </View>) : this.props.currentState.error ?
                                        <Text style={{ color: "red" }}>{this.props.currentState.error}</Text>
                                        : <View />}
                            </View>
                        </View>
                    })}
                </KeyboardAwareScrollView>
                break;
            case "inputTypeOTP":
                return <KeyboardAwareScrollView
                    style={{ width: "100%", }}>
                    {this.props.data.map((item, index) => {
                        return <View key={item}>
                            <View key={index}
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    height: 65,
                                }}>
                                <View style={{
                                    flex: 1, borderWidth: 1,
                                    borderColor: "rgba(136,136,136,0.4)",
                                    backgroundColor: "rgba(252,252,252,0.6)",
                                    marginLeft: 40, marginRight: 40, borderRadius: 5, marginTop: 10
                                }}>
                                    <FloatingLabel
                                        keyboardType={this.props.keyBoardStyle}
                                        labelStyle={styles.labelInput}
                                        inputStyle={styles.input}
                                        onChangeText={(text: String) => { this.onChangeHandle(text, item) }}
                                        onBlur={this.onBlur}
                                    >{item}</FloatingLabel>
                                </View>
                            </View>
                            <View style={{ marginLeft: 40, marginRight: 40, borderRadius: 5, marginTop: 5 }}>
                                {this.props.currentState.isLoading ?
                                    (<View>
                                        <Spinner />
                                    </View>) : this.props.currentState.error ?
                                        <Text style={{ color: "red" }}>{this.props.currentState.error}</Text>
                                        : <View />}
                            </View>
                            <View style={{ marginLeft: 'auto', marginRight: 40 }}>
                                <Text style={{ color: '#813588' }} onPress={() => this.handleResend()}>Resend OTP</Text>
                            </View>
                        </View>
                    })}
                </KeyboardAwareScrollView>
                break;
            case "List": return <FlatList
                data={this.props.data}
                extraData={this.props.statuses}
                renderItem={({ item, index }) =>

                    <View key={item.id}
                        style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => this._selectCard(index, item)} style={{ borderBottomWidth: 0.2, width: "100%", }}>
                            <View style={{ height: 50, justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                <Text style={{ marginLeft: 30, color: this.props.statuses[index] == "visible" ? "#555555" : "#813588" }}>
                                    {item.name}
                                </Text>
                                {this.props.statuses[index] == "visible" ? <Text></Text> : <Text style={{ marginRight: 10, color: "#813588" }}>yes</Text>}
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
        }
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                    <TouchableOpacity onPress={this._onPressClose}>
                        <View style={{
                            justifyContent: "center", alignItems: "center",
                            width: 60,
                            height: 60,
                            borderBottomRightRadius: 60,
                            backgroundColor: "purple"
                        }}>
                            <Text style={{ marginRight: 10 }}>
                                <Icon style={{ color: "white" }} name="close" />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "center", height: 60, }}>
                        <Text style={{ fontSize: 22, alignSelf: "center", marginRight: 60, fontWeight: "bold", color: "#555555" }}>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ textAlignVertical: "center", textAlign: "center", color: '#813588' }}>
                        {this.props.description}
                    </Text>
                    {this.props.data.length == 0 ? <ActivityIndicator size="large" color="#0000ff" /> : this.renderItem(this.props.type)}
                </View>
                {this.props.actionType != null ? <TouchableOpacity
                    onPress={() => this.handleSubmit()}
                    style={{
                        height: 50, backgroundColor: "purple",
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                        justifyContent: "center", alignItems: "center"
                    }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                        {this.props.actionType}
                    </Text>
                </TouchableOpacity> : <Text></Text>}
            </View>
        );
    }
}

var styles = StyleSheet.create({

    labelInput: {
        color: '#555555',
        fontSize: 14
    },
    formInput: {
        borderWidth: 1.5,
        borderColor: '#333',

        paddingBottom: 5
    },
    input: {
        borderWidth: 0,
        marginTop: 10,
        paddingBottom: 2
    }
});