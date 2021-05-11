import React,{useState, useRef} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, BackHandler, Image} from 'react-native';
import Header from '../Header';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as _ from 'lodash';
// import YouTube from 'react-native-youtube';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import YoutubePlayer from "react-native-youtube-iframe";
import { SvgXml } from "react-native-svg";  
import moment from 'moment';
import Repository from '../utilities/pouchDB';
import { DNS } from 'react-native-uuid';
import { useEffect } from 'react';

import CountDown from 'react-native-countdown-component';

let db = new Repository();

const imageLink = 'https://source.unsplash.com/200x200';

const Leacture = (props) => {
    const [doubtText, setDoubtText] = useState('');
    //const [data, setData] = useState(props.route.params.item);
    const [doubtList, setDoubtList] = useState([]);
    const [doubtButtonState, setDoubtButtonState] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [youtubePlaying, setYoutubePlaying] = React.useState(true);

    const [lectureStarted, setLectureStarted] = React.useState(false);
    const [secUntillLectureStart, setSecUntillLectureStart] = React.useState(null);
    
    const [lectureDetails, setlectureDetails] = React.useState({}); 
    const [clientProfile, setClientProfile] = useState({});
    const getClientData = async () => {
        setClientProfile(JSON.parse(await AsyncStorage.getItem('@client_profile')));
    }
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
        //
        getClientData();
        fetchLectureDetails(_.get(props, 'route.params._id'));
        console.log({
            startTime: moment(_.get(props, 'route.params.startTime')).valueOf(),
            now:  moment().valueOf(),
            started: moment(_.get(props, 'route.params.startTime')).valueOf() < moment().valueOf()
        })
        if(moment(_.get(props, 'route.params.startTime')).valueOf() < moment().valueOf()){
            setLectureStarted(true);
        } else {
            setLectureStarted(false);
            setSecUntillLectureStart(moment(_.get(props, 'route.params.startTime')).diff(moment(), 'seconds'));
        }
        //
        });
        return unsubscribe;
    }, [props.navigation, _.get(props, 'route.params')]);

    // React.useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", setYoutubePlaying(false));
    //     return () =>
    //       BackHandler.removeEventListener("hardwareBackPress", setYoutubePlaying(false));
    // }, []);

    useEffect(()=>{
        console.log("_.get(props, 'route.params')",_.get(props, 'route.params'));
        if(_.get(props, 'route.params.userType') !== 'TEACHER'){
            setDoubtButtonState(true);
        }
    },[])

    const fetchLectureDetails = async (lectureID) => {
        if(lectureID){
            let res = await db.findByID(lectureID);
            if(res){
                setlectureDetails(res);
                let data = [];
                for (let o of _.get(res, 'lectureDoubt', [])){
                    if(o.userID === clientProfile._id){
                        data.push({
                            ...o,
                            title: 'You'
                        });
                    } else {
                        let otherUserProfile = await db.findByID(o.userID);
                        data.push({
                            ...o,
                            title: _.get(otherUserProfile, 'username', '')
                        });
                    }
                }
                console.log('created doubt ',data);
                setDoubtList(data);
            }
        }
    }

    const renderItem = ({ item, index }) => (
        <ListItem
            style={{width:'100%'}}
            title={()=><View style={{paddingRight:10,paddingLeft:10, alignItems:(item.title==='You')?'flex-end':'flex-start'}}><Text>{item.title}</Text></View>}
            description={()=><View style={{paddingRight:10,paddingLeft:10, alignItems:(item.title==='You')?'flex-end':'flex-start'}}><Text category='label'>{item.description}</Text></View>}
            accessoryRight={() => (item.title==='You')?<Avatar size='medium' source={{uri:imageLink}}/>:<></>}
            accessoryLeft={() => (item.title!=='You')?<Avatar size='medium' source={{uri:imageLink}}/>:<></>}
        />
    );
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='4' style={{flex: 1}}>
            <Header 
                title={ _.get(props, 'route.params.lectureTitle', 'Lecture')} 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    setYoutubePlaying(false);
                    props.navigation.goBack();
                }}/>}
                right={null}/>

            {lectureStarted ? <>
                <View style={{width:'100%', backgroundColor:'black'}}>
                    {/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(lectureDetails.videoLink)? <YoutubePlayer
                        height={220}
                        play={youtubePlaying}
                        videoId={lectureDetails.videoLink.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]}
                        onChangeState={e => {
                            console.log(e);
                        }}
                    /> : <Video
                    ref={video}
                    style={{height:200}}
                    source={{
                        uri: lectureDetails.videoLink,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />}
                    
                </View>

                <View style={{paddingLeft:10, marginTop: 10}}>
                    <Text category="s1" >Students Doubt</Text>
                </View>
                <View style={{flexGrow:1, marginTop:10}}>
                    <List
                        style={[styles.container, {padding:10}]}
                        data={doubtList}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <Divider />}
                        />
                </View>
                <Layout level="1" style={{padding:10, flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Input
                        style={{flexGrow:1, paddingLeft:20}}
                        //accessoryLeft={()=><Text>Left</Text>}
                        placeholder='Type your doubt here'
                        //accessoryRight={()=><Text>Send</Text>}
                        value={doubtText}
                        onChangeText={nextValue => setDoubtText(nextValue)}
                        />
                    <Text onPress={async ()=>{
                        if(doubtText !== ''){
                            let newDoubtlist = [...doubtList, {title:'You', description:doubtText, userID: clientProfile._id}]
                            setDoubtList(newDoubtlist);
                            setDoubtText('');

                            let res = await db.findByID(lectureDetails._id);
                            console.log('findByID',res);
                            if(res){
                                res.lectureDoubt = _.map(newDoubtlist, o => {
                                    return {
                                        description: o.description,
                                        userID: o.userID
                                    }
                                });
                                await db.upsert(res);
                            }
                        }
                    }} style={{padding:10}}>Send</Text>
                </Layout>
            </>:<>
                <Image
                    style={{ width: '100%', resizeMode:'center', height: '50%', marginTop:'40%'}}
                    source={require('../../assets/lecture_not_started.png')}
                />
                <Text appearance="hint" style={{textAlign:'center'}}>Lecture not started yet</Text>
                {secUntillLectureStart && <CountDown
                    until={secUntillLectureStart}
                    onFinish={() => {
                        alert('Lecture Started!')
                        setLectureStarted(true);
                    }}
                    //onPress={() => {alert('hello')}}
                    size={20}
                    style={{marginTop: 20}}
                    digitTxtStyle={{color: '#fff'}}
                    digitStyle={{backgroundColor: '#536DFE'}}
                />}
            </>}
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    //maxHeight: 238,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Leacture;