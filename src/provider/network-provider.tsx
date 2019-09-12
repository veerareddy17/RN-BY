import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import { AppState } from '../redux/store';
import { Dispatch } from 'redux';
import { connectionStateStatus } from '../redux/actions/connection-action-creator';

export const NetworkContext = React.createContext({ isConnected: true });

export interface IProps {
    dispatch: Dispatch;
}

export interface IState {
    isConnected: boolean;
}

class NetworkProvider extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isConnected: false,
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected: boolean) => {
        this.setState({ isConnected });
        this.props.dispatch(connectionStateStatus({ status: isConnected }));
    };

    render() {
        return <NetworkContext.Provider value={this.state}>{this.props.children}</NetworkContext.Provider>;
    }
}

const mapStateToProps = (state: AppState) => ({
    isConnected: state.connectionStateReducer.isConnected,
});

export default connect(mapStateToProps)(NetworkProvider);
