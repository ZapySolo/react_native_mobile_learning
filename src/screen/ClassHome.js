import React, {useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card,OverflowMenu,MenuItem, Input } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Modal, RefreshControl, ScrollView, LogBox,Image} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import Repository from '../utilities/pouchDB';
import * as _ from 'lodash';
import moment from 'moment';
import { FontAwesome,Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

let db = new Repository();

const imageLink = 'https://source.unsplash.com/200x200'; //https://source.unsplash.com/100x100/?face

const ClassHome = (props) => {
    const [userType, setUserType] = useState(''); //STUDENT TEACHER
    //const [overflowMenu, setOverflowMenu] = useState(false); 

    const [overflowMenu, setOverflowMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    
    const [classDetails, setClassDetails] = useState(_.get(props, 'route.params.data'));

    const [viewScore, setViewScore] = useState(null);

    const [lectures, setLectures] = useState([]);
    const [posts, setPosts] = useState([]);

    const [clientProfile, setClientProfile] = useState({});

    const handleDeleteClass = async () => {
        //<-- handle it here
    }

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(()=>{
        getClientData()
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    const getClientData = async () => {
        setClientProfile(JSON.parse(await AsyncStorage.getItem('@client_profile')));
    }

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve =>  {
            getData(classDetails._id);
            resolve()
        });
    }

    useEffect(() => {
        setClassDetails(_.get(props, 'route.params.data'));
        setUserType(_.get(props, 'route.params.data.userType'));
        if(_.get(props, 'route.params.data._id')){
            getData(_.get(props, 'route.params.data._id'));
        }
    }, [JSON.stringify(_.get(props, 'route.params.data', {}))])

    
    const getData =  async (classID) => {
        let filter = {
            _id: {
                $regex: 'lecture'
            },
            classID
        }
        let res = await db.findMany(filter);
        let upcommingLecture = _.filter(res, o => {
            return moment(o.endTime).valueOf() > moment().valueOf()
        });
        upcommingLecture = _.sortBy(upcommingLecture, o => moment(o.startTime).valueOf());
        setLectures(upcommingLecture);

        let postFilter = {
            _id: {
                $regex: 'post'
            },
            classID
        }
        let postRes = await db.findMany(postFilter);
        setPosts(postRes);
        console.log('postRes',postRes);
        // console.log('upcommingLecture', _.map(upcommingLecture, o => {
        //     return {
        //         ...o,
        //         startTime: moment(o.startTime).format('MMMM Do YYYY, h:mm a'),
        //         endTime: moment(o.endTime).format('MMMM Do YYYY, h:mm a')
        //     }
        // }));
        //console.log('upcommingLecture',upcommingLecture);
    }
    const headerRight = () => {
        return (userType === 'TEACHER') 
        ? 
            <OverflowMenu
                anchor={()=><Button onPress={()=>{setOverflowMenu(true)}} appearance="ghost"><Entypo name="dots-three-vertical" size={16} color="black" /></Button>}
                visible={overflowMenu}
                selectedIndex={selectedIndex}
                onSelect={(val)=>{
                    setOverflowMenu(false)
                    //setSelectedIndex(val);
                    if(val.row === 0){
                        props.navigation.navigate("Create Lecture", {data:{...classDetails}});
                    } else if (val.row === 1){
                        props.navigation.navigate("CreateTest", {data:{...classDetails}});
                    }
                }}
                onBackdropPress={() => setOverflowMenu(false)}
                >
                <MenuItem title='Create New Lecture'/>
                <MenuItem title='Create New Test'/>
                <MenuItem disabled title='Delete Class'/>
                <MenuItem disabled title='Stats'/>
                <MenuItem disabled title='About'/>
            </OverflowMenu> 
        : <OverflowMenu
            anchor={()=><Button onPress={()=>{setOverflowMenu(true)}} appearance="ghost"><Entypo name="dots-three-vertical" size={16} color="black" /></Button>}
            visible={overflowMenu}
            selectedIndex={selectedIndex}
            onSelect={(val)=>{
                setOverflowMenu(false)
                // if(val.row === 0){
                //     props.navigation.navigate("Create Lecture", {data:{...classDetails}});
                // } else if (val.row === 1){
                //     props.navigation.navigate("CreateTest", {data:{...classDetails}});
                // }
            }}
            onBackdropPress={() => setOverflowMenu(false)}
            >
            <MenuItem disabled title='Attendence'/>
            <MenuItem disabled title='Lecture'/>
            <MenuItem disabled title='Exam'/>
            <MenuItem disabled title='About'/>
        </OverflowMenu> ;
    }

    const calculateTimeRemm = (time) => {
        var start_date = moment();
        var end_date = moment(time);
        var duration = moment.duration(end_date.diff(start_date)).asMinutes();

        if(duration <= 0){
            return 'ongoing';
        } else if (duration <= 60){
            return parseInt(duration) + " min"
        } else if (duration <= 60 * 60) {
            return parseInt(duration/60) + " hrs"
        } else if (duration <= 60 * 60 * 24) {
            return parseInt(duration/60/24) + " days"
        }
    }

    const calculateTimePassed = (time) => {
        var currentDate = moment();
        var creationDate = moment(time);
        var duration = moment.duration(currentDate.diff(creationDate)).asMinutes();
        if(duration <= 5){
            return 'now';
        } else if (duration <= 60){
            return parseInt(duration) + " min"
        } else if (duration <= 60 * 60) {
            return parseInt(duration/60) + " hrs"
        } else if (duration <=60 * 60 * 24) {
            return parseInt(duration/60/24) + " days"
        }
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        
        <Layout level="2" style={{flex: 1}}>
            <Header title={_.get(classDetails, 'classTitle', 'Classroom')} right={headerRight()} left={<FontAwesome onPress={()=>{props.navigation.openDrawer()}} name="bars" size={20} color="black" />}/>
            
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
            <View>
                <Image
                    style={{height:150, width: '100%', resizeMode:'cover'}}
                    source={{uri:_.get(classDetails, 'classCoverImage', 'https://source.unsplash.com/300x200/?technology')}}
                />
            </View>
            <View style={{padding: 10, flexDirection: 'row'}}>
                <View style={{width:'85%'}}>
                    <Input 
                        accessoryRight={()=><MaterialIcons onPress={()=>{
                            console.log("pressed!");
                        }} name="add-a-photo" size={24} color="black" />}
                        multiline placeholder="Create new post">
                    </Input>
                </View>        
                <View style={{width:'13%', marginLeft:10}}>
                    <Button size="small" style={{paddingLeft:10}} accessoryLeft={()=><MaterialIcons name="post-add" size={20} color="#fff" />}></Button>
                </View>        
            </View>
            {/* <View style={{width: '90%', maxWidth:'90%', padding:10, flexDirection: 'row', backgroundColor:'red'}}>
                <Input
                    style={{flexGrow:1}}
                    accessoryRight={()=><MaterialIcons name="add-a-photo" size={24} color="black" />}
                    placeholder="Create new post" />    
            </View>                
            <Button style={{paddingLeft:10}}><MaterialIcons name="post-add" size={24} color="#fff" /></Button> */}

            <View>
                {lectures.length > 0 ?<>
                    <View style={{padding:10}}>
                        <Text category='s1'>Today</Text>
                    </View>
                    <List
                        style={{padding:10, paddingBottom:0}}
                        data={lectures}
                        ItemSeparatorComponent={() => <View style={{marginBottom:10}} />}
                        renderItem={({ item, index }) => (
                            <ListItem
                                onPress={()=>{props.navigation.navigate('Lecture', {...item,userType})}}
                                style={{ borderRadius:5}}
                                title={`${item.lectureTitle}`}
                                description={`${item.lectureDescription}`}
                                accessoryLeft={() => <Avatar size='medium' source={{uri:classDetails.classProfileImage}}/>}
                                accessoryRight={() => <Text category="label" appearance="hint">{calculateTimeRemm(item.startTime)}</Text>}
                                />
                        )}
                        />
                </>: <View style={{padding:10}}>
                        <Text category='s1'>No Lectures Today</Text>
                    </View>}
                
                <View style={{padding:10}}>
                    <Text category='s1'>POSTS</Text>
                </View>
                <View style={{flexGrow:1}}>
                    <List
                        //style={{height:510}}
                        contentContainerStyle={styles.contentContainer}
                        data={posts}
                        renderItem={({item}) => (
                            <Card
                                style={styles.item}
                                status={userType === 'TEACHER'? '': _.find(item.quizResponse, o => o.studentID === clientProfile._id) ? 'success' : 'primary'}
                                header={headerProps => 
                                    <View {...headerProps} style={{flexDirection:'row'}}>
                                        <View style={{padding:10, paddingRight:0}}>
                                            <Avatar size='tiny' source={{uri:imageLink}}/>
                                        </View>
                                        <View style={{flexGrow:1,padding:10, justifyContent:'center'}}>
                                            <Text category='s1'> {item.postTitle} </Text>
                                        </View>
                                        <View style={{padding:10, paddingRight:10, justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                                            <Text category='label' style={{marginRight:5}}>{calculateTimePassed(item.created)}</Text>
                                            {userType === 'TEACHER' && <Feather name="edit" size={12} color="black" />}
                                        </View>
                                    </View>}
                                footer={userType !== 'TEACHER' ? () =>
                                    <View style={{flexDirection:'row'}}>
                                        <Button 
                                            appearance="ghost" 
                                            disabled={_.find(item.quizResponse, o => o.studentID === clientProfile._id) ? false : true} style={{flex:1}}
                                            onPress={()=>{setViewScore(prev => prev === item._id ? null : item._id)}}
                                            >View Score</Button>
                                        <Button  style={{flex:1}} disabled={_.find(item.quizResponse, o => o.studentID === clientProfile._id) ? true : false}  appearance="ghost" onPress={()=>{
                                            if(item.type === 'QUIZ'){
                                                props.navigation.navigate("Test", {data:item})
                                            }
                                        }}>Quiz</Button>
                                    </View> : null}
                                disabled={item.type !== 'QUIZ'}
                                >
                                    <>
                                        <Text>
                                            {item.postDescription}
                                        </Text>
                                        {viewScore === item._id && <Text>
                                            {`You have scored ${_.find(item.quizResponse, o => o.studentID === clientProfile._id).score}`}
                                        </Text>}
                                    </>
                               
                            </Card>
                        )}
                        />
                </View>
            </View>
            </ScrollView>
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