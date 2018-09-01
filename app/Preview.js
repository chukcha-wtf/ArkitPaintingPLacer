import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export const Preview = ({ onPress, switchPreviews, detected }) => {
    const activeStyle = detected ? styles.buttonActive : {};
    const activeViewportStyle = detected ? styles.viewFinderActive : {};

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
            <TouchableOpacity onPress={detected ? onPress : null} style={[styles.previewButton, activeStyle]}>
                <Text style={styles.previewButtonText}>
                    Hang The Painting
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={switchPreviews} style={[styles.switchButton]}>
                <Text style={styles.switchButtonText}>
                    Can't find a wall? Press here!
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export const PreviewAlternative = ({ onPress, switchPreviews, detected }) => {
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
            <TouchableOpacity onPress={onPress} style={[styles.previewButton, styles.buttonActive]}>
                <Text style={styles.previewButtonText}>
                    Ready!
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={switchPreviews} style={[styles.switchButton]}>
                <Text style={styles.switchButtonText}>
                    Back to ARKit plane detection?{"\n"}Press here!
                </Text>
            </TouchableOpacity>
        </View>
    );
}

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
        color: '#A308BA',
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
