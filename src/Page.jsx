import React, {useEffect, useState, useRef, useContext} from "react";
import {Animated, View, Text, BackHandler, Alert, Linking, LogBox, Image, StyleSheet} from "react-native";
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

const ViewSite = () => {
    const [generatedUrl, setGeneratedUrl] = useState("https://talkingtehillim.com/");
    let webviewRef = useRef(null);
    const [backinfo, setBackInfo] = useState(false);
    const [spin, setSpin] = useState(true);
    const [translateDone, setTranslateDone] = useState(true);

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


    const fadeValue = useRef(new Animated.Value(1)).current; // Animated value for opacity
    const translateY = useRef(new Animated.Value(0)).current; // Animated value for Y position
  
    useEffect(() => {
      Animated.parallel([ // Animate opacity and Y position simultaneously
        Animated.timing(fadeValue, {
          toValue: 1, // Animate to fully visible (opacity 1)
          duration: 1000, // Animation duration in milliseconds
        }),
        Animated.timing(translateY, {
          toValue: -1000, // Target Y position (adjust as needed)
          duration: 1000, // Animation duration in milliseconds
        }),
      ]).start(() => {
        setTranslateDone(false)
      });
    }, []);

    const imageStyle = {
        transform: [{ translateY }], // Apply animated Y position
        opacity: fadeValue, // Apply animated opacity
      };


      return (
        <View style={styles.container}>


            <WebView 
                style={{}}
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
                        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
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

            {
                translateDone?
                <Animated.Image 
                    source={require("./assets/screen.png")} 
                    style={[styles.image, imageStyle]} 
                />:null
            }
            
        </View>
      );

    return(
        <View
            style={{
                flex: 1
            }}
        >

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Occupy full space
        position: 'absolute', // Ensure container overlaps content
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    image: {
      width: "100%",
      height: "100%",
    },
  });

export default ViewSite;