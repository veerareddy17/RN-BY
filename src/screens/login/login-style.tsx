import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    userName: {
        marginBottom: 10,
        marginTop: 20,
        flexDirection: 'row',
    },
    password: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
    },
    submitButton: {
        // backgroundColor: '#813588',
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 20,
    },
    error: {
        backgroundColor: '#FFCBCB',
        color: '#FF0000',
        textAlign: 'center',
        borderRadius: 5,
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'system font',
        fontSize: 14,
    },
    iconContainer: {
        padding: 8,
        backgroundColor: '#fff',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    formConatiner: {
        width: 290,
    },
    marginLeft: {
        marginLeft: 10,
    },
    paddingTop: {
        paddingTop: 0,
    },
    loginButtonText: {
        fontSize: 16,
        fontFamily: 'system font',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    forgotPasswordText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'system font',
    },
    imageBg: {
        width: '100%',
        height: '100%',
    },
    submitSSOButton: {
        backgroundColor: '#813588',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 20,
        marginTop: 20,
    },
});

export default styles;
