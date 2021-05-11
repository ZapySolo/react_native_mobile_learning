import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaView, View, Image, Appearance, ToastAndroid,ScrollView,RefreshControl} from 'react-native';
import { Divider} from '@ui-kitten/components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Layout, Input, Button, Text, Avatar, List, ListItem} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import Repository from '../src/utilities/pouchDB';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

let db = new Repository();
const Drawer = createDrawerNavigator();

export default CustomDrawer = (props) => {
    //const navigation = useNavigation();
    const [clientProfile, setClientProfile] = React.useState(null);
    const [classList, setClassList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
      getUserProfile();
    }, []);

    const wait = (timeout) => {
      return new Promise(resolve =>  {
        getUserProfile();
        resolve();
      });
  }
    
    useEffect(() => {
      if(_.get(clientProfile, '_id')){
        getClassList();
      }
    }, [clientProfile]);
  
    const getUserProfile = async () => {
      let res = JSON.parse(await AsyncStorage.getItem('@client_profile'))
      if(res){
        let clientProfile = await db.findByID(res._id);
        setClientProfile(clientProfile);
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
        students: { 
          $elemMatch: {
            studentID: clientProfile._id
          }
        }
      });
      listAsStudent = _.map(listAsStudent, o => {return {...o, userType:'STUDENT'}});
  
      setClassList([...listAsTeacher,...listAsStudent]);
    }
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <Layout level="1" style={{flex:1, paddingTop:30}}>
          {clientProfile ? (<View style={{alignItems:'center', marginTop:30}}>
            <Image source={{uri:clientProfile.profileImageUrl ? clientProfile.profileImageUrl:'https://source.unsplash.com/200x200/?face'}} style={{height:80, width:80, borderRadius:40, marginBottom:5}}/>
            <Text category="h5" style={{marginTop: 5}}>Welcome, {clientProfile.username}</Text>
            <Text category="s1" appearance="hint" >{clientProfile.email}</Text>
          </View>): <></>}
          <Divider style={{marginTop: 10}} />
          <ScrollView
                contentContainerStyle={{flexGrow:1}}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
                }
            >
          <List
            style={{padding:10}}
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
            </ScrollView>
            <Divider/>
            <Button 
              accessoryLeft={()=><MaterialCommunityIcons name="google-classroom" size={12} color="#3366FF" />}
              appearance="ghost"
              style={{justifyContent:'flex-start', paddingLeft:20}}
              onPress={()=>{props.navigation.navigate("CreateJoinClass")}}>Join Class</Button>
           <Divider/>
            <Button 
            style={{justifyContent:'flex-start', paddingLeft:20}}
              accessoryLeft={()=><Feather name="settings" size={12} color="#3366FF" />}
              appearance="ghost"   onPress={()=>{props.navigation.navigate("Settings")}}>Setting</Button>
          <Divider/>
            <Button 
            style={{justifyContent:'flex-start', paddingLeft:20}}
              accessoryLeft={()=><MaterialIcons name="logout" size={12} color="#3366FF" />}
              appearance="ghost"  
              onPress={async()=>{
                await AsyncStorage.setItem('@client_profile', '');
                props.setLoggedIn(false)
              }}>Logout</Button>
          <Divider/>
          <View style={{padding:10, alignItems:'center', textAlign:'center', justifyContent:'center', paddingTop:30}}>
            <Text category="p1" appearance='hint' style={{textAlign:"center", lineHeight:23, fontStyle:'italic'}} >Education is the passport to the future for tomorrow belongs to those who prepare for it today.</Text>
          </View>
          <View style={{alignItems:"center", justifyContent:'flex-end', padding:15, marginTop:20}}>
              <Text category="s2" appearance='hint'>Created By Group 1</Text>
          </View>
        </Layout>
    )
  }