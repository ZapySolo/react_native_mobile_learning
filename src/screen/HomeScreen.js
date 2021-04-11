import React from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import Repository from '../utilities/pouchDB';
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
    const renderItemAccessory = (props) => (
        <Button size='tiny'>FOLLOW</Button>
    );

     const renderItemHeader = (headerProps, info) => (
        <View {...headerProps} style={{flexDirection:'row'}}>
        <View style={{padding:10, paddingRight:0}}>
            <Avatar size='tiny' source={{uri:imageLink+2+1}}/>
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
        let currentTime = new Date().getTime();
        let calculateTime = new Date(time).getTime();

        let diff = calculateTime - currentTime;
        console.log(`${calculateTime} - ${currentTime}`,diff);

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
            {/* <View style={{padding:10, paddingBottom:0}}>
                <Text category='s1'>POSTS</Text>
            </View>
            <View>
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
            </View> */}
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