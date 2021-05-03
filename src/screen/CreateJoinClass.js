import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, Dimensions, Clipboard, ToastAndroid, Keyboard, Share} from 'react-native';
import Header from '../Header';
import {v4 as uuid} from "uuid";
import AsyncStorage from '@react-native-community/async-storage';
import Repository from '../utilities/pouchDB';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
let db = new Repository();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CreateJoinClass = (props) => {
    const [clientProfile, setClientProfile] = useState({});

    const [newClassTitle, setNewClassTitle] = useState('');
    const [newClassSubTitle, setNewClassSubTitle] = useState('');
    const [newClassDescription, setNewClassDescription] = useState('');
    const [newClassValidationObj, setNewClassValidationObj] = useState({
        newClassTitle: false,
        newClassSubTitle: false,
        newClassDescription: false
    });
    const [successClassCreateModal, setSuccessClassCreateModal] = useState(false);
    const [classCode, setClassCode] = useState(false);
    const [joinNewClass, setJoinNewClass] = useState('');
    const [joinNewClassError, setJoinNewClassError] = useState(false);

    useEffect(()=>{
        getClientData();
    },[]);

    const getClientData = async () => {
        try{
            setClientProfile(JSON.parse(await AsyncStorage.getItem('@client_profile')));
        } catch(err){
            setClientProfile({});
            console.log('Asyncstorage Error, ',err);
        }
    }
    const handleCreateClass = async () => {
        let validationResult = await validateNewClassDetails();
        if(validationResult){
            Keyboard.dismiss();
            let classUUID = uuid.v4();
            let classCodex = classUUID.toString().substring(0, 5);
            const obj = {
                _id:'class:'+ classUUID,
                teacherID: clientProfile._id,
                students: [],
                classTitle: newClassTitle,
                classSubTitle: newClassSubTitle,
                classDescription: newClassDescription,
                classJoinCode: classCodex,
                isDeleted: false,
                classProfileImage: 'https://source.unsplash.com/200x200/?'+_.replace(newClassTitle, / /g, "")
            };
            console.log('class created!: ',obj);
            let res = await db.upsert(obj);
            if(res){
                setClassCode(classCodex);
                setSuccessClassCreateModal(true);
            }
        }
    }

    const handleJoinNewClass = async () => {
        //Keyboard.dismiss();
        let res = await db.findMany({
            _id: {
                $regex: 'class'
            },
            classJoinCode: joinNewClass
        });
        if(res.length > 0){
            let classx = _.cloneDeep(res[0]);
            if(classx.teacherID !== clientProfile._id && !_.includes(classx.students, clientProfile._id)){
                classx.students.push(clientProfile._id);
                console.log('joinNewClass: ', classx);
                let upsrtRes = await db.upsert(classx);
                if(upsrtRes) {
                    ToastAndroid.showWithGravityAndOffset(
                        "Successfully added to Class",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25, 50
                    );
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Error while adding",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25, 50
                    );
                }
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    "You already joined the class",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25, 50
                );
            }
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Class does not exist!",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25, 50
            );
        }
    }

    const validateNewClassDetails = async () => {
        let newClassTitleError = !(typeof newClassTitle === 'string' && newClassTitle.length >= 2);
        let newClassSubTitleError = !(typeof newClassSubTitle === 'string' && newClassSubTitle.length >= 2);
        let newClassDescriptionError = !(typeof newClassDescription === 'string' && newClassDescription.length >= 2);
        setNewClassValidationObj({
            newClassTitle: newClassTitleError,
            newClassSubTitle: newClassSubTitleError,
            newClassDescription: newClassDescriptionError
        });
        return !newClassTitleError && !newClassSubTitleError && !newClassDescriptionError;
    }
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="4" style={{flex: 1}}>
            <Header 
                title="Create/Join Class" 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    props.navigation.goBack();
                }}/>}
                right={null}/>
            <View style={{flexGrow:1, margin:10}}>
                <Layout level="1" style={{padding:10, paddingBottom:20, borderRadius:5}}>
                    <View>
                        <Text category="h6">Create New Classroom</Text>
                    </View>
                    <View style={{marginTop:10}}>
                        <Input
                            label='Class Title'
                            placeholder=''
                            value={newClassTitle}
                            onChangeText={o=>{setNewClassTitle(o)}}
                            status={newClassValidationObj.newClassTitle ? 'danger' : 'basic'}
                            caption={newClassValidationObj.newClassTitle ? 'Should contain at least 2 characters' : ''}
                            style={{marginBottom:5}}
                            // status='danger'
                            />
                    </View>

                    <View style={{marginTop:10}}>
                        <Input
                            label='Class Sub Title'
                            placeholder=''
                            value={newClassSubTitle}
                            onChangeText={o=>{setNewClassSubTitle(o)}}
                            caption='Should contain at least 2 characters'
                            style={{marginBottom:5}}
                            status={newClassValidationObj.newClassSubTitle ? 'danger' : 'basic'}
                            caption={newClassValidationObj.newClassSubTitle ? 'Should contain at least 2 characters' : ''}
                            // status='danger'
                            />
                    </View>

                    <View style={{marginTop:10}}>
                        <Input
                            label='Class Description'
                            placeholder=''
                            value={newClassDescription}
                            onChangeText={o=>{setNewClassDescription(o)}}
                            caption='Should contain at least 2 characters'
                            style={{marginBottom:5}}
                            status={newClassValidationObj.newClassDescription ? 'danger' : 'basic'}
                            caption={newClassValidationObj.newClassDescription ? 'Should contain at least 2 characters' : ''}
                            // status='danger'
                            />
                    </View>
                    <View style={{marginTop:10}}>
                        <Button onPress={()=>handleCreateClass()} >Create Class</Button>
                    </View>
                </Layout>
            </View>
            
            <Layout level="1" style={{margin:10, marginTop:0, padding:10, borderRadius:5}}>
                <View>
                    <Text category="h6">Join Classroom</Text>
                </View>
                <View style={{marginTop:10, flexDirection:'row', alignItems:'flex-end'}}>
                    <Input
                        label='Class Code'
                        placeholder=''
                        size="large"
                        value={joinNewClass}
                        onChangeText={o=>setJoinNewClass(o)}
                        style={{marginBottom:5, flexGrow:1, marginRight:5}}
                        status={joinNewClassError ? 'danger' : 'basic'}
                        caption={joinNewClassError ? 'Should contain only 5 characters' : ''}
                        />
                    <Button 
                        accessoryLeft={()=><MaterialIcons name="add-link" size={22} color="white" />}
                        onPress={()=>{
                        setJoinNewClassError(false);
                        if(typeof joinNewClass === 'string' && joinNewClass.length !== 5){
                            setJoinNewClassError(true);
                        } else {
                            handleJoinNewClass();
                            setJoinNewClassError(false);
                        }
                    }} style={{ marginBottom:9}}></Button>
                </View>
            </Layout>
            <Modal
                visible={successClassCreateModal}
                style={{flex:1}}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onBackdropPress={() => setSuccessClassCreateModal(false)}>
                <View style={{ width:windowWidth, height:windowHeight, position:'relative'}}>
                    <View style={{flexGrow:1}}></View>
                    <Layout level="1"  style={{justifyContent:'center', alignItems:"center", textAlign:'center', padding:30, position:'absolute', bottom:'-10%', width:'100%'}}>
                        <View style={{flexDirection:'column'}}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text category="h5">Class Successfully Created!</Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                <Text category="h1" style={{padding:40, textAlign:'center'}}></Text>
                                <Text category="h1" style={{padding:40, textAlign:'center'}}>{classCode}</Text>
                                <Text onPress={async ()=>{
                                    Clipboard.setString(classCode);
                                    ToastAndroid.showWithGravityAndOffset(
                                        "Copied to clipboard",
                                        ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM,
                                        25, 50
                                    );
                                    const result = await Share.share({
                                        message:
                                          `Hey, \nUse this code to join my class: ${classCode}\nClass Title: ${newClassTitle}\nApplication Name: ONLINEClass`,
                                    });
                                    setSuccessClassCreateModal(false);
                                    setNewClassTitle('');
                                    setNewClassSubTitle('');
                                    setNewClassDescription('');
                                }} category="s1" style={{padding:40, textAlign:'center'}}>Copy Code</Text>
                            </View>
                        </View>
                    </Layout>
                </View>
            </Modal>
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

export default CreateJoinClass;