import React,{useState, useRef} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, BackHandler} from 'react-native';
import Header from '../Header';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as _ from 'lodash';
// import YouTube from 'react-native-youtube';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import YoutubePlayer from "react-native-youtube-iframe";

import Repository from '../utilities/pouchDB';
import { DNS } from 'react-native-uuid';
import { useEffect } from 'react';
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
    
    const [lectureDetails, setlectureDetails] = React.useState({}); 
    const [clientProfile, setClientProfile] = useState({});
    const getClientData = async () => {
        setClientProfile(JSON.parse(await AsyncStorage.getItem('@client_profile')));
    }
    React.useEffect(() => {
        getClientData();
        fetchLectureDetails(_.get(props, 'route.params._id'))
    }, [JSON.stringify(_.get(props, 'route.params'))]);

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
        <Layout level='3' style={{flex: 1}}>
            <Header 
                title={ _.get(props, 'route.params.lectureDescription', 'Lecture')} 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    setYoutubePlaying(false);
                    props.navigation.goBack();
                }}/>}
                right={null}/>
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

           {_.get(props, 'route.params.userType') !== 'TEACHER' && <View style={{justifyContent:'center', alignItems:'center'}}>
                <View>
                    <Button onPress={()=>{setDoubtButtonState(!doubtButtonState)}} style={{margin:10, marginBottom: 0}} status='primary'accessoryLeft={()=><Text>H</Text>}>
                        Raise Doubt
                    </Button>
                </View>
            </View>}
            <View style={{paddingLeft:10, marginTop: 10}}>
                <Text category="s1" >Other Students Doubt</Text>
            </View>
            <View style={{flexGrow:1, marginTop:10}}>
                <List
                    style={[styles.container, {padding:10}]}
                    data={doubtList}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <Divider />}
                    />
            </View>
            {doubtButtonState && (
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
            )}
            
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