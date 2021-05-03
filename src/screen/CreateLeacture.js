import React,{useState} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox, Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Header from '../Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect } from 'react/cjs/react.development';
import CreateTestComponent from './CreateTestComponent';
import * as _ from 'lodash';
import moment from 'moment';
import {v4 as uuid} from "uuid";
import { Ionicons } from '@expo/vector-icons';

import Repository from '../utilities/pouchDB';
let db = new Repository();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CreateLeacture = (props) => {
    //console.log('props', props);
    const [selectedLectureTypeIndex, setSelectedLectureTypeIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedLectureStartIndex, setSelectedLectureStartIndex] = useState(0);
    const [selectedLectureEndIndex, setSelectedLectureEndIndex] = useState(0);
    const [selectedAttendenceByIndex, setSelectedAttendenceByIndex] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    
    const [successLectureCreateModal, setSuccessLectureCreateModal] = useState(false);

    const [questionList, setQuestionList] = useState([{}]);

    const [classDetails, setClassDetails] = useState(_.get(props, 'route.params.data'));

    const initialLectureObj = {
        _id:'lecture:'+uuid.v4(),
        lectureTitle:'',
        lectureDescription: '',
        lectureType:'VIDEO_UPLOAD', //SCREEN_SHARING LIVE_CAMERA
        videoLink:'',
        startTime: moment().toISOString(),
        endTime: moment().add(1, 'hour').toISOString(),
        attendanceBy: 'QUIZ', //STUDENT_PRESENT COMPLETED
        classID: _.get(props, 'route.params.data._id'),
        lectureDoubt:[],
        quizQuestions:[],
        isDeleted:false,
        created: new Date().toISOString(),
    }
    
    useEffect(() => {
        console.log('selectedLectureTypeIndex',selectedLectureTypeIndex);
    }, [selectedLectureTypeIndex])
    useEffect(()=>{
        //console.log('questionList');
        if(selectedAttendenceByIndex === 0){
            setLectureDetails({...lectureDetails, quizQuestions:questionList});
        }
        // let selectedTimeDate = selectedTime;
        // console.log('selectedTimeDate',selectedTimeDate);
        // let todayTimeStamp = new Date(selectedTimeDate.getFullYear, selectedTimeDate.getMonth, selectedTimeDate.getDate);
        // console.log('todayTimeStamp',todayTimeStamp);
        // let diffInTime = new Date(selectedTimeDate) - new Date(todayTimeStamp);
        // console.log('diffInTime', diffInTime);
        // setLectureDetails({...lectureDetails, startTime: new Date(new Date(selectedDate) + new Date(diffInTime).toISOString())})
    }, [questionList]);

    const [lectureDetails, setLectureDetails] = useState(initialLectureObj);


    // const lectureType = [
    //     { value:'VIDEO_UPLOAD', title:'Upload Video' }, 
    //     { value:'SCREEN_SHARING', title:'Screen Sharing' }, 
    //     { value:'LIVE_CAMERA', title:'Live Camera Session' }
    // ];

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="3" style={{flex: 1}}>
            <Header title="Create Leacture" 
            left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                props.navigation.goBack();
            }}/>}
            right={null}/>
            <ScrollView style={{flexGrow:1}}>
            <Layout level="1" style={{padding:10, margin:10, borderRadius:5}}>
                <Input
                    label='Lecture Title'
                    placeholder='Place your title here'
                    //caption='Should contain at least 3 characters'
                    style={{marginBottom:5}}
                    value={lectureDetails.lectureTitle}
                    //status='danger'
                    onChangeText={(lectureTitleText)=>{
                        setLectureDetails({...lectureDetails, lectureTitle:lectureTitleText})
                    }}
                    // captionIcon={AlertIcon}
                    />
                <Input
                    label='Lecture Description (optional)'
                    placeholder='Place your description here'
                    value={lectureDetails.lectureDescription}
                    multiline={true}
                    style={{marginBottom:5}}
                    onChangeText={(lectureDescriptionText)=>{
                        setLectureDetails({...lectureDetails, lectureDescription:lectureDescriptionText})
                    }}
                    />

                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture Type</Text>
                <RadioGroup
                    style={{marginBottom:5}}
                    selectedIndex={selectedLectureTypeIndex}
                    onChange={index => {
                        setSelectedLectureTypeIndex(index);
                        if(index === 0){
                            setLectureDetails({...lectureDetails, lectureType:'VIDEO_UPLOAD'});
                        } else if (index === 1){
                            setLectureDetails({...lectureDetails, lectureType:'SCREEN_SHARING'});
                        } else if (index === 2){
                            setLectureDetails({...lectureDetails, lectureType:'LIVE_CAMERA'});
                        }
                    }}>
                    <Radio>Upload Video Url</Radio>
                    <Radio disabled>Screen Sharing</Radio>
                    <Radio disabled>Live Camera Session</Radio>
                </RadioGroup>
                {selectedLectureTypeIndex === 0 ?
                    <Input
                        accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>{`Url`}</Text>}
                        value={lectureDetails.videoLink}
                        onChangeText={(o)=>{
                            setLectureDetails({...lectureDetails, videoLink:o});
                        }}
                        style={{marginBottom:5}}
                    /> : <></>}
                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture Start Time</Text>
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedLectureStartIndex}
                    onChange={index => {
                        if(index === 1){
                            setShowDatePicker(true);
                        } else if(index === 0){
                            setShowTimePicker(false);
                            setShowDatePicker(false);
                        }
                        setSelectedLectureStartIndex(index)
                    }}>
                    <Radio>Start Instatly</Radio>
                    <Radio>Select Date & Time</Radio>
                    <Text style={{fontStyle:'italic'}}>{`Schedule on: ${moment(lectureDetails.startTime).format('MMMM Do YYYY, h:mm a')}`}</Text>
                </RadioGroup>

                {showDatePicker && <>
                    <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Select Date & Time</Text>
                    <RangeCalendar
                        style={{marginBottom:5}}
                        value={new Date(selectedDate)}
                        onSelect={({startDate}) => {
                            setSelectedDate(new Date(startDate).getTime());
                            setShowTimePicker(true);
                            setShowDatePicker(false);
                        }}
                        />
                </>}

                {showTimePicker &&<>
                    <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Select Date & Time</Text>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={selectedTime}
                        mode={'time'}
                        display="default"
                        onChange={({nativeEvent})=>{
                            let dateNow = new Date();
                            let currentDayTimestamp = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()).getTime();
                            let pickerTime = new Date(nativeEvent.timestamp).getTime();
                            let diff = pickerTime - currentDayTimestamp;
                            let newTime = moment(selectedDate + diff);
                            setLectureDetails({...lectureDetails, startTime:newTime.toISOString(), endTime:newTime.add(1, 'hours').toISOString()});
                            setSelectedLectureEndIndex(0);
                            setShowTimePicker(false);
                        }}/>
                </>}

                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture End Time</Text>
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedLectureEndIndex}
                    onChange={index => {
                        if(index === 0){
                            let startTime = lectureDetails.startTime;
                            setLectureDetails({...lectureDetails, endTime:moment(startTime).add(1, 'hours').toISOString()});
                        }
                        setSelectedLectureEndIndex(index);
                    }}>
                    <Radio>1 hr</Radio>
                    <Radio>Custom</Radio>
                    <Text style={{fontStyle:'italic'}}>{`Schedule on: ${moment(lectureDetails.endTime).format('MMMM Do YYYY, h:mm a')}`}</Text>
                </RadioGroup>
                {selectedLectureEndIndex === 1 ?
                    <Input
                        keyboardType="number-pad"
                        accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>{`Hrs`}</Text>}
                        onChangeText={(o)=>{
                            let startTime = lectureDetails.startTime;
                            setLectureDetails({...lectureDetails, endTime:moment(startTime).add(o, 'hours').valueOf()});
                            //setLectureDetails({...lectureDetails, videoLink:o});
                        }}
                        style={{marginBottom:5}}
                    /> : <></>}


                <Text category="label" appearance='hint' style={{fontSize:12}}>Mark Attendence By</Text>    
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedAttendenceByIndex}
                    onChange={index => {
                        if(index === 0){
                            setLectureDetails({...lectureDetails, attendanceBy:'QUIZ'})
                        } else if (index === 1){
                            setLectureDetails({...lectureDetails, attendanceBy:'STUDENT_PRESENT'})
                        } else if (index === 2){
                            setLectureDetails({...lectureDetails, attendanceBy:'COMPLETED_ANYTIME'})
                        }
                        setSelectedAttendenceByIndex(index)
                    }}>
                    <Radio>Quiz</Radio>
                    <Radio disabled>Student present for lecture</Radio>
                    <Radio>Student completing the lecture (anytime)</Radio>
                </RadioGroup>   

            {selectedAttendenceByIndex===0 && <>
                <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Quiz Questions</Text>  
                <View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text category="s2"></Text>
                        <Text style={{textAlign:'right'}} category="s2">{`Total Marks: ${_.sumBy(questionList, o=> (o.marks) ? Number(o.marks) : 0)}\nTotal Questions: ${questionList.length}`}</Text>
                    </View>

                    {_.map(questionList, (question, index) => <Layout key={'questionList1'+index} level="1" title="Question 3" style={{marginTop:10, borderRadius:5}}>
                        <Input
                            placeholder='Enter your question here'
                            style={{marginBottom:5}}
                            value={_.get(question, 'question', '')}
                            onChangeText={(questionText) => {
                                setQuestionList(_.map(questionList, (o, indX) => {
                                    return (index === indX) ? {
                                        ...o,
                                        question: questionText
                                    } : o;
                                }))
                            }}
                            accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>{`Q${index+1}.`}</Text>}
                            accessoryRight={() => <Text status='info' disabled appearance="hint" style={{textDecorationLine:'underline'}}>Upload Image</Text>}
                            />
                        <Input onChangeText={num=>{
                            setQuestionList(_.map(questionList, (o, indX) => {
                                return (index === indX) ? {
                                    ...o,
                                    marks: num
                                } : o;
                            }))
                            }} keyboardType="numeric" style={{marginBottom:5}} value={question.marks} accessoryLeft={()=><Text appearance="hint">Marks</Text>}/>
                        <Select
                            accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>Answer Type.</Text>}
                            //placeholder='Text Field'
                            value={question.questionType}
                            style={{marginBottom:5}}
                            onSelect={({row})=>{
                                let questinTypeCode;
                                if(row === 0) questinTypeCode = 'RADIO_BUTTON' ;
                                if(row === 1) questinTypeCode = 'CHECKBOX';
                                if(row === 2) questinTypeCode = 'TEXT_INPUT';
                                if(row === 3) questinTypeCode = 'FILE_UPLOAD';
                                setQuestionList(_.map(questionList, (o, indX) => {
                                    if(index === indX && questinTypeCode === 'RADIO_BUTTON'){
                                        o.options = _.map(o.options, oxx => {
                                            return {
                                                ...oxx,
                                                isAnswer:false
                                            }
                                        })
                                    }   
                                    return (index === indX) ? {
                                        ...o,
                                        questionType: questinTypeCode,
                                        options: 
                                            questinTypeCode === 'RADIO_BUTTON' || questinTypeCode === 'CHECKBOX' 
                                            ? (_.get(question, 'options', []).length <= 0)
                                                ? [{}] 
                                                : question.options 
                                            : []
                                    } : o;
                                }));
                            }}
                            >
                            <SelectItem value="RADIO_BUTTON" title='Radio Button'/>
                            <SelectItem value="CHECKBOX" title='Checkbox'/>
                            <SelectItem value="TEXT_INPUT" title='Text Field'/>
                            <SelectItem value="FILE_UPLOAD" disabled={true} title='FileUpload'/>
                        </Select>
                        {_.get(question, 'questionType') === 'TEXT_INPUT' && <Input
                            placeholder='Type answer here'
                            onChangeText={(answerText)=>{
                                setQuestionList(_.map(questionList, (o, indX) => {
                                    return (index === indX) ? {
                                        ...o,
                                        answer: answerText
                                    } : o;
                                }));
                            }}
                            style={{marginBottom:5}}
                            accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>Ans.</Text>}
                            />}
                        {(question.questionType==='RADIO_BUTTON'||question.questionType==='CHECKBOX')&& _.map(_.get(question, 'options', []), (option, indX) => <Input
                            placeholder={'option '+(indX+1)}
                            style={{marginBottom:5}}
                            value={option.text}
                            onChangeText={(optionText)=>{
                                setQuestionList(_.map(questionList, (o, ind) => {
                                    return (ind === index) ? {
                                        ...o,
                                        options: _.map(o.options, (optX, optionIndex) => {
                                            return (indX === optionIndex) ? {
                                                ...optX,
                                                text: optionText
                                            } : optX
                                        })
                                    } : o;
                                }));
                            }}
                            accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>{`Option ${indX+1}.`}</Text>}
                            accessoryRight={() => <CheckBox onChange={(checkValue)=>{
                                setQuestionList(_.map(questionList, (o, ind) => {
                                    return (ind === index) ? {
                                        ...o,
                                        options: _.map(o.options, (optX, optionIndex) => {
                                            //RADIO_BUTTON
                                            if(question.questionType==='RADIO_BUTTON'){
                                                return (indX === optionIndex) ? {
                                                    ...optX,
                                                    isAnswer: true
                                                } : {
                                                    ...optX,
                                                    isAnswer: false
                                                }
                                            }else {
                                                return (indX === optionIndex) ? {
                                                    ...optX,
                                                    isAnswer: checkValue
                                                } : optX
                                            }
                                        })
                                    } : o;
                                }));
                            }} 
                            checked={option.isAnswer} />}
                            />)}
                            {(question.questionType==='RADIO_BUTTON'||question.questionType==='CHECKBOX')&&<Button appearance="ghost" onPress={()=>{
                                setQuestionList(_.map(questionList, (o, indX) => {
                                    return (index === indX) ? {
                                        ...o,
                                        options: [...o.options, {}]
                                    } : o;
                                }))
                            }}>Add Another Option</Button>}

                            <View style={{flexDirection:'row'}}>
                                <Button status='danger' onPress={()=>{
                                    let newQuestionList = [];
                                    _.map(questionList, (o, indX) => {
                                        if(indX !== index) newQuestionList.push(o);
                                    })
                                    if(newQuestionList.length <= 0){
                                        setQuestionList([{}]);
                                    }else {
                                        setQuestionList(newQuestionList);
                                    }
                                    
                                }} appearance="outline">Delete</Button>
                                <Button status='warning' style={{marginLeft:5}}onPress={()=>{
                                    let newQuestionList = [];
                                    _.map(questionList, (o, indX) => {
                                        if(indX !== index) newQuestionList.push(o);
                                        else newQuestionList.push({});
                                    })             
                                    setQuestionList([...newQuestionList]);                    
                                }} appearance="outline">Reset</Button>
                            </View>
                    </Layout>)}

                <Button appearance="ghost" onPress={()=>{
                    setQuestionList([...questionList, {options:[]}]);
                }}>Add Another Queston +</Button>

                </View>
            </>}

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={ async ()=>{
                    let obj = _.cloneDeep(lectureDetails);
                    if(obj.attendanceBy === "COMPLETED_ANYTIME"){
                        obj.quizQuestions = [];
                    }
                    await db.upsert(obj);
                    console.log('initialLectureObj',initialLectureObj);
                    setLectureDetails(initialLectureObj);
                    setSuccessLectureCreateModal(true);
                    setTimeout(() => {
                        setSuccessLectureCreateModal(false);
                        props.navigation.navigate("ClassHome", {data:{..._.get(props, 'route.params.data', {})}});
                    }, 3000);
                    }} style={styles.button} size='medium'> SUBMIT </Button>
            </View>

            <Modal
                visible={successLectureCreateModal}
                style={{flex:1}}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onBackdropPress={() => setSuccessClassCreateModal(false)}>
                <View style={{ width:windowWidth, height:windowHeight, position:'relative'}}>
                    <View style={{flexGrow:1}}></View>
                    <Layout level="1"  style={{justifyContent:'center', alignItems:"center", textAlign:'center', padding:30, position:'absolute', bottom:'-10%', width:'100%'}}>
                        <View style={{flexDirection:'column'}}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text category="h5">Lecture Successfully Created!</Text>
                            </View>
                        </View>
                    </Layout>
                </View>
            </Modal>

            </Layout>
        </ScrollView>
             
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

export default CreateLeacture;