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
import { Ionicons } from '@expo/vector-icons';

let db = new Repository();

const imageLink = 'https://source.unsplash.com/200x200'; //https://source.unsplash.com/100x100/?face

const ClassDetails = (props) => {
    const [userType, setUserType] = useState(''); //STUDENT TEACHER
 
    const [classDetails, setClassDetails] = useState(_.get(props, 'route.params.data'));

    const [clientProfile, setClientProfile] = useState({});

    const [refreshing, setRefreshing] = React.useState(false);

    const [teacherProfile, setTeacherProfile] = React.useState(null);
    const [studentsProfile, setStudentsProfile] = React.useState(null);
    const [assignmentList, setAssignmentList] = React.useState(null);
    const [experimentList, setExperimentList] = React.useState(null);
    const [tests, setTests] = React.useState(null);

    useEffect(()=>{
        getClientData()
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
        console.log('getData called!')
        let classLectures = await db.findMany({
            _id: {
                $regex: 'lecture'
            },
            classID,
            isDeleted: false
        });
        console.log('classLectures',classLectures);
        let classDetails = await db.findByID(classID);
        console.log('classDetails',classDetails);
        let teacherDetails = await db.findByID(classDetails.teacherID);
        setTeacherProfile(teacherDetails);
        console.log('teacherDetails',teacherDetails);
        
        let studentsList = classDetails.students;
        
        let classLecturesX = [];
        for(let lec of classLectures) {
            let attencancex = [];
            for(let att of studentsList){
                if(_.find(lec.attendance, {studentID: att.studentID})){
                    //already marked as present
                    attencancex.push({
                        studentID: att.studentID,
                        present: true
                    });
                } else {
                    attencancex.push({
                        studentID: att.studentID,
                        present: false
                    });
                }
            }
            classLecturesX.push({
                ...lec,
                attendance: attencancex
            });
        }

        let studentDetails = [];
        for(let std of studentsList) {
            let res = await db.findByID(std.studentID);
            let lecLength = classLecturesX.length;
            let lecAttended = 0;
            for(let lec of classLecturesX) {
                if(_.find(lec.attendance, {studentID: res._id, present: true})){
                    lecAttended += 1;
                }
            }
            let percentage = (lecAttended / lecLength) * 100;
            studentDetails.push({
                ...res,
                percentage
            });
        }
        setStudentsProfile(studentDetails);
        console.log('studentDetails',studentDetails);
        console.log('classLecturesX',classLecturesX);

        let classexp = await db.findMany({
            _id: {
                $regex: 'experiment'
            },
            classID,
            isDeleted: false
        });
        setExperimentList(classexp);

        let classassgn = await db.findMany({
            _id: {
                $regex: 'assignment'
            },
            classID,
            isDeleted: false
        });
        setAssignmentList(classassgn);

        let classTest = await db.findMany({
            _id: {
                $regex: 'test'
            },
            classID,
            isDeleted: false
        });
        setTests(classTest);
    }


    return (
    <SafeAreaView style={{ flex: 1 }}>
        
        <Layout level="2" style={{flex: 1}}>
            <Header title={_.get(classDetails, 'classTitle', 'Classroom')} left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    props.navigation.goBack();
                }}/>}/>
            
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
            <View style={{padding: 10}}>
                <Text style={{marginBottom:5}} category="s1">Stats</Text>
                <ListItem title={`Total Students: ${studentsProfile && studentsProfile.length}`} disabled />
                <ListItem style={{marginTop:10}} title={`Total Assignment: ${assignmentList && assignmentList.length}`} disabled />
                <ListItem style={{marginTop:10}} title={`Total Experiments: ${experimentList && experimentList.length}`} disabled />
                <ListItem style={{marginTop:10}} title={`Total Tests: ${tests && tests.length}`} disabled />
            </View>
            <View style={{padding: 10}}>
                <Text style={{marginBottom:5}} category="s1">Teacher</Text>
                {teacherProfile && <ListItem
                    title={`${teacherProfile.username}`}
                    disabled
                    accessoryLeft={() => <Avatar size='medium' source={{uri:teacherProfile.profileImageUrl}}/>}
                />}
            </View>
            <View style={{padding: 10}}>
                <Text style={{marginBottom:5}} category="s1">Students ({studentsProfile && studentsProfile.length})</Text>
                { studentsProfile && _.map(studentsProfile, o => <ListItem
                    key={o._id}
                    disabled
                    style={{marginBottom :5}}
                    title={`${o.username}`}
                    accessoryLeft={() => <Avatar size='medium' source={{uri:o.profileImageUrl}}/>}
                    accessoryRight={() => <Text category="label" appearance="hint">{o.percentage+'%'}</Text>}/>)}
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

export default ClassDetails;