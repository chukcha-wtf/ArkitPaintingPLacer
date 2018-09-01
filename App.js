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

import { ARKit } from 'react-native-arkit';

import Painting from './app/Painting';
import Controls from './app/Controls';
import { Preview, PreviewAlternative } from './app/Preview';

const screen = Dimensions.get('window');

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
          <Controls 
            onResponderStart={this._checkWetherWereMovingAPainting}
            onResponderMove={this._movePainting}
            onResponderRelease={this._paintingMovingDone}
            onPaintingRemove={this._removePainting}
            />
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
