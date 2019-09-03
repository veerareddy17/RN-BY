import React, { Component } from 'react';
import { View, Icon } from 'native-base';
export class AddNew extends Component {
    render() {
        return (
            <View
                style={{
                    height: 35,
                    width: 70,
                    borderBottomLeftRadius: 70,
                    borderBottomRightRadius: 70,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 8,
                    borderWidth: 0.5,
                    borderColor: '#eee',
                }}
            >
                <View
                    style={{
                        backgroundColor: '#813588',
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: 18,
                    }}
                >
                    <Icon name="add" style={{ color: 'white' }} />
                </View>
            </View>
        );
    }
}

export default AddNew;
