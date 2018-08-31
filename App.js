import React, { Component } from 'react';

import {
  View,
  Text,
  AppRegistry,
  TouchableOpacity
} from 'react-native';

import { ARKit } from 'react-native-arkit';

const { Box } = ARKit;

export default class ReactNativeARKit extends Component {
  state = {
    showNotice: true
  };

  _hideNotice = () => {
    this.setState({showNotice: false});
  }
  
  render() {
    const { showNotice } = this.state;
    
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          planeDetection={ARKit.ARPlaneDetection.Vertical}
          lightEstimationEnabled
          onPlaneDetected={anchor => console.log(anchor)}
          onPlaneUpdated={anchor => console.log(anchor)}
          onPlaneRemoved={anchor => console.log(anchor)}
          onAnchorDetected={anchor => console.log(anchor)}
          onAnchorUpdated={anchor => console.log(anchor)}
          onAnchorRemoved={anchor => console.log(anchor)}

          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        >
          <Box
            position={{x: 0, y: 0, z: -1.5}}
            shape={{ width: 0.5, height: 0.6, length: 0.03 }}
            doubleSided={false}
            scale={1}
            material={{
              diffuse: { path: 'assets/Grant_Wood_-_American_Gothic', intensity: 1 },
              lightingModel: ARKit.LightingModel.physicallyBased
            }} />
        </ARKit>
        {
          showNotice &&
          <View style={{ position: 'absolute', top: 20, width: '100%', backgroundColor: 'transparent', padding: 20, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ color: 'red', fontSize: 24 }}>
              Please, stand in 2 meters in front of the wall
              and restart the app.
            </Text>
          </View>
        }
        {
          showNotice &&
          <View style={{ position: 'absolute', width: '100%', bottom: 0, backgroundColor: 'transparent', padding: 20, alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', padding: 20 }}
              onPress={this._hideNotice}>
              <Text style={{ color: 'white' }}>Got it</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
