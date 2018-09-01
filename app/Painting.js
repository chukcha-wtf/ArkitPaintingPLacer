import React from 'react';
import { ARKit } from 'react-native-arkit';

const { Box } = ARKit;

const PAINTING_WIDTH = 0.5;
const PAINTING_HEIGHT = 0.6;
const PAINTING_THIN = 0.03;

const normalizeRuler = (number) => {
    return number / 1000;
}

const Painting = ({ paintingPosition, currentAnchor, image }) => {
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
            transition={{ duration: 0.3 }}
            shape={{
                width: image ? normalizeRuler(image.width) : PAINTING_WIDTH,
                height: image ? normalizeRuler(image.height) : PAINTING_HEIGHT,
                length: PAINTING_THIN
            }}
            doubleSided={false}
            scale={1}
            castsShadow={true}
            propsOnUnmount={{
                scale: 0
            }}
            material={{
                diffuse: { path: image && image.filePath, intensity: 1 },
                lightingModel: ARKit.LightingModel.physicallyBased
            }} />
    );
}

export default Painting;