import React, {useEffect, useState, useRef, useContext} from "react";
import {View, Text, BackHandler, Alert, Linking, LogBox} from "react-native";
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
const ViewSite = () => {
    const [generatedUrl, setGeneratedUrl] = useState("https://talkingtehillim.com/");
    let webviewRef = useRef(null);
    const [backinfo, setBackInfo] = useState(false);
    const [spin, setSpin] = useState(true);
    useEffect(()=>{
        SplashScreen.hide();
    },[])

    useEffect(() => {

        const backAction = () => {
            if(webviewRef.current && backinfo){
                webviewRef.current.goBack();
            } else {
                Alert.alert('Exit From App!', 'Do you want to exit from App ?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {text: 'YES', onPress: () => BackHandler.exitApp()},
                ]);
            }
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, [backinfo]);

    return(
        <View
            style={{
                flex: 1
            }}
        >
            <WebView 
                source={{ uri: generatedUrl }} 
                ref={webviewRef}
                allowsBackForwardNavigationGestures
                onNavigationStateChange={(res) => {
                    console.log("onNavigationStateChange ===>", res.url)
                    setBackInfo(res.canGoBack)
                }}

                TouinjectedJavaScript={
                    `   
                        const meta = document.querySelector('meta[name="viewport"]');
                        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
                    `
                }

                //Enable Javascript support
                javaScriptEnabled={true}
                    
                //For the Cache
                domStorageEnabled={true}
                allowFileAccess={true}
                allowFileAccessFromFileURLs={true}
                allowingReadAccessToURL={true}
                mixedContentMode={'always'}
                //Want to show the view or not
                startInLoadingState={true}
                onLoadStart={() => setSpin(true)}
                onLoadEnd={(e)=> {
                    // console.log("----------===",e)
                    setSpin(false)
                }}
                // ====================================
            />
        </View>
    )

}

export default ViewSite;