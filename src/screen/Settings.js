import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select,Toggle} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import Header from '../Header';
import AsyncStorage from '@react-native-community/async-storage';
import Repository from '../utilities/pouchDB';
import { Ionicons } from '@expo/vector-icons';
// import { DocumentPicker, ImagePicker } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import S3 from '../utilities/aws/s3';
let s3 = new S3();

let db = new Repository();

const Settings = (props) => {
    const [changeName, setChangeName] = useState('');
    const [clientProfile, setClientProfile] = useState(null);

    const [notificationState, setNotificationState] = useState(false);

    const [imageUri, setImageUri] = useState(null);

    const onCheckedChange = async (isChecked) => {
        let user = JSON.parse(await AsyncStorage.getItem('@client_profile'));
        let clientProfile = await db.findByID(user._id);
        clientProfile.allowPushNotification = isChecked;
        await db.upsert(clientProfile);
        setNotificationState(isChecked);
    }

    useEffect(()=>{
        getClientData();
    }, []);

    const showToast = (text) => {
        ToastAndroid.showWithGravityAndOffset(
            text,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };

    const getClientData = async () => {
        let user = JSON.parse(await AsyncStorage.getItem('@client_profile'));
        let clientProfile = await db.findByID(user._id);
        setClientProfile(clientProfile);
        setChangeName(clientProfile.username);
        setNotificationState(clientProfile.allowPushNotification);
    }

    const handleProfileImageUpload = async () => {
        let imageUploadResult = await s3.uploadProfilePhoto();
        console.log('imageUploadResult',imageUploadResult);
        if(imageUploadResult && imageUploadResult.postResponse){
            let profileImageUrl = imageUploadResult.postResponse.location;
            let userID = JSON.parse(await AsyncStorage.getItem('@client_profile'));
            userID = userID._id;
            let userProfileResult = await db.findByID(userID);
            userProfileResult.profileImageUrl = profileImageUrl
            await db.upsert(userProfileResult);
            setImageUri(profileImageUrl);
        }
    }

    const handleFileUpload = async () => {
        let result = await s3.fileUpload();
        let fileLocation = result.postResponse.location;
        console.log('fileLocation',fileLocation);
    }

    const handleUserNameChange = async (newName) => {
        let resule = await db.findByID(clientProfile._id);
        resule.username = newName;
        console.log('resule',resule);
        let res = await db.upsert(resule);
        setChangeName(newName);
        if(res){
            await AsyncStorage.setItem('@client_profile', JSON.stringify(resule));
            showToast('Name Changed Successfully!')
        } else {
            showToast('Error Occured while Changing usernme')
        }
    }

    const UserNameInput = (props) => {
        const [newChangeName, setNewChangeName] = useState(props.username); 
        return <Input
            value={newChangeName}
            //placeholder="Enter your name"
            onBlur={()=>{
                handleUserNameChange(newChangeName)
            }}
            onChangeText={e => {
                setNewChangeName(e);
            }}
        />
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='2' style={{flex: 1}}>
            <Header title="Settings" 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    props.navigation.goBack();
                }}/>}
                right={null}/>
            <ListItem
                onPress={() => handleProfileImageUpload()}
                style={{minHeight:70, paddingLeft:15,paddingRight:15, marginTop:2}}
                accessoryRight={()=>{
                    return (imageUri) ?  <Avatar size='medium' source={{uri:imageUri}}/> : <></>;
                }}
                description={()=><View>
                    <Text category='s1' >{'Update Photo'}</Text>
                </View>}
            />
            <Divider />
            <ListItem
                style={{minHeight:70, paddingLeft:15,paddingRight:15}}
                description={()=><View>
                    <Text category='s1' >{'Change Name'}</Text>
                </View>}
                accessoryRight={() => <UserNameInput username={changeName} />}
            />
            <Divider />
            <ListItem
                disabled
                style={{minHeight:70, paddingLeft:15,paddingRight:15}}
                description={()=><View>
                    <Text category='s1' >{'Notifications'}</Text>
                </View>}
                accessoryRight={() => <View><Toggle 
                    //style={{transform:[{scale:0.8}, {translateY:5}], height:10}}
                     checked={notificationState} onChange={onCheckedChange} /></View>}
            />
            <Divider />
            <ListItem
                disabled
                style={{minHeight:70, paddingLeft:15,paddingRight:15}}
                description={()=><View>
                    <Text category='s1' appearance="hint" >{'Feedback Form'}</Text>
                </View>}
            />
            <Divider />
            <ListItem
                disabled
                style={{minHeight:70, paddingLeft:15,paddingRight:15}}
                description={()=><View>
                    <Text category='s1' appearance="hint" >{'Software Information'}</Text>
                </View>}
            />
            <Button onPress={()=>{
                db.promisesReplicateFrom();
            }}>Sync Database</Button>
            <Divider />
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 238,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

export default Settings;