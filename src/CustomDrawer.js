import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaView, View, Image, Appearance, ToastAndroid} from 'react-native';
import { Divider} from '@ui-kitten/components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';

import { Layout, Input, Button, Text, Avatar, List, ListItem} from '@ui-kitten/components';
import Repository from '../src/utilities/pouchDB';
let db = new Repository();

const Drawer = createDrawerNavigator();

export default CustomDrawer = (props) => {
    //const navigation = useNavigation();
    const [clientProfile, setClientProfile] = React.useState(null);
    const [classList, setClassList] = React.useState([]);
  
    useEffect(() => {
      getUserProfile();
    }, []);
    
    useEffect(() => {
      if(_.get(clientProfile, '_id')){
        getClassList();
      }
    }, [clientProfile]);
  
    const getUserProfile = async () => {
      let res = JSON.parse(await AsyncStorage.getItem('@client_profile'))
      if(res){
        setClientProfile(res);
      } else {
        console.log('no profile found!');
      }
    }
  
  
    const getClassList = async () => {
      let listAsTeacher = await db.findMany({
        _id: {
          $regex: 'class'
        },
        teacherID: clientProfile._id
      });
      listAsTeacher = _.map(listAsTeacher, o => {return {...o, userType:'TEACHER'}});
      let listAsStudent = await db.findMany({
        _id: {
          $regex: 'class'
        },
        students: { $all: [clientProfile._id] }
      });
      listAsStudent = _.map(listAsStudent, o => {return {...o, userType:'STUDENT'}});
  
      setClassList([...listAsTeacher,...listAsStudent]);
    }
  
    return (
        <Layout level="1" style={{flex:1, paddingTop:30}}>
          {clientProfile ? (<View style={{alignItems:'center', marginTop:30, marginBottom:25}}>
            <Image source={{uri:clientProfile.profileImageUrl ? clientProfile.profileImageUrl:'https://source.unsplash.com/200x200/?face'}} style={{height:80, width:80, borderRadius:40, marginBottom:5}}/>
            <Text category="h5">Welcome, {clientProfile.username}</Text>
            <Text category="s1">{clientProfile.email}</Text>
            <Text category="s1" appearance="hint" onPress={()=>{props.navigation.navigate("Settings")}}>Settings</Text>
          </View>): <></>}
          <Divider />
          <List
            style={{padding:10, flexGrow:1}}
            data={classList}
            renderItem={({ item, index }) => (
              <ListItem
                style={{borderRadius:5}}
                title={`${item.classTitle}`}
                description={`${item.classSubTitle}`}
                onPress={()=>{props.navigation.navigate("ClassHome", {data:{...item}})}}
                accessoryLeft={() => <Avatar size='medium' source={{uri:item.classProfileImage?item.classProfileImage:'https://source.unsplash.com/200x200/?abstract'}}/>}
              />
          )}
            ItemSeparatorComponent={() => <View style={{marginTop:5}} />}
            />
          <View>
            <Button appearance="ghost" onPress={()=>{props.navigation.navigate("CreateJoinClass")}}>Create/Join Class</Button>
          </View>
          <View style={{padding:10, alignItems:'center', textAlign:'center', justifyContent:'center', paddingTop:30}}>
            <Text category="p1" appearance='hint' style={{textAlign:"center", lineHeight:23, fontStyle:'italic'}} >Education is the passport to the future for tomorrow belongs to those who prepare for it today.</Text>
          </View>
          <View style={{marginTop:30}}>
            <Button 
              accessoryRight={()=><MaterialIcons name="logout" size={12} color="#3366FF" />}
              appearance="ghost" 
              onPress={async()=>{
                await AsyncStorage.setItem('@client_profile', '');
                props.setLoggedIn(false)
              }}>Logout</Button>
              
          </View>
          <View style={{alignItems:"center", justifyContent:'flex-end', padding:15}}>
              <Text category="s1" appearance='hint'>Created By Group 1</Text>
          </View>
        </Layout>
    )
  }