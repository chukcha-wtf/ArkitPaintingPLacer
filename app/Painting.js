import React, { Component } from 'react';
import { ARKit } from 'react-native-arkit';

import { connect } from 'react-redux';
import { PaintingActionCreators } from '../redux/actions';
import {
    selectCurrentAnchor,
    selectPaintingPosition,
    selectActiveImage
} from '../redux/reducers';

const { Box, Group, Text } = ARKit;

const PAINTING_WIDTH = 0.5;
const PAINTING_HEIGHT = 0.6;
const PAINTING_THIN = 0.03;

const normalizeRuler = (number) => {
    return number / 1000;
}

// redux map
const mapStateToProps = state => ({
    currentAnchor: selectCurrentAnchor(state),
    paintingPosition: selectPaintingPosition(state),
    activeImage: selectActiveImage(state)
});

class Painting extends Component {
    render() {
        const {
            paintingPosition,
            currentAnchor,
            activeImage
        } = this.props;
        
        const outerPosition = currentAnchor.positionAbsolute ||
                              currentAnchor.position;
    
        const eulerAngles = currentAnchor.eulerAngles;
    
        const paintingWidth = activeImage ? normalizeRuler(activeImage.width) : PAINTING_WIDTH;
        const paintingHeight = activeImage ? normalizeRuler(activeImage.height) : PAINTING_HEIGHT;
    
        return (
            <Group
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
                transition={{ duration: 0.3 }}
                scale={1}
                propsOnUnmount={{
                    scale: 0
                }}
                castsShadow={true}>
                <Box
                    position={{ x: 0, y: 0, z: 0 }}
                    shape={{
                        width: paintingWidth,
                        height: paintingHeight,
                        length: PAINTING_THIN
                    }}
                    doubleSided={false}
                    material={{
                        diffuse: { path: activeImage && activeImage.filePath, intensity: 1 },
                        lightingModel: ARKit.LightingModel.physicallyBased
                    }} />
                {
                    !!activeImage &&
                    <Text
                    text={`${activeImage.title} - ${activeImage.author}`} 
                    position={{ x: 0, z: 0, y: - paintingHeight / 2 - 0.05  }}
                    font={{size: 0.03, depth: PAINTING_THIN}} />
                }
            </Group>
        );
    }
}

Painting = connect(mapStateToProps, null)(Painting);

export default Painting;
