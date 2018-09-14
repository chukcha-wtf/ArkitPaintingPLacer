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

import { connect } from 'react-redux';
import { PaintingActionCreators } from '../redux/actions';
import { selectActiveImage } from '../redux/reducers';

// redux map
const mapStateToProps = state => ({
    activeImage: selectActiveImage(state),
});

const mapDispatchToProps = dispatch => ({
    setActiveImage(image) {
        dispatch(PaintingActionCreators.setActiveImage(image));
    }
});

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

class PaintingList extends Component {
    state = {
        paintings: PaintingsData.paintings,
        isLoading: true
    };
    
    componentDidMount() {        
        this.getImages();
    }
    
    getImages = async () => {
        const { setActiveImage } = this.props;
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
                    setActiveImage &&
                    setActiveImage(painting);
                }
            }

            this.setState({ paintings });
        }
        catch (er) {
            console.warn("Image fetch FAILED", er);
        }

        this.setState({isLoading: false});
    }

    renderItem = ({item}) => {
        const { setActiveImage, activeImage } = this.props;
        
        return <ImageHolder item={item}
                            isSelected={activeImage === item}
                            onImageSelected={setActiveImage}/>;
    }

    keyExtractor = (item) => `painting_${item.id}`;

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
                              renderItem={this.renderItem}
                              keyExtractor={this.keyExtractor} />
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

PaintingList = connect(mapStateToProps, mapDispatchToProps)(PaintingList);

export default PaintingList;
