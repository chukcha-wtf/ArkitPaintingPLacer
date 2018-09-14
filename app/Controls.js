import React, { Component } from 'react';

import {
    View,
    Alert,
    StyleSheet,
    PanResponder,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import { PaintingActionCreators } from '../redux/actions';
import { selectPaintingPosition } from '../redux/reducers';

import { ARKit } from 'react-native-arkit';
import Permissions from 'react-native-permissions'
import Icon from 'react-native-vector-icons/Ionicons';

// redux map
const mapStateToProps = state => ({
    paintingPosition: selectPaintingPosition(state),
});

const mapDispatchToProps = dispatch => ({
    setActiveImage(image) {
        dispatch(PaintingActionCreators.setActiveImage(image));
    },
    showPreview() {
        dispatch(PaintingActionCreators.showPreview());
    },
    setPaintingPosition(position) {
        dispatch(PaintingActionCreators.setPaintingPosition(position));
    }
});

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

class Controls extends Component {
    state = {
        touchPaintingDetected: false
    };

    componentWillMount() {        
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this.checkWetherWereMovingAPainting,
            onPanResponderMove: this.movePainting,
            onPanResponderRelease: this.paintingMovingDone
        });
    }

    removePainting = () => {
        const {
            showPreview,
            setActiveImage
        } = this.props;
        
        setActiveImage(null);
        showPreview();
    }

    checkWetherWereMovingAPainting = async (e) => {
        const ne = e.nativeEvent;
        const { pageX, pageY } = ne;

        const hitResult = await ARKit.hitTestSceneObjects({ x: pageX, y: pageY });

        const paintingFound = !!(hitResult && hitResult.results.length);

        this.setState({
            touchPaintingDetected: paintingFound
        });

        return paintingFound;
    }

    movePainting = async (e) => {
        const { touchPaintingDetected } = this.state;
        const {
            paintingPosition,
            setPaintingPosition
        } = this.props;

        if (!touchPaintingDetected) {
            return;
        }

        const ne = e.nativeEvent;
        const { pageX, pageY } = ne;

        const hitResult = await ARKit.hitTestSceneObjects({ x: pageX, y: pageY });
        const hitResults = hitResult &&
                           hitResult.results || [];
        const positionBase = hitResults[hitResults.length - 1];

        if (positionBase) {
            const newPaintingPosition = {
                x: positionBase.positionAbsolute.x,
                y: positionBase.positionAbsolute.y,
                z: paintingPosition.z
            }

            setPaintingPosition(newPaintingPosition);
        }
    }

    paintingMovingDone = () => {
        this.setState({
            touchPaintingDetected: false
        });
    }

    takeSnapshot = async () => {
        try {
            const cameraRollPermission = await Permissions.check('photo');

            if (cameraRollPermission !== 'authorized') {
                const askResult = await Permissions.request('photo');
            }

            const result = await ARKit.snapshot();

            Alert.alert("Done", "Screenshot saved to your camera roll");
        }
        catch (er) {
            console.warn("FAILED to take a snapshot", er);
        }
    }

    render() {
        const { children } = this.props;
        
        return (
            <View style={styles.controlsHolder}>
                <View style={{ flex: 1 }}
                    {...this._panResponder.panHandlers} />
                <RemoveButton
                    onPress={this.removePainting} />
                <SnapshotButton
                    onPress={this.takeSnapshot} />
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

Controls = connect(mapStateToProps, mapDispatchToProps)(Controls);

export default Controls;
