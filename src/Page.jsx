import React, {useEffect, useState, useRef, useContext} from "react";
import {View, Text, BackHandler, Alert, Linking, LogBox} from "react-native";
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
const ViewSite = () => {
    const [generatedUrl, setGeneratedUrl] = useState("https://talkingtehillim.com/");
    useEffect(()=>{
        SplashScreen.hide();
    },[])

    return(
        <View
            style={{
                flex: 1
            }}
        >
<WebView source={{ uri: generatedUrl }} style={{ flex: 1 }} />
        </View>
    )

}

export default ViewSite;