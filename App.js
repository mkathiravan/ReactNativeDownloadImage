import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
const App = () => {

  const IMAGE_PATH = 'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2021/06/22/16243660004256.jpg';

  const checkPermision = async () => {
    if(Platform.OS === 'ios')
    {
      downloadImage()
    }
    else
    {
      try
      {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download photos'

        }
        )

        if(granted == PermissionsAndroid.RESULTS.GRANTED)
        {
          console.log('Storage Permission Granted.')
          downloadImage()
        }
        else
        {
          alert('Storage Permission Not Granted')
        }
      }catch(error)
      {
        console.warn(error)
      }
    }
  }


  const downloadImage = () => {
    let date = new Date()
    let image_URL = IMAGE_PATH
    let ext = getExtention(image_URL)
    ext = ' . ' + ext[0]
    // Get config and fs from RNFetchBlob

    const {config, fs} = RNFetchBlob
    let PictureDir = fs.dirs.PictureDir
    let options = {
      fileCache: true,
      addAndroidDownloads:{
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: PictureDir + '/image_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
        description: 'Image'


      }
    }

    config(options).fetch('GET', image_URL).then(res => {
      // Showing alert after successfully downloading
      console.log('res -> ', JSON.stringify(res))
      alert('Image Downloaded Successfully.')
    })

  }

  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined
  }


  return(
    <View style = {{flex: 1}}>

        <Image source={{uri: IMAGE_PATH}} style={styles.image}/>

        <TouchableOpacity style = {styles.button}
          onPress={checkPermision}>
        <Text style = {styles.text}>
          Download Image
        </Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

  button:{
    padding: 10,
    backgroundColor: 'orange'
  },

  text:{
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'

  },
  image:{
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    margin: 5
  }
});

export default App;