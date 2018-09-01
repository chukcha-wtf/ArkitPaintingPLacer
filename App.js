import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AppRegistry,
  TouchableOpacity
} from 'react-native';

import { 
  ARKit,
  withProjectedPosition
} from 'react-native-arkit';

const { Box } = ARKit;

const PAINTING_WIDTH = 0.5;
const PAINTING_HEIGHT = 0.6;
const PAINTING_THIN = 0.03;

const screen = Dimensions.get('window');

const PaintingPlaceholder = withProjectedPosition()(({positionProjected, projectionResult}) => {
  if (!projectionResult) {
    return null;
  }

  return (
    <Box
      position={positionProjected}
      transition={{duration: 0.1}}
      shape={{ 
        width: PAINTING_WIDTH,
        height: PAINTING_HEIGHT,
        length: PAINTING_THIN
      }}
      doubleSided={false}
      scale={1}
      castsShadow={true}
      material={{
        diffuse: { path: 'assets/Grant_Wood_-_American_Gothic', intensity: 0.5 },
        lightingModel: ARKit.LightingModel.physicallyBased
      }} />
  );
});

const Painting = ({paintingPosition, currentAnchor}) => {
  console.log({currentAnchor, paintingPosition});
  return (
    <Box
      position={{
        x: paintingPosition.x,
        y: paintingPosition.y,
        z: currentAnchor.positionAbsolute.z
      }}
      eulerAngles={{
        x: 0,
        y: currentAnchor.eulerAngles.y,
        z: currentAnchor.eulerAngles.z,
      }}
      transition={{ duration: 0.1 }}
      shape={{
        width: PAINTING_WIDTH,
        height: PAINTING_HEIGHT,
        length: PAINTING_THIN
      }}
      doubleSided={false}
      scale={1}
      castsShadow={true}
      material={{
        diffuse: { path: 'assets/Grant_Wood_-_American_Gothic', intensity: 1 },
        lightingModel: ARKit.LightingModel.physicallyBased
      }} />
  );
}

const Preview = ({ onPress, detected }) => {
  const activeStyle = detected ? styles.buttonActive : {};
  const activeViewportStyle = detected ? styles.viewFinderActive : {};

  return (
    <View style={styles.previewHolder}>
      <View style={styles.hintTextHolder}>
        <Text style={styles.hintText}>
          Hey!{"\n"}Move your phone around to detect some walls.
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
    marginLeft: 20,
    alignItems: 'center'
  },

  hintText: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginTop: 40,
    color: '#FDCB5C'
  },

  previewButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 40,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    width: '90%',
    backgroundColor: '#CECECE'
  },

  previewButtonText: {
    fontSize: 20,
    color: '#fff'
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

export default class ReactNativeARKit extends Component {
  state = {
    canHangAPainting: false,
    showPreview: true,
    currentAnchor: null,
    paintingPosition: null,
    anchors: {},
  };

  _onPlaneDetected = (anchor) => {
    this._updateAnchorInfo(anchor);
    this._checkWetherPossibleToHangAPainting(anchor);
  }
  
  _onPlaneUpdated = (anchor) => {
    this._updateAnchorInfo(anchor);
  }
  
  _updateAnchorInfo = (anchor) => {
    const { anchors } = this.state;
  
    anchors[anchor.id] = anchor;
  
    this.setState({anchors});
  }

  _checkWetherPossibleToHangAPainting = async (anchor) => {
    const point = {
      x: screen.width / 2,
      x: screen.height / 2
    };

    const result = await ARKit.hitTestPlanes(point, ARKit.ARHitTestResultType.ExistingPlaneUsingGeometry);

    this.setState({
      canHangAPainting: !!(result && result.results && result.results.length)
    });
  }

  _setCurrentAnchor = async () => {
    const { anchors } = this.state;
    
    const point = {
      x: screen.width / 2,
      x: screen.height / 2
    };
    
    const result = await ARKit.hitTestPlanes(point, ARKit.ARHitTestResultType.ExistingPlaneUsingGeometry);

    if (result) {
      const currentAnchorId = result &&
                              result.results &&
                              result.results[0] &&
                              result.results[0].id;
          
      const paintingPosition = result &&
                               result.results &&
                               result.results[0] &&
                               result.results[0].positionAbsolute;

      if (currentAnchorId) {
        this.setState({
          currentAnchor: anchors[currentAnchorId],
          showPreview: false,
          paintingPosition
        });
      }
    }
  }
  
  render() {
    const {
      anchors,
      showPreview,
      currentAnchor,
      paintingPosition,
      canHangAPainting
    } = this.state;
    
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          planeDetection={ARKit.ARPlaneDetection.Vertical}
          lightEstimationEnabled
          onAnchorDetected={this._onPlaneDetected}
          onAnchorUpdated={this._onPlaneUpdated}
          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        >
          {
            currentAnchor && paintingPosition &&
            <Painting paintingPosition={paintingPosition}
                      currentAnchor={currentAnchor} />
          }
        </ARKit>
        {
          showPreview && <Preview onPress={this._setCurrentAnchor}
                                  detected={canHangAPainting} />
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
