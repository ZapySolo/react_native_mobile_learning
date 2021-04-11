import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import Repository from '../utilities/pouchDB';
import { useEffect } from 'react/cjs/react.development';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
let db = new Repository();

const lectureData = [
    {
        "_id": "lecture:abc",
        "lectureDescription": "Module 1: Intro",
        "lectureType": "",
        "startTime": new Date(),
        "attendanceBy": "QUIZ",
        "classID": "class:abc",
        "classTitle":"MIS",
        "lectureDoubt":[]
    }, {
        "_id": "lecture:xyz",
        "lectureDescription": "Module 1: Introduct",
        "lectureType": "",
        "startTime": new Date().getTime() + 1000*60*60, // getTime() + 59 min
        "attendanceBy": "QUIZ",
        "classID": "class:abc",
        "classTitle":"BDA",
        "lectureDoubt":[]
    }, {
        "_id": "lecture:xyz",
        "lectureDescription": "Module 1: Introduction",
        "lectureType": "",
        "startTime": new Date().getTime() + 1000*60*60*25, // getTime() + 25 hrs
        "attendanceBy": "QUIZ",
        "classID": "class:abc",
        "classTitle":"DSIP",
        "lectureDoubt":[]
    }
];

const postData = [
    { title: 'Gore M', duration: '1 hrs', type:'POST', description:'Lecture has been conducted'},
    { title: 'PK Swan', duration: '2 hrs', type:'TEST', description:'Give Test'},
    { title: 'Austin', duration: '4 hrs', type:'CREATE_TEST', description:'Create Test'},
    { title: 'Austin', duration: '4 hrs', type:'CREATE_LECTURE', description:'Create Lecture'},
];

const imageLink = 'https://source.unsplash.com/200x200'; //https://source.unsplash.com/100x100/?face

const HomeScreen = (props) => {
    const [clientProfile, setClientProfile] = useState({});

    const getClientData = async () => {
        try{
            let result = await AsyncStorage.getItem('@client_profile');
            result = JSON.parse(result)
            if(result._id !== clientProfile._id){
                setClientProfile(result);
            }
        } catch(err){
            setClientProfile({});
            console.log('Asyncstorage Error, ',err);
        }
    }

    const getData = async () => {
        console.log('getting homepage data!');
    }

    useEffect(()=>{
        getClientData();
    },[JSON.stringify(clientProfile)]);

    useEffect(()=>{
        if(!(_.get(Object.keys(clientProfile), 'length', 0) === 0 && _.get(clientProfile, 'constructor') === Object)){
            getData();
        }
    }, [clientProfile]);

    const calculateTimeRemm = (time) => {
        let currentTime = new Date().getTime();
        let calculateTime = new Date(time).getTime();

        let diff = calculateTime - currentTime;
        //console.log(`${calculateTime} - ${currentTime}`,diff);

        if(diff <= -1000*60*60){
            return '--';
        } else if (diff <= 0){
            return 'ongoing';
        } else if (diff <= 1000*60*60){
            return parseInt(diff/(1000*60))+' min';
        } else if (diff <= 1000*60*60*24){
            return parseInt(diff/(1000*60*60))+' hr';
        } else if (diff <= 1000*60*60*24*30){
            return parseInt(diff/(1000*60*60*24))+' days';
        } 
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="2" style={{flex: 1}}>
            <Header title="Home Screen" left={<Text onPress={()=>{props.navigation.openDrawer()}}>Drawer</Text>}/>
            <View style={{padding:10, paddingBottom:0}}>
                <Text category='s1'>Today</Text>
            </View>
            <List
                style={[styles.container, {padding:10, flexGrow:1}]}
                data={lectureData}
                ItemSeparatorComponent={() => <View style={{marginBottom:10}} />}
                renderItem={({ item, index }) => (
                    <ListItem
                        onPress={()=>{props.navigation.navigate('Lecture', {...item})}}
                        style={{ borderRadius:5}}
                        title={`${item.classTitle}`}
                        description={`${item.lectureDescription}`}
                        accessoryLeft={() => <Avatar size='medium' source={{uri:imageLink+2}}/>}
                        accessoryRight={() => <Text category="label" appearance="hint">{calculateTimeRemm(item.startTime)}</Text>}
                        />
                )}
                />
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    //flexGrow:1
    //maxHeight: 238,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

export default HomeScreen;