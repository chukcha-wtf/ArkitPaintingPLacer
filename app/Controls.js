import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    PanResponder,
    TouchableOpacity
} from 'react-native';

import { ARKit } from 'react-native-arkit';
import Permissions from 'react-native-permissions'
import Icon from 'react-native-vector-icons/Ionicons';

const RemoveButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={[styles.button, styles.removeButton]}>
            <Icon name="ios-trash"
                color="#fff"
                size={24}
                style={{ marginLeft: 1, marginTop: 1 }} />
        </TouchableOpacity>
    );
}

const SnapshotButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={[styles.button, styles.snapshotButton]}>
            <Icon name="ios-camera"
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

    _takeSnapshot = async () => {
        try {
            const cameraRollPermission = await Permissions.check('photo');

            if (cameraRollPermission !== 'authorized') {
                const askResult = await Permissions.request('photo');
            }

            const result = await ARKit.snapshot();

            alert("Done!", "Screenshot saved to your camera roll");
        }
        catch (er) {
            console.warn("FAILED to take a snapshot", er);
        }
    }

    render() {
        const { onPaintingRemove, children } = this.props;
        
        return (
            <View style={styles.controlsHolder}>
                <View style={{ flex: 1 }}
                    {...this._panResponder.panHandlers} />
                <RemoveButton
                    onPress={onPaintingRemove} />
                <SnapshotButton
                    onPress={this._takeSnapshot} />
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

    button: {
        position: 'absolute',
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
        
    },
    
    removeButton: {
        top: 40
    },

    snapshotButton: {
        top: 100
    }
});