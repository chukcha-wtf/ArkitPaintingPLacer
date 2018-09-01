import React, { Component } from 'react';

import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import PaintingsData from '../data/db.json';
import RNFS from 'react-native-fs';

class ImageHolder extends Component {
    _onPress = () => {
        const { item, onImageSelected } = this.props;

        onImageSelected && onImageSelected(item);
    }
    
    render() {
        const {
            item,
            isSelected,
            onImageSelected
        } = this.props;

        const selectedStyle = isSelected ? styles.imageSelected : {};
        
        return (
            <TouchableOpacity style={[styles.imageHolder, selectedStyle]}
                onPress={this._onPress}>
                <Image source={{ uri: item.filePath }}
                    style={{ width: 90, height: 90 }}
                />
                <Text style={styles.paintingText} numberOfLines={1}>
                    {item.title} - {item.author}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default class PaintingList extends Component {
    state = {
        paintings: PaintingsData.paintings,
        isLoading: true
    };
    
    componentDidMount() {        
        this._getImages();
    }
    
    _getImages = async () => {
        const { onImageSelected } = this.props;
        try {
            const { paintings } = PaintingsData;
            const paintingsIds = Object.keys(paintings);

            for (let i = 0; i < paintingsIds.length; i++) {
                const key = paintingsIds[i];
                const painting = paintings[key];
                const imageUrl = painting.url;

                const filePath = RNFS.DocumentDirectoryPath + `/image_${key}.jpg`;

                const exists = await RNFS.exists(filePath);
                
                if (!exists) {
                    const downloadResult = await RNFS.downloadFile({
                        fromUrl: imageUrl,
                        toFile: filePath
                    }).promise;
                }
                
                painting.filePath = filePath;
                paintings[key] = painting;

                if (i === 0) {
                    onImageSelected &&
                    onImageSelected(painting);
                }
            }

            this.setState({ paintings });
        }
        catch (er) {
            console.warn("Image fetch FAILED", er);
        }

        this.setState({isLoading: false});
    }

    _renderItem = ({item}) => {
        const { onImageSelected, selectedImage } = this.props;
        
        return <ImageHolder item={item}
                            isSelected={selectedImage === item}
                            onImageSelected={onImageSelected}/>;
    }

    _keyExtractor = (item) => `painting_${item.id}`;

    render() {
        const { isLoading, paintings } = this.state;
        
        const paintingsData = Object.values(paintings);

        return (
            <View style={styles.holder}>
                {
                    isLoading ?
                    <View style={styles.loadingHolder}>
                        <ActivityIndicator />
                    </View> :
                    <FlatList horizontal={true}
                              data={paintingsData}
                              renderItem={this._renderItem}
                              keyExtractor={this._keyExtractor} />
                }        
            </View>
        );
    }
}

const styles = StyleSheet.create({
    holder: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 150,
        paddingHorizontal: 10,
        width: '100%'
    },
    
    loadingHolder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    imageHolder: {
        height: 150,
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5
    },

    imageSelected: {
        backgroundColor: '#F0F0F0'
    },

    paintingText: {
        marginTop: 10,
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
        color: '#383838'
    }
});