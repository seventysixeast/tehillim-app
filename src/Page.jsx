import React, {useEffect, useState, useRef, useContext} from "react";
import {Animated, View, Text, BackHandler, Alert, Image, StyleSheet, Platform, Button} from "react-native";
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import notifee, { TimestampTrigger, TriggerType, EventType } from '@notifee/react-native';
import TrackPlayer from 'react-native-track-player';

const ViewSite = () => {
    const [generatedUrl, setGeneratedUrl] = useState("https://talkingtehillim.com/");
    let webviewRef = useRef(null);
    const [backinfo, setBackInfo] = useState(false);
    const [spin, setSpin] = useState(true);
    const [translateDone, setTranslateDone] = useState("flex");

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
          duration: 1500, // Animation duration in milliseconds
        }),
      ]).start(() => {
        setTranslateDone("none")
      });
    }, []);

  const imageStyle = {
    transform: [{ translateY }], // Apply animated Y position
    opacity: fadeValue, // Apply animated opacity
  };


  // ==================================================================

  const onCreateTriggerNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Set up the player
    await TrackPlayer.setupPlayer();

    await TrackPlayer.add({
      id: 'local-track-1',
      // url: "https://talkingtehillim.com/tehillim/week/4-wednesday.mp3",
      title: 'Pure (Demo) from handler',
      artist: 'David Chavez',
    //  artwork: 'https://storage.googleapis.com/static.invertase.io/assets/avatars/female.png',
      duration: 28,
    });
    await TrackPlayer.play();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    notifee.onForegroundEvent(async event => {
      console.log(event.type)
      console.log(EventType.DELIVERED)
      console.log(event.type === EventType.DELIVERED)
      // To Automatically play once notification is received
      if (event.type === EventType.DELIVERED) {
        await TrackPlayer.add({
          id: 'local-track-1',
          url: localTrack,
          title: 'Pure (Demo) from handler',
          artist: 'David Chavez',
        //  artwork: 'https://storage.googleapis.com/static.invertase.io/assets/avatars/female.png',
          duration: 28,
        });
        await TrackPlayer.play();
      }
        
      // To play once action is press
      if (event.type === EventType.ACTION_PRESS && event.detail?.pressAction?.id === 'play') {
        // play track
      }
    })

    // Display a notification
    // await notifee.displayNotification({
    //   title: 'Notification Title',
    //   body: 'Main body content of the notification',
    //   android: {
    //     channelId,
    //     // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //     // pressAction is needed if you want the notification to open the app when pressed
    //     pressAction: {
    //       id: 'default',
    //     },
    //   },
    // });
  }

  // ==================================================================

  return (
    <View style={styles.container}>
      <View style = {styles.backgroundContainer}>
      <Button title="Create Trigger Notification" onPress={() => onCreateTriggerNotification()} />
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