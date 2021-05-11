import React, {useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card,OverflowMenu,MenuItem, Input,RadioGroup, Radio ,RangeCalendar} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Modal, RefreshControl, ScrollView, LogBox,Image} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import * as _ from 'lodash';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {v4 as uuid} from "uuid";
import SuccessModal from './SuccessModal';
import Repository from '../utilities/pouchDB';
import S3 from '../utilities/aws/s3';

let s3 = new S3();
let db = new Repository();

const CreateAssignExp = (props) => {
    const [title, setTitle] = useState('--');
    const [attachmentList, setAttachmentList] = useState([]);//input
    const [newAttachmentName, setNewAttachmentName] = useState('');//input

    const [actionType, setActionType] = useState('CREATE');//input

    const [successModalVisibility, setSuccessModalVisibility] = useState(false);//input

    const [showCalendar, setShowCalendar] = useState(false);

    const [post, setPost] = useState({
        title: '',
        description: '',
        markAttendance: false,
        submissionDate: false,
        response: [],

        created: new Date().toISOString(),
        isDeleted: false
    });

    useEffect(() => {
        console.log(`_.get(props, 'route.params.actionType')`,_.get(props, 'route.params.actionType'));
        if(_.get(props, 'route.params.actionType') === 'CREATE_EXPERIMENT'){
            setTitle('experiment');
            setActionType('CREATE')
        } else if (_.get(props, 'route.params.actionType') === 'CREATE_ASSIGNMENT'){
            setTitle('assignment');
            setActionType('CREATE');
        } else if (_.get(props, 'route.params.actionType') === 'EDIT_EXPERIMENT'){
            setTitle('experiment');
            setActionType('EDIT');
        } else if (_.get(props, 'route.params.actionType') === 'EDIT_ASSIGNMENT'){
            setTitle('assignment');
            setActionType('EDIT');
        }
    }, [_.get(props, 'route.params.actionType')]);

    const handleOnSubmitPost = async () => {
        let newPost = {...post};
        if(!_.has(newPost, '_id')){
            newPost._id = title+':'+uuid.v4();
        }
        newPost.classID = _.get(props, 'route.params.classID');

        let result = await db.upsert(newPost);
        if(result){
            console.log('result',result);
            setPost({
                title: '',
                description: '',
                markAttendance: false,
                submissionDate: false,
                response: [],
        
                created: new Date().toISOString(),
                isDeleted: false
            });
            setSuccessModalVisibility(true);
            setTimeout(() => {
                setSuccessModalVisibility(false);
                setTimeout(() => {
                    props.navigation.goBack();
                }, 100);
            }, 2000);
        } else {
            console.log('upset failed!');
        }
    }
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="4" style={{flex: 1}}>
            <Header title={_.get(props, 'route.params.data.classTitle', '--')} left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                props.navigation.goBack();
            }}/>}/>
            <ScrollView>
                <Layout level="1" style={{margin: 10, borderRadius: 8, padding: 10}}>
                    <Text category="s1">{actionType === 'CREATE' ? 'Create' : 'Edit'} {title.charAt(0).toUpperCase() + title.slice(1)}</Text>
                    <Input value={post.title} onChangeText={o => setPost(prev => {return {...prev, title: o}})} style={{marginTop: 10}} label="Title"/>
                    <Input multiline value={post.description} onChangeText={o => setPost(prev => {return {...prev, description: o}})} style={{marginTop: 5}} label="Description"/>
                    {attachmentList.map((o, index) => <View key={'attachmentList'+index} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                        <Card disabled style={{flexGrow: 1}} ><Text>{o.name}</Text></Card>
                        <Button onPress={() => {
                            setAttachmentList(prev => [..._.filter(prev, ox => ox._id !== o._id)]);
                        }} appearance="ghost"><AntDesign name="delete" size={24} color="red" /></Button>
                    </View>)}
                    <Text category="label" appearance='hint' style={{fontSize:12, marginTop: 5}}>Mark Attendence By Completion</Text>
                    <RadioGroup
                        style={{marginBottom:5}}
                        selectedIndex={post.markAttendance ? 0 : 1}
                        onChange={index => {
                            if(index === 0){
                                setPost(prev => {return {
                                    ...prev,
                                    markAttendance: true
                                }})
                            } else if (index === 1){
                                setPost(prev => {return {
                                    ...prev,
                                    markAttendance: false
                                }})
                            }
                        }}>
                        <Radio >Yes</Radio>
                        <Radio >No</Radio>
                    </RadioGroup>

                    <Text category="label" appearance='hint' style={{fontSize:12, marginTop: 5}}>Submission Last Date</Text>
                    <RadioGroup
                        style={{marginBottom:5}}
                        selectedIndex={post.submissionDate ? 0 : 1}
                        onChange={index => {
                            if(index === 0){
                                setShowCalendar(true);
                            } else if (index === 1){
                                setPost(prev => {return {
                                    ...prev,
                                    submissionDate: false
                                }})
                                setShowCalendar(false);
                            }
                        }}>
                        <Radio >Yes</Radio>
                        <Radio >No</Radio>
                    </RadioGroup>
                        {showCalendar && <RangeCalendar
                            style={{marginBottom:5}}
                            //value={new Date(selectedDate)}
                            onSelect={({startDate}) => {
                                setPost(prev => {return {
                                    ...prev,
                                    submissionDate: startDate
                                }})
                               console.log(startDate);
                               setShowCalendar(false);
                            }}
                            />
                        }
                    <Button onPress={()=>{handleOnSubmitPost()}} style={{marginTop: 10, marginBottom: 5}}>Submit</Button>
                </Layout>
            </ScrollView>
        </Layout>
        <SuccessModal text={title + ' successfully created!'} visibility={successModalVisibility} />
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

export default CreateAssignExp;