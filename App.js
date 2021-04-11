import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaView, View, Image, Appearance} from 'react-native';
import { ApplicationProvider, Divider, IconRegistry, Toggle } from '@ui-kitten/components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-community/async-storage';
import Settings from './src/screen/Settings';
import _ from 'lodash';

//import Login from './src/screen/Login';
// // import { EvaIconsPack } from '@ui-kitten/eva-icons'; //<-- NOT WORKING

//SCREENS
import HomeScreen from './src/screen/HomeScreen.js';
import CreateLeacture from './src/screen/CreateLeacture.js';
import Lecture from './src/screen/Lecture';
import Test from './src/screen/Test';
import CreateJoinClass from './src/screen/CreateJoinClass';
import ClassHome from './src/screen/ClassHome';
import CreateTest from './src/screen/CreateTest';

import { Layout, Input, Button, Text, Avatar, List, ListItem} from '@ui-kitten/components';
import Repository from './src/utilities/pouchDB';
let db = new Repository();

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loginFormInput, setLoginFormInput] = React.useState(false);//Required by login page
  const [toggleTheme, setToggleTheme] = React.useState(true);//false = darkModec

  const [loginEmail, setLoginEmail] = React.useState('nikhil@gmail.com');
  const [loginPassword, setLoginPassword] = React.useState('password');
  
  const [loginError, setLoginError] = React.useState(false);
  const [clientProfile, setClientProfile] = React.useState(null);

  const onThemeChange = ({colorScheme}) => {
    setToggleTheme(colorScheme === 'dark' ? false : true);
  }

  const checkIfAlreadyLoggedIn = async () => {
    let result = await AsyncStorage.getItem('@client_profile');
    console.log('checkIfAlreadyLoggedIn', JSON.parse(result));
    if(result) {
      setClientProfile(JSON.parse(result));
      setLoggedIn(true);
    };
    return (result) ? true : false;
  }

  React.useEffect(() => {
    checkIfAlreadyLoggedIn();
    Appearance.addChangeListener(onThemeChange);
    return () => Appearance.removeChangeListener(onThemeChange);
  }, []);

  const handleLogin = async () => {
    setLoginError(false);

    const email = loginEmail;
    const password = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      loginPassword
    );
    // console.log({email, password});

    //   let upsertREs = await db.upsert({
    //     _id: 'profile:6289c5fd-f671-4e83-989b-e23662981fd9',
    //     username: 'Raj Surve',
    //     password: {
    //         salt: 'abc',
    //         hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    //     },
    //     profileImageUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
    //     email: 'raj@gmail.com',
    //     allowPushNotification: true,
    //     allowEmailNotification: false,
    //     type: 'USER',
    //     isDeleted: false,
    //     created: new Date().toISOString()
    // });

    let profileRes = await db.findMany({
      _id: {
        $regex: 'profile'
      },
      email: email,
      'password.hash': password
    });

    if(profileRes.length === 0){
      setLoginError(true);
    } else if (profileRes.length >= 1){
      if(profileRes.length > 1) console.log('multiple profiles found: ', profileRes);
      try{
        await AsyncStorage.setItem('@client_profile', JSON.stringify(profileRes[0]));
        setLoginEmail('');
        setLoginPassword('');
        setLoggedIn(true);
      } catch(err) {
        console.log('error inside Async Storage: ',err);
      }
      
    }
  }

  return (
    <ApplicationProvider {...eva} theme={toggleTheme?eva.light:eva.dark}>
      {loggedIn
      ?
        <NavigationContainer>
          <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawer clientProfile={clientProfile} setLoggedIn={setLoggedIn} {...props}/>}
            initialRouteName="Login">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Create Lecture" component={CreateLeacture} />
            <Drawer.Screen name="Lecture" component={Lecture} />
            <Drawer.Screen name="Test" component={Test} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="CreateJoinClass" component={CreateJoinClass} />
            <Drawer.Screen name="ClassHome" component={ClassHome} />
            <Drawer.Screen name="CreateTest" component={CreateTest} />
          </Drawer.Navigator>
        </NavigationContainer>
      : 
      <Layout level='3' style={{flex: 1, paddingTop:30}}>
        <View style={{flexGrow:1, justifyContent:'center', alignItems:'center'}}>
            <Text category="h1">ML ICON</Text>
            <Text category="h1">Mobile App for</Text>
            <Text category="h1">Mobile Learning</Text>
            <Text category="h6">Creating new Modern Classes</Text>
        </View>
        {!loginFormInput?<>
        <View style={{}}>
            <View style={{alignItems:'center'}}>
                <Button disabled accessoryLeft={()=><Text>G</Text>} style={{width:'60%'}}> Sign in with Google </Button>
            </View>
            <View style={{alignItems:'center', marginTop:30}}>
                <Button accessoryLeft={()=><Text>ML</Text>} style={{width:'60%'}} onPress={()=>{setLoginFormInput(true)}}> Sign in with ML Account </Button>
            </View>
        </View>
        </> : <>
        <View style={{padding:10}}>
            <View ><Input value={loginEmail} status={loginError?"danger":"basic"} onChangeText={o=>setLoginEmail(o)} size="large" placeholder="Enter your email"/></View>
            <View style={{paddingTop:0}}><Input status={loginError?"danger":"basic"} value={loginPassword} onChangeText={o=>setLoginPassword(o)} secureTextEntry={true} size="large" placeholder="Enter your password" /></View>
            <Button style={{marginTop:10}} onPress={()=>{handleLogin()}}>Login</Button>
            <Button appearance="outline" style={{marginTop:10}} onPress={()=>{setLoginFormInput(false)}}>Back</Button>
        </View>
        </>}
        <View style={{ alignItems:"center", justifyContent:'flex-end', padding:20}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text>Dark</Text>
              <Toggle style={{margin:5}} checked={toggleTheme} onChange={()=>setToggleTheme(!toggleTheme)} />
              <Text>Light</Text>
            </View>
            <Text category="h6" appearance='hint'>Created By Pied Piper</Text>
        </View>
      </Layout>}
      </ApplicationProvider>
  );
}

const CustomDrawer = (props) => {
  //const navigation = useNavigation();
  const [clientProfile, setClientProfile] = React.useState(null);
  const [classList, setClassList] = React.useState([]);

  useEffect(() => {
    getUserProfile();
  }, [])

  const getUserProfile = async () => {
    let res = JSON.parse(await AsyncStorage.getItem('@client_profile'))
    if(res){
      setClientProfile(res);
      getClassList();
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
            //accessoryRight={()=><Text>{'>'}</Text>}
            appearance="ghost" 
            onPress={async()=>{
              await AsyncStorage.setItem('@client_profile', '');
              props.setLoggedIn(false)
            }}>Logout {" >"}</Button>
        </View>
        <View style={{alignItems:"center", justifyContent:'flex-end', padding:15}}>
            <Text category="s1" appearance='hint'>Created By Pied Piper</Text>
        </View>
      </Layout>
  )
}