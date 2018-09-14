## How to Hang a painting on the wall with React Native
#### An ARKit demo app
This is a demo application created for [this](https://www.youtube.com/watch?v=y-ZFOL_aLr8&index=8&list=PLZ3MwD-soTTEOWXU2I8Y8C3AfqvJdn3M_) talk at React Native EU 2018.

You can also find a [presentation](https://speakerdeck.com/pavlob/how-to-hang-a-painting-on-the-wall-with-react-native) useful to follow up with the development process.

### The purpose

While [ViroAR](https://viromedia.com/) remains a popular AR/VR solution for developing cross-platform ReactNative applications there's also an OpenSource solutions like [react-native-arkit](https://github.com/react-native-ar/react-native-arkit) or [react-reality](https://github.com/rhdeck/react-reality) available that can provide you with a good quality apps.

Main goal of this app is to demonstrate how easy you can create AR experiences using React Native and some open-source libraries. The demo app is built to help you hang different paintings on the wall.

During the talk we're going through specific steps of interacting with ARKit and you can follow up all this steps by switching between commits.

### Development steps

1. Initial project setup
2. Integrating `react-native-arkit` into the app
3. Adding first `Box` object that will be our painting
4. Playing with `withProjectedPosition()` HOC
5. Adding a wall detection
6. Placing and removing the painting
7. Adding ability to move the painting around
8. Download images to be displayed
9. Adding the underlying 3D text under each painting
10. Adding a snapshot feature

### Libraries used:
- [react-native](https://github.com/facebook/react-native) - cause React Native
- [react-native-arkit](https://github.com/react-native-ar/react-native-arkit) - For interacting with ARKit
- [react-native-fs](https://github.com/itinance/react-native-fs) - For files downloading
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) - For icons across the app
- [react-native-permissions](https://github.com/yonahforst/react-native-permissions) - For Photo Library access
- [react-redux](https://github.com/reduxjs/react-redux) - For state management


