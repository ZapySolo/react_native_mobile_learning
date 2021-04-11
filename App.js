import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaView, View, Image, Appearance, ToastAndroid} from 'react-native';
import { ApplicationProvider, Divider, IconRegistry, Toggle } from '@ui-kitten/components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-community/async-storage';
import Settings from './src/screen/Settings';
import _ from 'lodash';
import {v4 as uuid} from "uuid";

import CustomDrawer from './src/CustomDrawer';

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

  const [newCreateUsername, setnewCreateUsername] = React.useState(null);
  const [newCreateEmail, setnewCreateEmail] = React.useState(null);
  const [newCreatePassword, setnewCreatePassword] = React.useState(null);

  const checkForTheme = async () => {
    let result = await AsyncStorage.getItem('@color_theme');
    if(!result){
      await AsyncStorage.setItem('@color_theme', 'LIGHT');
    } else {
      setToggleTheme(result === 'DARK' ? false : true);
    }
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
    checkForTheme()
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

  const handleCreateNewUser = async () => {
    let res = {
      newCreateUsername: /^[a-z A-Z\-]+$/.test(newCreateUsername),
      newCreateEmail: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(newCreateEmail),
      newCreatePassword: /^[a-zA-Z0-9\-]+$/.test(newCreatePassword)
    }
    if(res.newCreateEmail && res.newCreateUsername && res.newCreatePassword){
        let alreadyContainEmail = await db.findMany({
          email: newCreateEmail
        });
        if(alreadyContainEmail.length === 0){
          let obj = {
            _id: "profile:"+uuid.v4(),
            allowEmailNotification: false,
            allowPushNotification: false,
            created: new Date().toISOString(),
            isDeleted: false,
            password: {
              salt: 'abc',
              hash: await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                newCreatePassword
              )
            },
            profileImageUrl: 'https://source.unsplash.com/200x200/?'+_.replace(newCreateUsername, / /g, ""),
            type: 'USER',
            username: newCreateUsername,
            email: newCreateEmail
          }
          let createRes = await db.upsert(obj);
          if(createRes){
            ToastAndroid.showWithGravityAndOffset(
              "User Successfully Created",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25, 50
            );
            setLoginEmail(newCreateEmail);
            setLoginPassword(newCreatePassword);
            setLoginFormInput('LOGIN');

            setnewCreateEmail('');
            setnewCreatePassword('');
            setnewCreateUsername('');
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Email already in use",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25, 50
      );
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid Credentials",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25, 50
    );
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
        {loginFormInput === 'LOGIN' || loginFormInput === 'REGISTER' ? <>
          {loginFormInput === 'LOGIN' ? 
            <View style={{padding:10}}>
                <View ><Input value={loginEmail} status={loginError?"danger":"basic"} onChangeText={o=>setLoginEmail(o)} size="large" placeholder="Enter your email"/></View>
                <View style={{paddingTop:0}}><Input status={loginError?"danger":"basic"} value={loginPassword} onChangeText={o=>setLoginPassword(o)} secureTextEntry={true} size="large" placeholder="Enter your password" /></View>
                <Button style={{marginTop:10}} onPress={()=>{handleLogin()}}>Login</Button>
                <Button appearance="outline" style={{marginTop:10}} onPress={()=>{setLoginFormInput(false)}}>Back</Button>
            </View>
            :<View style={{padding:10}}>
                <View ><Input value={newCreateUsername} onChangeText={o=>setnewCreateUsername(o)} size="large" placeholder="Enter your username"/></View>
                <View ><Input value={newCreateEmail} onChangeText={o=>setnewCreateEmail(o)} size="large" placeholder="Enter your email"/></View>
                <View style={{paddingTop:0}}><Input value={newCreatePassword} onChangeText={o=>setnewCreatePassword(o)} secureTextEntry={true} size="large" placeholder="Enter your password" /></View>
                <Button style={{marginTop:10}} onPress={()=>{handleCreateNewUser()}}>Create Account</Button>
                <Button appearance="outline" style={{marginTop:10}} onPress={()=>{setLoginFormInput(false)}}>Back</Button>
            </View>}
          </>
          :<>
          <View>
              <View style={{alignItems:'center'}}>
                  <Button disabled accessoryLeft={()=><Text>G</Text>} style={{width:'60%'}}> Sign in with Google </Button>
              </View>
              <View style={{alignItems:'center', marginTop:30}}>
                  <Button accessoryLeft={()=><Text>ML</Text>} style={{width:'60%'}} onPress={()=>{setLoginFormInput('LOGIN')}}> Sign in with ML Account </Button>
              </View>
              <View>
                <Button appearance="ghost" onPress={()=>{setLoginFormInput('REGISTER')}} style={{marginTop:20}}>Create a ML Account</Button>
              </View>
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