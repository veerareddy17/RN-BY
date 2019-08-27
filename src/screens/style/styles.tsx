import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     paddingTop: 65,
    //     backgroundColor: 'white',
    // },
    labelInput: {
        color: 'black',
        fontSize: 12,
    },
    formInput: {
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        height: 50,
        //marginLeft: 20,
        borderColor: '#333',
    },
    input: {
        borderWidth: 0,
        marginTop: 10,
        fontSize: 15,
        paddingBottom: 5,
    },
    flexQuater: {
        flex: .4
    },
    felxHalf: {
        flex: .5
    },
    errorStyle: {
        fontSize: 10,
        color: 'red'
    }
});

export default style;