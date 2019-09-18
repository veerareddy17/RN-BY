import { StyleSheet, Dimensions } from 'react-native';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: '#813588',
    },
    headeriOSTitle: {
        color: '#fff',
        fontSize: 18,
    },
    whiteColor: {
        color: '#fff',
    },
    headerAndroidTitle: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
    },
    contentBg: {
        backgroundColor: '#eee',
    },
    cardShadow: {
        position: 'relative',
        top: -120,
        marginLeft: 35,
        marginRight: 35,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 2,
        backgroundColor: '#925298',
    },
    containerStyle: {
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 1.6,
    },
    sliderContainerStyle: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#813588',
    },
    leadsCard: {
        position: 'relative',
        top: -165,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    leadsCardHeader: {
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        height: 80,
    },
    leadCountSection: {
        alignItems: 'center',
        flexDirection: 'column',
        top: -50,
    },
    leadCountUsername: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
        marginBottom: 10,
    },
    leadCountCircle: {
        backgroundColor: '#fbd4ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#813588',
        width: 95,
        height: 95,
    },
    leadCountNumber: {
        fontSize: 30,
        color: '#813588',
        fontWeight: '700',
    },
    leadCountText: {
        fontSize: 16,
        color: '#813588',
        fontWeight: '700',
    },
    leadCardItem: {
        flexDirection: 'column',
        paddingTop: 0,
    },
    leadCardItemButton: {
        flex: 1,
        marginBottom: 5,
        marginTop: 5,
    },
    leadCardItemText: {
        color: '#555',
        paddingLeft: 0,
        fontSize: 16,
        flex: 1,
    },
    leadCardItemNumber: {
        color: '#555',
        paddingLeft: 0,
        fontSize: 24,
    },
    leadCardItemIcon: {
        color: '#813588',
        marginRight: 0,
    },
    noBorderBottom: {
        borderBottomWidth: 0,
    },
    campaignCard: {
        position: 'relative',
        top: -165,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: -140,
    },
    campaignCardItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    campaignCardTitle: {
        fontWeight: '700',
        color: '#555',
    },
    campaignSpinnerContainer: {
        flex: 1,
        height: 30,
    },
    campaignSpinner: {
        marginTop: -25,
    },
    campaignName: {
        flex: 1,
        marginRight: 10,
        color: '#555',
    },
    campaignCardButton: {
        borderColor: '#813588',
    },
    campaignCardButtonText: {
        color: '#813588',
        paddingLeft: 8,
        paddingRight: 8,
    },
    bottomSheetContainer: {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
});

export default styles;
