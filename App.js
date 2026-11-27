import React, { useRef, useEffect } from 'react';
import { View, StatusBar, BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from './html';

export default function App() {
  const ref = useRef(null);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      ref.current && ref.current.injectJavaScript(
        "(function(){try{if(H.length>1){back()}else{window.ReactNativeWebView.postMessage('exit')}}catch(e){window.ReactNativeWebView.postMessage('exit')}})();true;"
      );
      return true;
    });
    return () => sub.remove();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#020a05', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="light-content" backgroundColor="#020a05" />
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html: HTML }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1, backgroundColor: '#020a05' }}
        onMessage={(e) => { if (e.nativeEvent.data === 'exit') BackHandler.exitApp(); }}
      />
    </View>
  );
}
