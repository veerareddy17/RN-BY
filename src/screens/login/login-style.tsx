import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1
    },
    userName: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingBottom: 10,
        marginRight: 20,
        marginLeft: 20
    },
    password: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    submitButton: {
        backgroundColor: 'purple',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    error: {
        backgroundColor: '#FFCBCB',
        color: '#FF0000',
        textAlign: 'center',
        borderRadius: 5,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 20,
        height: 40,
        paddingTop: 8,
    },
})

export default styles;