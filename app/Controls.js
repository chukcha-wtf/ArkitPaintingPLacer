import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    PanResponder,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const RemoveButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={styles.removeButton}>
            <Icon name="ios-trash"
                color="#fff"
                size={24}
                style={{ marginLeft: 1, marginTop: 1 }} />
        </TouchableOpacity>
    );
}

export default class Controls extends Component {
    componentWillMount() {
        const {
            onResponderStart,
            onResponderMove,
            onResponderRelease
        } = this.props;
        
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: onResponderStart,
            onPanResponderMove: onResponderMove,
            onPanResponderRelease: onResponderRelease
        });
    }

    render() {
        const { onPaintingRemove, children } = this.props;
        
        return (
            <View style={styles.controlsHolder}>
                <View style={{ flex: 1 }}
                    {...this._panResponder.panHandlers} />
                <RemoveButton
                    onPress={onPaintingRemove} />
                {children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    controlsHolder: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'transparent'
    },
    
    removeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#c0c0c0',
        borderWidth: 1,
        opacity: 0.8,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});