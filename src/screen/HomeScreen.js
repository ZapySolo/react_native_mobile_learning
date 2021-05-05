import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Image} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import Repository from '../utilities/pouchDB';
import { useEffect } from 'react/cjs/react.development';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import moment from 'moment';
import { FontAwesome,Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

let db = new Repository();

const HomeScreen = (props) => {
    const [clientProfile, setClientProfile] = useState(null);

    const [lectureList, setlectureList] = useState([]);

    const getClientData = async () => {
        try{
            let result = JSON.parse(await AsyncStorage.getItem('@client_profile'))
            if(result){
                setClientProfile(result);
            }
        } catch(err){
            setClientProfile({});
            console.log('Asyncstorage Error, ',err);
        }
    }

    useEffect(()=>{
        getClientData();
    },[]);

    useEffect(()=>{
        if(clientProfile && clientProfile._id){
            getData(clientProfile._id);
        }
    }, [clientProfile]);

    const getData = async (userID) => {
        let listAsTeacher = await db.findMany({
            _id: {
                $regex: 'class'
            },
            teacherID: clientProfile._id
        });
        listAsTeacher = _.map(listAsTeacher, o => {return {...o, userType:'TEACHER'}});
        let listAsStudent = await db.findMany({
            _id: {
                $regex: 'class'
            },
            students: { $all: [clientProfile._id] }
        });
        listAsStudent = _.map(listAsStudent, o => {return {...o, userType:'STUDENT'}});
        let classList = _.uniqBy([...listAsTeacher,...listAsStudent], o => o._id);
        console.log('classList',classList);
        let data = [];
        for(let classx of classList){
            let res = await db.findMany({
                _id: {
                    $regex: 'lecture'
                },
                classID: classx._id
            });
            //console.log('red',res);
            for(let osx of res){
                data.push({
                    ...osx,
                    classProfileImage: classx.classProfileImage
                });
            }
        }
        data = _.sortBy(data, o => moment(o.startTime).valueOf());
        console.log('data',data);
        setlectureList(data);
    }

    const calculateTimeRemm = (time) => {
        var start_date = moment();
        var end_date = moment(time);
        var duration = moment.duration(end_date.diff(start_date)).asMinutes();

        if(duration <= 0){
            return 'ongoing';
        } else if (duration <= 60){
            return parseFloat(duration).toFixed(1) + " min"
        } else if (duration <= 60 * 60) {
            return parseFloat(duration /60).toFixed(1) + " hrs"
        } else if (duration <= 60 * 60 * 24) {
            return parseFloat(duration /60/24).toFixed(1) + " days"
        }
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="2" style={{flex: 1}}>
            <Header title="Home Screen" left={<FontAwesome onPress={()=>{props.navigation.openDrawer()}} name="bars" size={20} color="black" />}/>

            {lectureList.length > 0 ?<View style={{padding:10, paddingBottom:0}}>
                <Text category='s1'>Today</Text>
                <List
                    style={[styles.container, {padding:10, paddingLeft:0,paddingRight:0, flexGrow:1}]}
                    data={lectureList}
                    ItemSeparatorComponent={() => <View style={{marginBottom:10}} />}
                    renderItem={({ item, index }) => (
                        <ListItem
                            onPress={()=>{props.navigation.navigate('Lecture', {...item})}}
                            style={{ borderRadius:5}}
                            title={`${item.lectureTitle}`}
                            description={`${item.lectureDescription}`}
                            accessoryLeft={() => <Avatar size='medium' source={{uri:item.classProfileImage}}/>}
                            accessoryRight={() => <Text category="label" appearance="hint">{calculateTimeRemm(item.startTime)}</Text>}
                            />
                    )}
                />
            </View>: <>
                <View style={{width: '100%', alignItems:'center'}}>
                    <Image
                        style={{height:200, width: 200, marginTop:'50%', resizeMode:'center'}}
                        source={require('../../assets/blank.png')}
                    />  
                    <Text appearance="hint" style={{textAlign: 'center'}}>No Data Found</Text>
                </View>
            </>}
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