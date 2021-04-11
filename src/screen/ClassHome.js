import React, {useState} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card,OverflowMenu,MenuItem } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Modal} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';

import * as _ from 'lodash';
const data = [
    { title: 'MIS', description: 'ongoing' },
    { title: 'DIS', description: '2 hrs' },
    { title: 'AUT', description: '4 hrs' },
    { title: 'BII', description: '6 hrs' }
];

const postData = [
    { title: 'Gore M', duration: '1 hrs', type:'POST', description:'Lecture has been conducted'},
    { title: 'PK Swan', duration: '2 hrs', type:'TEST', description:'Give Test'},
    { title: 'Austin', duration: '4 hrs', type:'CREATE_TEST', description:'Create Test'},
    { title: 'Austin', duration: '4 hrs', type:'CREATE_LECTURE', description:'Create Lecture'},
];

const imageLink = 'https://source.unsplash.com/200x200'; //https://source.unsplash.com/100x100/?face

const ClassHome = (props) => {
    const [userType, setUserType] = useState('TEACHER'); //STUDENT TEACHER
    //const [overflowMenu, setOverflowMenu] = useState(false); 

    const [overflowMenu, setOverflowMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const renderItemAccessory = (props) => (
        <Button size='tiny'>FOLLOW</Button>
    );

    const headerRight = () => {
        return (userType === 'TEACHER') 
        ? 
            <OverflowMenu
                anchor={()=><Button onPress={()=>{setOverflowMenu(true)}} appearance="ghost">:</Button>}
                visible={overflowMenu}
                selectedIndex={selectedIndex}
                onSelect={(val)=>{
                    setOverflowMenu(false)
                    //setSelectedIndex(val);
                    if(val.row === 0){
                        props.navigation.navigate("Create Lecture");
                    } else if (val.row === 1){
                        props.navigation.navigate("CreateTest");
                    }
                }}
                onBackdropPress={() => setOverflowMenu(false)}
                >
                <MenuItem title='Create New Lecture'/>
                <MenuItem title='Create New Test'/>
                <MenuItem disabled title='About'/>
            </OverflowMenu> 
        : <></>
    }
    
     const renderItemHeader = (headerProps, info) => (
        <View {...headerProps} style={{flexDirection:'row'}}>
        <View style={{padding:10, paddingRight:0}}>
            <Avatar size='tiny' source={{uri:imageLink}}/>
        </View>
        <View style={{flexGrow:1,padding:10, justifyContent:'center'}}>
            <Text category='s1'> {info.item.title} </Text>
        </View>
        <View style={{padding:10, paddingRight:10, justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
            <Text category='label' style={{marginRight:5}}>{info.item.duration}</Text>
            <Text category='label'>Edit</Text>
        </View>
    </View>
    );

     const renderItemFooter = (footerProps) => (
        <View {...footerProps} style={{flexDirection:'row'}}>
            <View style={{flex:1, justifyContentL:'center', alignItems:'center', padding:10}}><Text>View</Text></View>
            <View style={{flex:1, justifyContentL:'center', alignItems:'center', padding:10, borderLeftWidth:1}}><Text>Quiz</Text></View>
        </View>
    );

    const calculateTimeRemm = (time) => {
        
        let currentTime = Date.now();
        let calculateTime = new Date(time).getTime();

        let diff = calculateTime - currentTime;
        if(diff <= 0){
            return 'ongoing';
        } else if(diff <= 60*1000){
            return parseInt(diff/(1000)) + ' min';
        } else if(diff <= 24*60*1000){
            return parseInt(diff/(60*1000)) + ' days'; 
        } else {
            return '--'
        }
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="2" style={{flex: 1}}>
            <Header title={_.get(props, 'route.params.title', 'Classroom')} right={headerRight()} left={<Text onPress={()=>{props.navigation.openDrawer()}}>Drawer</Text>}/>
            <View style={{padding:10}}>
                <Text category='s1'>Today</Text>
            </View>
            <List
                style={{padding:10, paddingBottom:0}}
                data={dummyData.leactures}
                ItemSeparatorComponent={() => <View style={{marginBottom:10}} />}
                renderItem={({ item, index }) => (
                    <ListItem
                        onPress={()=>{props.navigation.navigate('Lecture', {...item})}}
                        style={{ borderRadius:5}}
                        title={`${item.classTitle}`}
                        description={`${item.lectureDescription}`}
                        accessoryLeft={() => <Avatar size='medium' source={{uri:imageLink}}/>}
                        accessoryRight={() => <Text category="label" appearance="hint">{calculateTimeRemm(item.startTime)}</Text>}
                        />
                )}
                />
            <View style={{padding:10}}>
                <Text category='s1'>POSTS</Text>
            </View>
            <View style={{flexGrow:1}}>
                <List
                    //style={{height:510}}
                    contentContainerStyle={styles.contentContainer}
                    data={postData}
                    renderItem={(info) => (
                        <Card
                            style={styles.item}
                            //status='basic'
                            header={headerProps => renderItemHeader(headerProps, info)}
                            footer={(info.item.type === 'QUIZ') ? renderItemFooter : null}
                            disabled={info.item.type === 'POST'}
                            onPress={()=>{
                                if(info.item.type === 'TEST'){
                                    props.navigation.navigate("Test")
                                } else if (info.item.type === 'CREATE_TEST'){
                                    props.navigation.navigate("Test")
                                } else if (info.item.type === 'CREATE_LECTURE'){
                                    props.navigation.navigate("Create Lecture")
                                }
                            }}
                            >
                            <Text>
                                {info.item.description}
                            </Text>
                        </Card>
                    )}
                    />
            </View>
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

export default ClassHome;