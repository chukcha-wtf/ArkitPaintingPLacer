import React, { Component } from 'react';

import {
  View,
  Dimensions,
  AppRegistry
} from 'react-native';

import { ARKit } from 'react-native-arkit';

// redux
import { Provider, connect } from 'react-redux';
import store from './redux/store';

import {
  selectAnchors,
  selectCurrentAnchor,
  selectPaintingPosition,
  selectShouldShowRegularPreview,
  selectShouldShowAlternativePreview
} from './redux/reducers';

import { PaintingActionCreators } from './redux/actions';

// components
import Painting from './app/Painting';
import Controls from './app/Controls';
import PaintingsList from './app/PaintingsList';
import { Preview, PreviewAlternative } from './app/Preview';

// helpers
const screen = Dimensions.get('window');

// redux map
const mapStateToProps = state => ({
  anchors: selectAnchors(state),
  currentAnchor: selectCurrentAnchor(state),
  paintingPosition: selectPaintingPosition(state),
  showRegularPreview: selectShouldShowRegularPreview(state),
  showAlternativePreview: selectShouldShowAlternativePreview(state)
});

const mapDispatchToProps = dispatch => ({
  updateAnchorsInfo(anchors) {
    dispatch(PaintingActionCreators.updateAnchorsInfo(anchors));
  },
  checkIfPaintingAllowed(canHangAPainting) {
    dispatch(PaintingActionCreators.checkIfPaintingAllowed(canHangAPainting));
  },
});

class ReactNativeARKit extends Component {  
  onPlaneDetected = (anchor) => {
    this.updateAnchorInfo(anchor);
    this.checkWetherPossibleToHangAPainting(anchor);
  }
  
  onPlaneUpdated = (anchor) => {
    this.updateAnchorInfo(anchor);
  }
  
  updateAnchorInfo = (anchor) => {
    const {
      anchors,
      updateAnchorsInfo
    } = this.props;
  
    anchors[anchor.id] = anchor;
  
    updateAnchorsInfo(anchors);
  }

  checkWetherPossibleToHangAPainting = async (anchor) => {
    const { checkIfPaintingAllowed } = this.props;
    const point = {
      x: screen.width / 2,
      y: screen.height / 2
    };

    const result = await ARKit.hitTestPlanes(
      point,
      ARKit.ARHitTestResultType.ExistingPlaneUsingExtent
    );

    const canHangAPainting = !!(result &&
                             result.results &&
                             result.results.length);
    
    checkIfPaintingAllowed(canHangAPainting);
  }

  _setActiveImage = (image) => {
    this.setState({activeImage: image});
  }

  render() {
    const {
      currentAnchor,
      paintingPosition,
      showRegularPreview,
      showAlternativePreview
    } = this.props;
    
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <ARKit
            style={{ flex: 1 }}
            planeDetection={ARKit.ARPlaneDetection.Vertical}
            lightEstimationEnabled
            onPlaneDetected={this.onPlaneDetected}
            onPlaneUpdated={this.onPlaneUpdated}
            onAnchorDetected={this.onPlaneDetected}
            onAnchorUpdated={this.onPlaneUpdated}
            onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
          >
            {!!currentAnchor && !!paintingPosition && <Painting />}
          </ARKit>
          {showRegularPreview && <Preview />}
          {showAlternativePreview && <PreviewAlternative />}
          {
            !!currentAnchor &&
            <Controls>
              <PaintingsList />
            </Controls>
          }
        </View>
      </Provider>
    );
  }
}

ReactNativeARKit = connect(mapStateToProps, mapDispatchToProps)(ReactNativeARKit);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ReactNativeARKit />
      </Provider>
    );
  }
}

export default App;
