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
import { EvilIcons } from '@expo/vector-icons';

let s3 = new S3();
let db = new Repository();

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

const DataList = (props) => {
    const [dataListType, setDataListType] = useState('ASSIGNMENT');
    const [classID, setClassID] = useState('');
    const [list, setList] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        console.log('DataList props.route.params',props.route.params);
    }, []);

    useEffect(() => {
        if(props.route.params.dataType){
            setDataListType(props.route.params.dataType);
        }
    }, [props.route.params.dataType]);

    useEffect(() => {
        findLectures(dataListType);
        setList([]);
    }, [dataListType]);

    const findLectures = async (type) => {
        let classID = props.route.params.data._id;
        let userType = props.route.params.userType;
        if(type === 'ASSIGNMENT') {
            let assignmentResult = await db.findMany({
                _id: {
                    $regex: 'assignment'
                },
                classID,
                isDeleted: false
            });
            console.log('assignmentResult',assignmentResult);
            assignmentResult = assignmentResult.map(o => {
                return {
                    _id: o._id,
                    title: o.title,
                    description: o.description,
                    created: o.created,
                    navigateScreenName: 'AssignExptScreen',
                    nagigationProps: {
                        data: {...o} ,
                        userType,
                        actionType: 'ASSIGNMENT',
                        className: _.get(props, 'route.params.data.classTitle', '--'),
                    }
                }
            });
            setList(assignmentResult);
        } else if (type === 'EXPERIMENT') {
            let experimentResult = await db.findMany({
                _id: {
                    $regex: 'experiment'
                },
                classID,
                isDeleted: false
            });
            console.log('experimentResult',experimentResult);
            experimentResult = experimentResult.map(o => {
                return {
                    _id: o._id,
                    title: o.title,
                    description: o.description,
                    created: o.created,
                    navigateScreenName: 'AssignExptScreen',
                    nagigationProps: {
                        data: {...o} ,
                        userType,
                        actionType: 'EXPERIMENT',
                        className: _.get(props, 'route.params.data.classTitle', '--'),
                    }
                }
            });
            setList(experimentResult);
            
        } else if (type === 'TEST') {
            let testResult = await db.findMany({
                _id: {
                    $regex: 'test'
                },
                classID,
                isDeleted: false
            });
            console.log('testResult',testResult);
            testResult = testResult.map(o => {
                return {
                    _id: o._id,
                    title: o.postTitle,
                    description: o.postDescription,
                    created: o.created,
                    navigateScreenName: 'Test',
                    nagigationProps: {
                        data: {...o}
                    }
                }
            });
            setList(testResult);
        } else if (type === 'EXAM') {
            let examResult = await db.findMany({
                _id: {
                    $regex: 'exam'
                },
                classID,
                isDeleted: false
            });
            console.log('examResult',examResult);
            examResult = examResult.map(o => {
                return {
                    _id: o._id,
                    title: o.postTitle,
                    description: o.postDescription,
                    created: o.created,
                    //navigateTo: 'Assignment'
                }
            });
            setList(examResult);
        } else if (type === 'LECTURE') {
            let lectureResult = await db.findMany({
                _id: {
                    $regex: 'lecture'
                },
                classID,
                isDeleted: false
            });
            lectureResult = lectureResult.map(o => {
                return {
                    _id: o._id,
                    title: o.lectureTitle,
                    description: o.lectureDescription,
                    created: o.created,
                    navigateScreenName: 'Lecture',
                    nagigationProps: {
                        ...o,
                        userType
                    }
                }
            });
            setList(lectureResult);
            console.log('lectureResult',lectureResult);
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
                    <Text category="s1" style={{marginBottom: 5}}>Data List</Text>
                    <Input value={searchInput} onChangeText={o => setSearchInput(o)} accessoryLeft={() => <EvilIcons name="search" size={18} color="grey" />} placeholder="Search here" style={{borderRadius: 100, marginBottom: 0}} />
                    
                    {list.map(o => {
                        if(new RegExp(searchInput, 'i').test(o.title) || new RegExp(searchInput, 'i').test(o.description))
                            return (<ListItem 
                                key={o._id}
                                title={o.title}
                                onPress={() => {
                                    if(o.navigateScreenName && o.nagigationProps){
                                        props.navigation.navigate(o.navigateScreenName, {...o.nagigationProps});
                                    }
                                }}
                                style={{ borderRadius:5, borderWidth:1, borderColor: '#e9eef4', marginTop:5}}
                                description={o.description} 
                                accessoryRight={() => <Text category="label" appearance="hint">{calculateTimePassed(o.created)}</Text>}
                            />);
                        } 
                    )}
                </Layout>
            </ScrollView>
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    //flexGrow:1
    //maxHeight: 238,
  }
});

export default DataList;