import React, {useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card,OverflowMenu,MenuItem, Input } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Modal, RefreshControl, ScrollView, LogBox,Image} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import * as _ from 'lodash';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {v4 as uuid} from "uuid";
import AsyncStorage from '@react-native-community/async-storage';
import { Entypo } from '@expo/vector-icons';
import Repository from '../utilities/pouchDB';
import S3 from '../utilities/aws/s3';
import { set } from 'lodash';
import { Feather } from '@expo/vector-icons';
let s3 = new S3();
let db = new Repository();

const AssignExptScreen = (props) => {
    const [actionType, setActionType] = useState('ASSIGNMENT');//EXPERIMENT
    const [userType, setUserType] = useState('STUDENT');//input
    const [newAttachmentName, setNewAttachmentName] = useState('');//input
    const [responseList, setResponseList] = useState([]);//input

    const [post, setPost] = useState({
        _id: 'post:'+uuid.v4(),
        title: '',
        description: '',
        response: [],
        created: new Date().toISOString(),
        isDeleted: false,
    });

    useEffect(() => {
        if(props.route.params.userType){
            if(props.route.params.userType === 'TEACHER'){
                setResponseList([]);
                getResponseList(props.route.params.data.classID)
            }
            setUserType(props.route.params.userType);
        }
        if(props.route.params.actionType){
            setActionType(props.route.params.actionType);
        }
        setPost(props.route.params.data);
    }, [props.route.params.userType, props.route.params.data._id, props.route.params.actionType]);

    const getResponseList = async (classID) => {
        console.log('getResponseList', classID);
        let classDetails = await db.findByID(classID);
        console.log('getResponseList', classDetails);
        let classStudents = classDetails.students.map(o => o.studentID);
        let responseListx = [];

        if(actionType === 'ASSIGNMENT'){
            let assignmentDetails = await db.findByID(props.route.params.data._id);
            for(let studentIDx of classStudents){
                let studentProfile = await db.findByID(studentIDx);
                let findResult = _.find(assignmentDetails.response, e => e.studentID === studentIDx);
                if (findResult) {
                    responseListx.push ({
                        studentID: studentIDx,
                        studentName: studentProfile.username,
                        submitted: true,
                        fileUri: findResult.uri,
                        submittedOn: findResult.created,
                        markedCompleted: findResult.markedCompleted
                    });
                } else {
                    responseListx.push( {
                        studentID: studentIDx,
                        studentName: studentProfile.username,
                        submitted: false
                    });
                }
            }
        } else if(actionType === 'EXPERIMENT'){
            let experimentDetails = await db.findByID(props.route.params.data._id);
            for(let studentIDx of classStudents) {
                let studentProfile = await db.findByID(studentIDx);
                let findResult = _.find(experimentDetails.response, e => e.studentID === studentIDx);
                if (findResult) {
                    responseListx.push ({
                        studentID: studentIDx,
                        studentName: studentProfile.username,
                        submitted: true,
                        fileUri: findResult.uri,
                        submittedOn: findResult.created,
                        markedCompleted: findResult.markedCompleted
                    });
                } else {
                    responseListx.push( {
                        studentID: studentIDx,
                        studentName: studentProfile.username,
                        submitted: false
                    });
                }
            }
        }
        
       
        console.log('responseListx',responseListx);
        setResponseList(responseListx);
    }

    const onFileUpload = async () => {
        let clientID = JSON.parse(await AsyncStorage.getItem('@client_profile'))._id;
        if(!newAttachmentName) return;
        let fileUploadResult = await s3.fileUpload();
        if(fileUploadResult){
            let newFileUri = fileUploadResult.postResponse.location;
            let newResponse = {
                _id: uuid.v4(), 
                name: newAttachmentName, 
                uri: newFileUri,
                studentID: clientID,
                created: new Date().toISOString(),
                markedCompleted: false
            }
            let assignmentResult = await db.findByID(post._id);
            console.log('assignmentResult',assignmentResult);
            let response  = _.filter(assignmentResult.response, o => o.studentID !== clientID);
            response = [...response, newResponse];
            assignmentResult.response = response;
            await db.upsert(assignmentResult);
            setPost(assignmentResult);
            console.log('assignmentResult after',assignmentResult);
        } else {
            alert('file upload fail');
        }
    }
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="4" style={{flex: 1}}>
            <Header title={_.get(props, 'route.params.className', '--')} left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                props.navigation.goBack();
            }}/>}/>
            <ScrollView>
                <Layout level="1" style={{margin: 10, borderRadius: 8, padding: 10}}>
                    <Text category="s1">{userType === 'STUDENT' ? 'Submit': ''} {(actionType.toLowerCase()).charAt(0).toUpperCase() + (actionType.toLowerCase()).slice(1)}</Text>
                    <Input disabled value={post.title} style={{marginTop: 10}} label={`${(actionType.toLowerCase()).charAt(0).toUpperCase() + (actionType.toLowerCase()).slice(1)} Title`}/>
                    <Input disabled multiline value={post.description} style={{marginTop: 5}} label={`${(actionType.toLowerCase()).charAt(0).toUpperCase() + (actionType.toLowerCase()).slice(1)} Description`}/>
                    {userType === 'STUDENT' && <Input
                        placeholder="Rollno-Firstname-Lastname"
                        value={newAttachmentName}
                        onChangeText={o => {setNewAttachmentName(o)}}
                        style={{marginTop: 10}} 
                        label="Add Attachment"
                        accessoryRight={()=><AntDesign 
                            onPress={()=>{
                                onFileUpload();
                            }}
                            name="cloudupload" 
                            size={24} 
                            color="black" />}
                        />}
                </Layout>

                {userType === 'TEACHER' && <Layout level="1" style={{margin: 10, borderRadius: 8, padding: 10}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text category="s1">Responses</Text>
                        <Text appearance="hint" category="label">Remaining: {responseList.length - _.filter(responseList, o => o.submitted).length}</Text>
                    </View>
                    {responseList.map(o => (<ListItem 
                        key={'responseList'+o.studentID}
                        title={o.studentName}
                        style={{ borderRadius:5, borderWidth:1, borderColor: '#e9eef4', marginTop:5}}
                        description={o.submitted ? 'Submitted on ' + o.submittedOn : 'Not Submitted'}
                        accessoryLeft={() => <Avatar size='medium' source={{uri: 'https://source.unsplash.com/200x200/?boy'}}/>}
                        accessoryRight={o.submitted ? () => <View style={{flexDirection: 'row'}}>
                            <Button appearance="ghost"><Entypo name="eye" size={16} color="black" /></Button>
                            <Button appearance="ghost"><Feather name="check-circle" size={16} color={o.markedCompleted ? "green" : "black"} /></Button>
                        </View>: null}
                    />))}
                </Layout>}
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
  card: {
    flex: 1,
    margin: 2
  }
});

export default AssignExptScreen;