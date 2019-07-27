import * as React from 'react';
import { Component } from 'react';

export interface RegistrationProps {
    
}
 
export interface RegistrationState {
    
}
 
class Registration extends React.Component<RegistrationProps, RegistrationState> {
    state = { 
        customer: {}
    };
    
    render() { 
        return ( <h1>Registration Screen</h1> );
    }
}
 
export default Registration;