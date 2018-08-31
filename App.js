import React, { Component } from 'react';

import {
  View,
  Text,
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

const Painting = withProjectedPosition()(({positionProjected, projectionResult}) => {
  if (!projectionResult) {
    return null;
  }

  const verticalPlaneId = projectionResult && projectionResult.id;

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
      material={{
        diffuse: { path: 'assets/Grant_Wood_-_American_Gothic', intensity: 1 },
        lightingModel: ARKit.LightingModel.physicallyBased
      }} />
  );
});

export default class ReactNativeARKit extends Component {
  state = {
    showNotice: true,
    anchors: {}
  };

  _hideNotice = () => {
    this.setState({showNotice: false});
  }

  _onPlaneDetected = (anchor) => {
    this._updateAnchorInfo(anchor);
  }
  
  _onPlaneUpdated = (anchor) => {
    this._updateAnchorInfo(anchor);
  }
  
  _updateAnchorInfo = (anchor) => {
    const { anchors } = this.state;
  
    anchors[anchor.id] = anchor;
  
    this.setState({anchors});
  }
  
  render() {
    const { showNotice, anchors } = this.state;
    
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          planeDetection={ARKit.ARPlaneDetection.Vertical}
          lightEstimationEnabled
          onPlaneDetected={this._onPlaneDetected}
          onPlaneUpdated={this._onPlaneUpdated}
          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        >
          <Painting projectPosition={{
              x: screen.width / 2,
              y: screen.height / 2,
              plane: (results) => results.length > 0 ? results[0] : null
            }}
          /> 
        </ARKit>
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
