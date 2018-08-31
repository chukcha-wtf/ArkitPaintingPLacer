import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { ARKit } from 'react-native-arkit';

export default class ReactNativeARKit extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          // enable plane detection (defaults to Horizontal)
          planeDetection={ARKit.ARPlaneDetection.Vertical}

          // enable light estimation (defaults to true)
          lightEstimationEnabled
          // event listener for (horizontal) plane detection
          onPlaneDetected={anchor => console.log(anchor)}
          // event listener for plane update
          onPlaneUpdated={anchor => console.log(anchor)}
          // arkit sometimes removes detected planes
          onPlaneRemoved={anchor => console.log(anchor)}

          // event listeners for all anchors, see [Planes and Anchors](#planes-and-anchors)
          onAnchorDetected={anchor => console.log(anchor)}
          onAnchorUpdated={anchor => console.log(anchor)}
          onAnchorRemoved={anchor => console.log(anchor)}

          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        >
          <ARKit.Box
            position={{x: 0, y: 0, z: -1}}
            shape={{ width: 0.5, height: 0.6, length: 0.03 }}
            doubleSided={false}
            scale={1}
            material={{
              diffuse: { path: 'assets/Grant_Wood_-_American_Gothic', intensity: 1 },
              lightingModel: ARKit.LightingModel.physicallyBased
            }} />
        </ARKit>
      </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeARKit', () => ReactNativeARKit);
