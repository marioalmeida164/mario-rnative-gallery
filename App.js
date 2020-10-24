import React, { useState, useEffect, useRef } from "react";
import {
 Button,
  Image,
  View,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Video from 'react-native-video';

export default function App() {
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
  const [hasPermissionImagePicker, setHasPermissionImagePicker] = useState(
    null
  );

  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestPermissionsAsync();
      setHasPermissionCamera(cameraPermission.status === "granted");
      const imagePickerPermission = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasPermissionImagePicker(imagePickerPermission.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takeImage = async () => {
    // console.log(cameraRef.current);
    let result = await cameraRef.current.takePictureAsync();
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      MediaLibrary.saveToLibraryAsync(result.uri);
    }
  };

  if ((hasPermissionCamera === hasPermissionImagePicker) === null) {
    return <View />;
  }
  if (hasPermissionCamera === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasPermissionImagePicker === false) {
    return <Text>No access to image gallery</Text>;
  }
  return (
    <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
      <StatusBar style="auto" />
      <Button title="Tomar foto" onPress={takeImage} />
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <Button title="Seleccionar foto" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 250,
            height: 250,
            alignItems: "center",
          }}
        />
      )}  
    </View>
  );
}
