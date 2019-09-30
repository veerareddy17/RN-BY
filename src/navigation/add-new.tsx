import React, { Component } from 'react';
import { View, Icon } from 'native-base';
export class AddNew extends Component {
    render() {
        return (
            <View
                style={{
                    height: 36,
                    width: 72,
                    borderBottomLeftRadius: 72,
                    borderBottomRightRadius: 72,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 7,
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
                        bottom: 15,
                    }}
                >
                    <Icon name="add" style={{ color: '#fff', fontSize: 30 }} />
                </View>
            </View>
        );
    }
}

export default AddNew;
