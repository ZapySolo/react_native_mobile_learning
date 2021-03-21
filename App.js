import 'react-native-gesture-handler';
import * as React from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaView, View, Image, Appearance} from 'react-native';
import { ApplicationProvider, Divider, IconRegistry, Toggle } from '@ui-kitten/components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from './src/screen/Settings';
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

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loginFormInput, setLoginFormInput] = React.useState(false);//Required by login page
  const [toggleTheme, setToggleTheme] = React.useState(true);//false = darkMode
  
  const onThemeChange = ({colorScheme}) => {
    setToggleTheme(colorScheme === 'dark' ? false : true);
  }

  React.useEffect(() => {
    Appearance.addChangeListener(onThemeChange);
    return () => Appearance.removeChangeListener(onThemeChange)
  }, []);

  return (
    <ApplicationProvider {...eva} theme={toggleTheme?eva.light:eva.dark}>
      {loggedIn
      ?
        <NavigationContainer>
          <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawer setLoggedIn={setLoggedIn} {...props}/>}
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
            <View ><Input size="large" placeholder="Enter your email"/></View>
            <View style={{paddingTop:0}}><Input secureTextEntry={true} size="large" placeholder="Enter your password" /></View>
            <Button style={{marginTop:10}} onPress={()=>{setLoggedIn(true)}}>Login</Button>
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

  const menu = [
    {
      title: "Computer 2017-18: MIS",
      subTitle: "SEM 7",
      linkName:"Home",
      params: {
        classID: 'mis:27183y1'
      }
    },{
      title: "Computer 2017-18: DSIP",
      subTitle: "SEM 7",
      linkName:"Home",
      params: {
        classID: 'dsip:283y19283'
      }
    }
  ];
  return (
      <Layout level="1" style={{flex:1, paddingTop:30}}>
        <View style={{alignItems:'center', marginTop:30, marginBottom:25}}>
          <Image source={{uri:'https://source.unsplash.com/200x200/?face'}} style={{height:80, width:80, borderRadius:40, marginBottom:5}}/>
          <Text category="h5">Welcome, Sam</Text>
          <Text category="s1">sam@gmail.com</Text>
          <Text category="s1" appearance="hint" onPress={()=>{props.navigation.navigate("Settings")}}>Settings</Text>
        </View>
        <Divider />
        <List
          style={{padding:10, flexGrow:1}}
          data={menu}
          renderItem={({ item, index }) => (
            <ListItem
              style={{borderRadius:5}}
              title={`${item.title}`}
              description={`${item.subTitle}`}
              onPress={()=>{props.navigation.navigate("ClassHome", {...item})}}
              accessoryLeft={() => <Avatar size='medium' source={{uri:'https://source.unsplash.com/200x200/?abstract'}}/>}
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
            onPress={()=>{props.setLoggedIn(false)}}>Logout {" >"}</Button>
        </View>
        <View style={{alignItems:"center", justifyContent:'flex-end', padding:15}}>
            <Text category="s1" appearance='hint'>Created By Pied Piper</Text>
        </View>
      </Layout>
  )
}