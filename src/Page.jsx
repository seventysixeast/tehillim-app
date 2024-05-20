import React, {useEffect, useState, useRef, useContext} from "react";
import {Animated, View, Text, BackHandler, Alert, Image, StyleSheet, Platform, Button} from "react-native";
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State
} from 'react-native-track-player';


const ViewSite = () => {
  TrackPlayer.registerPlaybackService(() => require('./service'));
    const [generatedUrl, setGeneratedUrl] = useState("https://talkingtehillim.com/");
    let webviewRef = useRef(null);
    const [backinfo, setBackInfo] = useState(false);
    const [spin, setSpin] = useState(true);
    const [translateDone, setTranslateDone] = useState("flex");

    const fadeValue = useRef(new Animated.Value(1)).current; // Animated value for opacity
    const translateY = useRef(new Animated.Value(0)).current; // Animated value for Y position
  
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

    useEffect(() => {
      Animated.parallel([ // Animate opacity and Y position simultaneously
        Animated.timing(fadeValue, {
          toValue: 1, // Animate to fully visible (opacity 1)
          duration: 1000, // Animation duration in milliseconds
        }),
        Animated.timing(translateY, {
          toValue: -1000, // Target Y position (adjust as needed)
          duration: 1500, // Animation duration in milliseconds
        }),
      ]).start(() => {
        setTranslateDone("none")
      });
    }, []);

    useEffect(() => {
      setupTrackPlayer();
      // return () => {
      //     TrackPlayer.destroy();
      // };
  }, []);

  const imageStyle = {
    transform: [{ translateY }], // Apply animated Y position
    opacity: fadeValue, // Apply animated opacity
  };


  // ==================================================================

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        // stopWithApp: true,
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          // Capability.Stop        
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
    });
 
  TrackPlayer.addEventListener('playback-state', async (state) => {
    if (state === State.Playing) {
        sendMessageToWebView({ type: 'play' }, 'playback-state');
    } else if (state === State.Paused) {
        sendMessageToWebView({ type: 'pause' }, 'playback-state');
    }
});

TrackPlayer.addEventListener('playback-seek-complete', async () => {
    const currentTime = await TrackPlayer.getPosition();
    sendMessageToWebView({ type: 'seek', currentTime }, 'playback-seek-complete');
});

TrackPlayer.addEventListener('remote-play', async () => {
    await TrackPlayer.play();
    sendMessageToWebView({ type: 'play' }, 'remote-play');
});

TrackPlayer.addEventListener('remote-pause', async () => {
    await TrackPlayer.pause();
    sendMessageToWebView({ type: 'pause' }, 'remote-pause');
});

TrackPlayer.addEventListener('remote-seek', async ({ position }) => {
    await TrackPlayer.pause();
    await TrackPlayer.seekTo(position);
    // await TrackPlayer.setVolume(0);
    sendMessageToWebView({ type: 'seek', currentTime: position }, 'remote-seek');
    // await TrackPlayer.play();
});

TrackPlayer.addEventListener('remote-stop', async () => {
    await TrackPlayer.stop();
    sendMessageToWebView({ type: 'stop' }, 'remote-stop');
});
};

const sendMessageToWebView = (message, fromWhere) => {
  console.log("from where ", fromWhere)
  if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
          (function() {
            window.postMessage('${JSON.stringify(message)}', '*');
          })();
      `);
  }
};

const playAudio = async (event) => {
  const message = JSON.parse(event.nativeEvent.data);
  if(message.type === "loadData"){
    
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    await TrackPlayer.setVolume(0);
    delete message.type
    await TrackPlayer.add(message).then(res => {
      console.log("now try to play ");
    })
    // await TrackPlayer.play();
    sendMessageToWebView({ type: 'play' }, 'play');
  } else if (message.type === 'play') {
    TrackPlayer.play();
    sendMessageToWebView({ type: 'play' }, 'play');
  } else if (message.type === 'pause') {

    console.log(message.currentTime)
    console.log(message.type)
    console.log(message.currentTime > 2)

    if(message.currentTime > 2){
      console.log(message.type)
      TrackPlayer.pause();
      sendMessageToWebView({ type: 'pause' }, 'remote-pause');  
    } else {
      TrackPlayer.play();
      sendMessageToWebView({ type: 'play' }, 'play');
    }

  } else if (message.type === 'seeking') {
    // await TrackPlayer.pause();
    await TrackPlayer.seekTo(message.currentTime);
    // await TrackPlayer.play();
  } else if(message.type === "stop") {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  }

};


  // ==================================================================
  return (
    <View style={styles.container}>
      <View style = {styles.backgroundContainer}>
      <WebView 
            style={Platform.OS == "ios"?{ marginBottom: 58 }:{display:"flex"}}
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
                  // document.getElementById('audplayerid').autoplay = false;
                `
            }

            // Get web response
            onMessage={(event)=>{
                console.log(event.nativeEvent.data)
                
                playAudio(event)
            }}

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
                SplashScreen.hide();
            }}
            // ====================================
        />
      </View>
      <View style = {{...styles.overlay, display: translateDone }}>
        <Animated.Image 
          source={require("./assets/screen.png")} 
          style={[styles.image, imageStyle]} 
        />
      </View>
    </View>
  )

}

var styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    width: "100%",
  },
  image: {
    width: "100%"
  },
  logo: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: 160,
    height: 52
  },
  backdrop: {
    flex:1,
    flexDirection: 'column'
  },
  headline: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white'
  }
});

export default ViewSite;