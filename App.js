import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AppRegistry,
  PanResponder,
  TouchableOpacity
} from 'react-native';

import { 
  ARKit,
  withProjectedPosition
} from 'react-native-arkit';

import Icon from 'react-native-vector-icons/Ionicons';

const { Box } = ARKit;

const PAINTING_WIDTH = 0.5;
const PAINTING_HEIGHT = 0.6;
const PAINTING_THIN = 0.03;

const screen = Dimensions.get('window');

const Painting = ({paintingPosition, currentAnchor}) => {
  const outerPosition = currentAnchor.positionAbsolute ||
                        currentAnchor.position;
  
  const eulerAngles = currentAnchor.eulerAngles;

  return (
    <Box
      position={{
        x: paintingPosition.x,
        y: paintingPosition.y,
        z: paintingPosition.z - PAINTING_THIN
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

const RemoveButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}
                      style={styles.removeButton}>
      <Icon name="ios-trash"
            color="#dedede"
            size={24}
            style={{marginLeft: 1, marginTop: 1}} />
    </TouchableOpacity>
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
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center'
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
    touchPaintingDetected: false
  };
  
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._checkWetherWereMovingAPainting,
      onPanResponderMove: this._movePainting,
      onPanResponderRelease: this._paintingMovingDone
    });
  }

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

      const currentAnchor = anchors[currentAnchorId];

      if (currentAnchorId) {
        this.setState({
          currentAnchor: currentAnchor, 
          paintingPosition: {
            x: paintingPosition.x,
            y: paintingPosition.y,
            z: currentAnchor.positionAbsolute.z
          }
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
      showRegularPreview: true,
      currentAnchor: null,
      paintingPosition: null
    });
  }

  _hidePreview = () => {
    this.setState({
      showAlternativePreview: false,
      showRegularPreview: false,
    });
  }

  _removePainting = () => {
    this._showPreview()
  }

  _checkWetherWereMovingAPainting = async (e) => {
    const ne = e.nativeEvent;
    const { pageX, pageY } = ne;

    const hitResult = await ARKit.hitTestSceneObjects({x: pageX, y: pageY});
    
    const paintingFound = !!(hitResult && hitResult.results.length);

    console.log({paintingFound})

    this.setState({
      touchPaintingDetected: paintingFound
    });

    return paintingFound;
  }

  _movePainting = async (e) => {
    const { touchPaintingDetected, paintingPosition } = this.state;

    if (!touchPaintingDetected) {
      return;
    }

    const ne = e.nativeEvent;
    const { pageX, pageY } = ne;

    const hitResult = await ARKit.hitTestSceneObjects({ x: pageX, y: pageY });
    const positionBase = hitResult &&
                     hitResult.results &&
                     hitResult.results[0];
    
    if (positionBase) {
      const newPaintingPosition = {
        x: positionBase.positionAbsolute.x,
        y: positionBase.positionAbsolute.y,
        z: paintingPosition.z
      }

      this.setState({
        paintingPosition: newPaintingPosition
      });
    }
  }

  _paintingMovingDone = () => {
    this.setState({
      touchPaintingDetected: false
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
                      currentAnchor={currentAnchor}/>
          }
        </ARKit>
        {
          showRegularPreview &&
          <Preview
            onPress={this._setCurrentAnchor}
            detected={canHangAPainting}
            switchPreviews={this._switchPreview} />
        }
        {
          showAlternativePreview &&
          <PreviewAlternative
            onPress={this._setCurrentPlaneFromPhonePosition}
            switchPreviews={this._switchPreview} />
        }
        {
          currentAnchor &&
          <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'transparent'
          }}>
            <View style={{flex: 1}}
              {...this._panResponder.panHandlers} />
            <RemoveButton
              onPress={this._removePainting} />
          </View>
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
