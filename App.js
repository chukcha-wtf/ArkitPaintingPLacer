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

const Painting = ({paintingPosition, currentAnchor}) => {
  const outerPosition = currentAnchor.positionAbsolute ||
                        currentAnchor.position;
  
  const eulerAngles = currentAnchor.eulerAngles || currentAnchor.euler;

  return (
    <Box
      position={{
        x: paintingPosition.x,
        y: paintingPosition.y,
        z: outerPosition.z
      }}
      eulerAngles={{
        x: 0,
        y: eulerAngles.y,
        z: eulerAngles.z,
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

const Preview = ({ onPress, switchPreviews, detected }) => {
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

const PreviewAlternative = ({ onPress, switchPreviews, detected }) => {

  return (
    <View style={styles.previewHolder}>
      <View style={styles.hintTextHolder}>
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
          Can't find a wall? Press here!
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
    fontSize: 14
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
    showRegularPreview: true,
    showAlternativePreview: false,
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
          paintingPosition
        }, this._hidePreview);
      }
    }
  }

  _setCurrentPlaneFromPhonePosition = async () => {
    const camera = await ARKit.getCamera();

    this.setState({
      currentAnchor: camera,
      paintingPosition: camera.position
    }, this._hidePreview);
  }

  _switchPreview = () => {
    const {
      showAlternativePreview,
      showRegularPreview
    } = this.state;

    this.setState({
      showAlternativePreview: !showAlternativePreview,
      showRegularPreview: !showRegularPreview
    });
  }

  _showPreview = () => {
    this.setState({
      showAlternativePreview: false,
      showRegularPreview: true
    });
  }

  _hidePreview = () => {
    this.setState({
      showAlternativePreview: false,
      showRegularPreview: false,
      currentAnchor: null,
      paintingPosition: null
    });
  }


  render() {
    const {
      anchors,
      currentAnchor,
      canHangAPainting,
      paintingPosition,
      showRegularPreview,
      showAlternativePreview
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
          showRegularPreview && <Preview
                                  onPress={this._setCurrentAnchor}
                                  detected={canHangAPainting}
                                  switchPreviews={this._switchPreview} />
        }
        {
          showAlternativePreview && <PreviewAlternative
                                      onPress={this._setCurrentPlaneFromPhonePosition}
                                      switchPreviews={this._switchPreview} />
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
