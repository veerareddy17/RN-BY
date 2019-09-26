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
        marginBottom: 10,
        flexDirection: 'row',
    },
    submitButton: {
        // backgroundColor: '#813588',
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 20,
        marginTop: 10,
    },
    error: {
        backgroundColor: '#FFCBCB',
        color: '#FF0000',
        textAlign: 'center',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
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
        width: '100%',
        paddingHorizontal: 20,
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
    loginWithGoogleButtonText: {
        fontSize: 16,
        fontFamily: 'system font',
        color: '#888',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
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
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 20,
        marginTop: 20,
    },
    orTextContainer: {
        alignItems: 'center',
    },
    noInternetContainer: {
        backgroundColor: '#555',
        bottom: 0,
        position: 'absolute',
        padding: 2,
        paddingLeft: 20,
        width: '100%',
    },
    noInternetText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'system font',
    },
});

export default styles;
