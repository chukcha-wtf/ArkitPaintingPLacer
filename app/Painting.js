import React from 'react';
import { ARKit } from 'react-native-arkit';

const { Box, Group, Text } = ARKit;

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

    const paintingWidth = image ? normalizeRuler(image.width) : PAINTING_WIDTH;
    const paintingHeight = image ? normalizeRuler(image.height) : PAINTING_HEIGHT;

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
                    diffuse: { path: image && image.filePath, intensity: 1 },
                    lightingModel: ARKit.LightingModel.physicallyBased
                }} />
            {
                !!image &&
                <Text
                text={`${image.title} - ${image.author}`} 
                position={{ x: 0, z: 0, y: - paintingHeight / 2 - 0.05  }}
                font={{size: 0.03, depth: PAINTING_THIN}} />
            }
        </Group>
    );
}

export default Painting;