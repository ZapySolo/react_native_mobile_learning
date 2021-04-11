import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select,Toggle} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import Header from '../Header';

const Settings = (props) => {
    const [changeName, setSelectedIndex] = useState(0);

    const [notificationState, setNotificationState] = useState(false);

    const onCheckedChange = (isChecked) => {
        setNotificationState(isChecked);
    }

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

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='2' style={{flex: 1}}>
            <Header title="Settings" left={<Text onPress={()=>{props.navigation.navigate("Home")}}>{'< '}Back</Text>} right={null}/>
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
                accessoryRight={() => <Input onBlur={()=>{showToast('Name Changed Successfully!')}} >Amit Goswami</Input>}
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