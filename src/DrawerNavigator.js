
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

//SCREENS
import HomeScreen from './screen/HomeScreen.js';
import CreateLeacture from './screen/CreateLeacture.js';
import Lecture from './screen/Lecture';
import Test from './screen/Test';
import CreateJoinClass from './screen/CreateJoinClass';
import ClassHome from './screen/ClassHome';
import CreateTest from './screen/CreateTest';

export default function DrawerNavigator(){
    return (<NavigationContainer>
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
    </NavigationContainer>);
}