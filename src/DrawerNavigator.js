
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

//SCREENS
import HomeScreen from './screen/HomeScreen.js';
import CreateLeacture from './screen/CreateLeacture.js';
import Lecture from './screen/Lecture';
import Test from './screen/Test';
import CreateJoinClass from './screen/CreateJoinClass';
import ClassHome from './screen/ClassHome';
import CreateTest from './screen/CreateTest';
import Settings from './screen/Settings';

export default function DrawerNavigator(){
    return (<NavigationContainer>
        <Drawer.Navigator 
          drawerContent={(props) => <CustomDrawer clientProfile={clientProfile} setLoggedIn={setLoggedIn} {...props}/>}
          initialRouteName="Login">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={Settings} />
          <Drawer.Screen name="CreateJoinClass" component={CreateJoinClass} />
          <Drawer.Screen name="ClassHome" component={ClassRoomHomeStack} />
        </Drawer.Navigator>
    </NavigationContainer>);
}

const ClassRoomHomeStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen name="ClassHome" component={ClassHome} />
          <Stack.Screen name="Create Leacture" component={CreateLeacture} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen name="Lecture" component={Lecture} />
          <Stack.Screen name="CreateTest" component={CreateTest} />
      </Stack.Navigator>
  );
}