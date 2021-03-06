import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import { ARKit } from 'react-native-arkit';

const screen = Dimensions.get('window');

import { connect } from 'react-redux';
import { PaintingActionCreators } from '../redux/actions';
import {
    selectAnchors,
    selectCanHangAPainting
} from '../redux/reducers';

const mapStateToProps = state => ({
    anchors: selectAnchors(state),
    canHangAPainting: selectCanHangAPainting(state)
});

const mapDispatchToProps = dispatch => ({
    setCurrentAnchor(anchor) {
        dispatch(PaintingActionCreators.setCurrentAnchor(anchor));
    },
    setPaintingPosition(position) {
        dispatch(PaintingActionCreators.setPaintingPosition(position));
    },
    hidePreview() {
        dispatch(PaintingActionCreators.hidePreview());
    },
    switchPreview() {
        dispatch(PaintingActionCreators.switchPreview());
    }
});

class Preview extends Component {
    setPaintingFromCurrentAnchor = async () => {
        const {
            anchors,
            setCurrentAnchor,
            setPaintingPosition,
            hidePreview
        } = this.props;

        const point = { x: screen.width / 2, y: screen.height / 2 };

        const result = await ARKit.hitTestPlanes(
            point,
            ARKit.ARHitTestResultType.ExistingPlaneUsingExtent
        );

        if (result.results.length) {
            const currentAnchorId = result &&
                result.results &&
                result.results[0] &&
                result.results[0].id;

            const paintingPosition = result &&
                result.results &&
                result.results[0] &&
                result.results[0].positionAbsolute;

            const currentAnchor = anchors[currentAnchorId];

            if (currentAnchorId) {
                setCurrentAnchor(currentAnchor);
                setPaintingPosition({
                    x: paintingPosition.x,
                    y: paintingPosition.y,
                    z: currentAnchor.positionAbsolute.z
                });
                hidePreview();
            }
        }
    }

    render() {
        const { switchPreview, canHangAPainting } = this.props;
        
        const activeStyle = canHangAPainting ? styles.buttonActive : {};
        const activeViewportStyle = canHangAPainting ? styles.viewFinderActive : {};
    
        return (
            <View style={styles.previewHolder}>
                <View style={styles.hintTextHolder}>
                    <Text style={styles.hintText}>
                        Move your phone around to detect some walls.
                    </Text>
                </View>
                <View style={styles.viewFinderHolder}>
                    <View style={[styles.viewFinder, activeViewportStyle]} />
                </View>
                <TouchableOpacity onPress={canHangAPainting ? this.setPaintingFromCurrentAnchor : null} style={[styles.previewButton, activeStyle]}>
                    <Text style={styles.previewButtonText}>
                        Hang The Painting
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={switchPreview} style={[styles.switchButton]}>
                    <Text style={styles.switchButtonText}>
                        Can't find a wall? Press here!
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

Preview = connect(mapStateToProps, mapDispatchToProps)(Preview);

class PreviewAlternative extends Component {
    setCurrentPlaneFromPhonePosition = async () => {
        const {
            setCurrentAnchor,
            setPaintingPosition,
            hidePreview
        } = this.props;
        
        const camera = await ARKit.getCamera();

        setCurrentAnchor(camera);
        setPaintingPosition(camera.position);
        hidePreview();
    }

    render() {
        const { onPress, switchPreview } = this.props;
        
        return (
            <View style={styles.previewHolder}>
                <View style={[styles.hintTextHolder, styles.hintTextSimple]}>
                    <Text style={styles.hintText}>
                        Please put your phone on the wall{"\n"}
                        to detect Vertical plane.
                    </Text>
                </View>
                <View style={styles.viewFinderHolder}>
                    <View style={styles.viewFinder} />
                </View>
                <TouchableOpacity onPress={this.setCurrentPlaneFromPhonePosition} style={[styles.previewButton, styles.buttonActive]}>
                    <Text style={styles.previewButtonText}>
                        Ready!
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={switchPreview} style={[styles.switchButton]}>
                    <Text style={styles.switchButtonText}>
                        Back to ARKit plane detection?{"\n"}Press here!
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

PreviewAlternative = connect(mapStateToProps, mapDispatchToProps)(PreviewAlternative);

const styles = StyleSheet.create({
    previewHolder: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20
    },

    hintTextHolder: {
        position: 'absolute',
        width: '100%',
        margin: 20,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FDCB5C',
        opacity: 0.8,
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
    },

    hintTextSimple: {
        backgroundColor: '#ED4956'
    },

    hintText: {
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'center',
        padding: 10,
        color: '#fff'
    },

    previewButton: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 15,
        padding: 15,
        margin: 40,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50,
        position: 'absolute',
        width: '90%',
        backgroundColor: '#CECECE'
    },

    previewButtonText: {
        fontSize: 20,
        color: '#fff'
    },

    switchButton: {
        padding: 20,
        margin: 40,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        position: 'absolute',
        width: '90%',
    },

    switchButtonText: {
        color: '#E8E8E8',
        fontSize: 14,
        textAlign: 'center'
    },

    buttonActive: {
        backgroundColor: '#70C050'
    },

    viewFinderHolder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    viewFinder: {
        width: 150,
        height: 150,
        borderWidth: 3,
        borderColor: '#B0B0B0'
    },

    viewFinderActive: {
        borderWidth: 2,
        borderColor: '#fff'
    }
});

export { Preview, PreviewAlternative };
