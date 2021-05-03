import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select,Toggle} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import Header from '../Header';
import AsyncStorage from '@react-native-community/async-storage';
import Repository from '../utilities/pouchDB';
import { Ionicons } from '@expo/vector-icons';

let db = new Repository();

const Settings = (props) => {
    const [changeName, setChangeName] = useState('');
    const [clientProfile, setClientProfile] = useState(null);

    const [notificationState, setNotificationState] = useState(false);

    const onCheckedChange = (isChecked) => {
        setNotificationState(isChecked);
    }

    useEffect(()=>{
        getClientData();
    }, []);

    const showToast = (text) => {
        // ToastAndroid.showWithGravity(
        //     "All Your Base Are Belong To Us",
        //     ToastAndroid.SHORT,
        //     ToastAndroid.CENTER
        //     );
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
        setClientProfile(user);
        setChangeName(user.username);
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
                disabled
                style={{minHeight:70, paddingLeft:15,paddingRight:15, marginTop:2}}
                description={()=><View>
                    <Text category='s1' appearance="hint">{'Update Photo'}</Text>
                </View>}
            />
            <Divider />
            <ListItem
                style={{minHeight:70, paddingLeft:15,paddingRight:15}}
                description={()=><View>
                    <Text category='s1' >{'Change Name'}</Text>
                </View>}
                accessoryRight={() => <Input onBlur={async()=>{
                    let resule = await db.findByID(clientProfile._id);
                    resule.username = changeName;
                    let res = await db.upsert(resule);
                    if(res){
                        await AsyncStorage.setItem('@client_profile', JSON.stringify(resule));
                        showToast('Name Changed Successfully!')
                    } else {
                        showToast('Error Occured while Changing usernme')
                    }
                    
                }} >{changeName}</Input>}
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