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

import Repository from '../utilities/pouchDB';
import S3 from '../utilities/aws/s3';

let s3 = new S3();
let db = new Repository();

const CreatePost = (props) => {
    const [actionType, setActionType] = useState('CREATE_POST');//input
    const [attachmentList, setAttachmentList] = useState([]);//input
    const [newAttachmentName, setNewAttachmentName] = useState('');//input
    const [newAttachmentTitle, setNewAttachmentTitle] = useState('');//input
    const [newAttachmentSubTitle, setNewAttachmentSubTitle] = useState('');//input

    const [post, setPost] = useState({
        _id: 'post:'+uuid.v4(),
        title: '',
        description: '',
        attachments: [],
        created: new Date().toISOString(),
        isDeleted: false,
    });

    const handleOnSubmitPost = async () => {
        let newPost = {...post};
        newPost.attachments = attachmentList;
        newPost.classID = _.get(props, 'route.params.classID');
        console.log('newPost',newPost);
        let result = await db.upsert(newPost);
        if(result){
            console.log('post successfully created!',result);
            setPost({
                _id: 'post:'+uuid.v4(),
                title: '',
                description: '',
                attachments: [],
                created: new Date().toISOString(),
                isDeleted: false,
            });
            setAttachmentList([]);
        } else {
            console.log('upset failed!');
        }
    }

    const onFileUpload = async () => {
        if(!newAttachmentName) return;
        let fileUploadResult = await s3.fileUpload();
        if(fileUploadResult){
            let newFileUri = fileUploadResult.postResponse.location;
            let newAttachment = {
                _id: uuid.v4(), 
                name: newAttachmentName, 
                uri: newFileUri
            }
            setAttachmentList(prev => [...prev, newAttachment]);
            setNewAttachmentName('');
        } else {
            alert('file upload fail');
        }
    }

    // useEffect(() => {
    //     if(_.get(props, 'route.params.data.actionType') === 'EDIT_POST'){
            
    //     }
    // }, [_.get(props, 'route.params.data.actionType')]);
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="4" style={{flex: 1}}>
            <Header title={_.get(props, 'route.params.data.classTitle', '--')} left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                props.navigation.goBack();
            }}/>}/>
            <ScrollView>
                <Layout level="1" style={{margin: 10, borderRadius: 8, padding: 10}}>
                    <Text category="s1">Create Post</Text>
                    <Input value={post.title} onChangeText={o => setPost(prev => {return {...prev, title: o}})} style={{marginTop: 10}} label="Post Title"/>
                    <Input multiline value={post.description} onChangeText={o => setPost(prev => {return {...prev, description: o}})} style={{marginTop: 5}} label="Post Description"/>
                    {attachmentList.map((o, index) => <View key={'attachmentList'+index} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                        <Card disabled style={{flexGrow: 1}} ><Text>{o.name}</Text></Card>
                        <Button onPress={() => {
                            setAttachmentList(prev => [..._.filter(prev, ox => ox._id !== o._id)]);
                        }} appearance="ghost"><AntDesign name="delete" size={24} color="red" /></Button>
                    </View>)}
                    <Input
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
                        />
                    <Button onPress={()=>{handleOnSubmitPost()}} style={{marginTop: 10, marginBottom: 5}}>Submit</Button>
                </Layout>
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

export default CreatePost;