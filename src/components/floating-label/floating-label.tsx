import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Animated, Platform, TextInputProps, TextStyle } from 'react-native';

interface FloatingLabelProps {
    visible: boolean;
}

interface FloatingLabelState {
    paddingAnim: Animated.Value;
    opacityAnim: Animated.Value;
}

interface TextFieldHolderProps {
    withValue: boolean;
}

interface TextFieldHolderState {
    marginAnim: Animated.Value;
}

class FloatingLabel extends Component<FloatingLabelProps, FloatingLabelState> {
    constructor(props: FloatingLabelProps) {
        super(props);

        let initialPadding = 9;
        let initialOpacity = 0;

        if (this.props.visible) {
            initialPadding = 5;
            initialOpacity = 1;
        }

        this.state = {
            paddingAnim: new Animated.Value(initialPadding),
            opacityAnim: new Animated.Value(initialOpacity),
        };
    }

    componentWillReceiveProps(newProps: FloatingLabelProps) {
        Animated.timing(this.state.paddingAnim, {
            toValue: newProps.visible ? 5 : 9,
            duration: 230,
        }).start();

        return Animated.timing(this.state.opacityAnim, {
            toValue: newProps.visible ? 1 : 0,
            duration: 230,
        }).start();
    }

    render() {
        return (
            <Animated.View
                style={[styles.floatingLabel, { paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim }]}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

class TextFieldHolder extends Component<TextFieldHolderProps, TextFieldHolderState> {
    constructor(props: TextFieldHolderProps) {
        super(props);
        this.state = {
            marginAnim: new Animated.Value(this.props.withValue ? 10 : 0),
        };
    }

    componentWillReceiveProps(newProps: TextFieldHolderProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: newProps.withValue ? 10 : 0,
            duration: 230,
        }).start();
    }

    render() {
        return <Animated.View style={{ marginTop: this.state.marginAnim }}>{this.props.children}</Animated.View>;
    }
}

interface FloatLabelTextFieldState {
    focused: boolean;
    text: string | undefined;
}

interface FloatLabelTextFieldProps {
    noBorder: boolean;
    leftPadding: number | string;
    onFocus?: () => void;
    onBlur?: () => void;
    onChangeTextValue?: (value: string | undefined) => void;
}

type FloatLabelTextInputFieldProps = FloatLabelTextFieldProps & TextInputProps;

class FloatLabelTextField extends Component<FloatLabelTextInputFieldProps, FloatLabelTextFieldState> {
    constructor(props: FloatLabelTextInputFieldProps) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.value,
        };
    }

    componentWillReceiveProps(newProps: FloatLabelTextInputFieldProps) {
        if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
            this.setState({ text: newProps.value });
        }
    }

    leftPadding() {
        return { width: this.props.leftPadding || 0 };
    }

    withBorder() {
        if (!this.props.noBorder) {
            return styles.withBorder;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewContainer}>
                    <View style={[styles.paddingView, this.leftPadding()]} />
                    <View style={[styles.fieldContainer, this.withBorder()]}>
                        <FloatingLabel visible={this.state.text ? true : false}>
                            <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeholderValue()}</Text>
                        </FloatingLabel>
                        <TextFieldHolder withValue={this.state.text ? true : false}>
                            <TextInput
                                {...this.props}
                                ref="input"
                                underlineColorAndroid="transparent"
                                style={[styles.valueText]}
                                defaultValue={this.props.defaultValue}
                                value={this.state.text}
                                maxLength={this.props.maxLength}
                                onFocus={() => this.setFocus()}
                                onBlur={() => this.unsetFocus()}
                                // onChangeText={value => this.setText(value)}
                            />
                        </TextFieldHolder>
                    </View>
                </View>
            </View>
        );
    }

    inputRef(): TextInput {
        return this.refs.input as TextInput;
    }

    focus() {
        this.inputRef().focus();
    }

    blur() {
        this.inputRef().blur();
    }

    isFocused() {
        return this.inputRef().isFocused();
    }

    clear() {
        this.inputRef().clear();
    }

    setFocus() {
        this.setState({
            focused: true,
        });
        if (this.props.onFocus) {
            return this.props.onFocus();
        }
    }

    unsetFocus() {
        this.setState({
            focused: false,
        });
        if (this.props.onBlur) {
            return this.props.onBlur();
        }
    }

    labelStyle() {
        if (this.state.focused) {
            return styles.focused;
        }
    }

    placeholderValue() {
        if (this.state.text) {
            return this.props.placeholder;
        }
    }

    setText(value: string | undefined) {
        this.setState({
            text: value,
        });
        if (this.props.onChangeTextValue) {
            return this.props.onChangeTextValue(value);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        // borderTopRightRadius: 5,
        // borderBottomRightRadius: 5,
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    paddingView: {
        width: 15,
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 10,
    },
    fieldLabel: {
        height: 15,
        fontSize: 10,
        color: '#555',
    },
    fieldContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    withBorder: {
        borderWidth: 0,
        borderColor: '#555',
    },
    valueText: {
        height: Platform.OS == 'ios' ? 20 : 60,
        fontSize: 16,
        color: '#111111',
        marginLeft: 5,
    },
    focused: {
        color: '#555',
    },
});

export default FloatLabelTextField;
