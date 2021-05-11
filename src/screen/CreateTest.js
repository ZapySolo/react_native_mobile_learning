import React,{useState, useEffect} from 'react';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Dimensions } from 'react-native';
import * as _ from 'lodash';
import { xor } from 'lodash';
import {v4 as uuid} from "uuid";
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import Repository from '../utilities/pouchDB';

let db = new Repository();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CreateTest = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [testTimeRem, setTestTimeRem] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

    const [selectedLectureStartIndex, setSelectedLectureStartIndex] = useState(0);
    const [selectedLectureEndIndex, setSelectedLectureEndIndex] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    const [questionList, setQuestionList] = useState([{_id:'question:'+uuid.v4()}]);

    const [postObj, setPostObj] = useState({
        _id:'test:'+uuid.v4(),
        title: '',
        description: '',
        type: 'QUIZ',
        quizStartTime: new Date().toISOString(),
        quizEndTime: new Date().toISOString(),
        quizResponse: [],
        classID: _.get(props, 'route.params.data._id'),
        quizQuestions:[],
        isDeleted: false,
        created: new Date().toISOString()
    });

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            //
            setPostObj(prev => {
                return {
                    ...prev,
                    postTitle: '',
                    postDescription: 'New Test has been Assigned',
                    _id:'test:'+uuid.v4(),
                    quizStartTime: new Date().toISOString(),
                    quizEndTime: new Date().toISOString(),
                    created: new Date().toISOString()
                }
            });
            setQuestionList([{_id:'question:'+uuid.v4()}]);
            //
        });
        return unsubscribe;
    }, [props.navigation]);

    useEffect(()=>{
        if(questionList.length <= 0){
            setQuestionList([{_id:'question:'+uuid.v4()}]);
        }
    },[questionList]);

    const submitTest = async () => {
        try{
            let obj = {...postObj};
            obj.quizQuestions = questionList;
            if(selectedLectureStartIndex === 0){
                delete obj.quizEndTime;
            }
            return await db.upsert(obj);
        } catch (err){
            console.log('error occurd while submitting test', err);
            return null;
        }
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='4' style={{flex: 1}}>
            <Header 
                title="Create Test" 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    props.navigation.goBack();
                }}/>}
            />
            <ScrollView style={{flexGrow:1}}>

            <View style={{padding:10}}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text category="s2">Test Details</Text>
                    <Text category="s2">{` `}</Text>
                </View>
                <Layout level="1" title="Question 3" style={{marginTop:10, padding:10, borderRadius:5}}>
                    <Input
                        label="Test Title"
                        placeholder='Test Title here'
                        value={postObj.postTitle}
                        style={{marginBottom:5}}
                        onChangeText={(title) => {
                            setPostObj(prev => {
                                return {
                                    ...prev,
                                    postTitle: title
                                }
                            })
                        }}
                    />
                    <Input
                        label="Test Description"
                        placeholder='New Test has been Assigned'
                        value={postObj.postDescription}
                        style={{marginBottom:5}}
                        onChangeText={(title) => {
                            setPostObj(prev => {
                                return {
                                    ...prev,
                                    postDescription: title
                                }
                            })
                        }}
                    />
                     <Text category="label" appearance='hint'>Test End Time</Text>
                    <RadioGroup
                        //style={{marginBottom:5}}
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
                        <Radio>No</Radio>
                        <Radio>Select Date & Time</Radio>
                    </RadioGroup>
                    {selectedLectureStartIndex === 1 && <Text style={{fontStyle:'italic'}}>{`Ends on: ${moment(postObj.quizEndTime).format('MMMM Do YYYY, h:mm a')}`}</Text>}

                    {showDatePicker && <>
                        <RangeCalendar
                            style={{marginBottom:5}}
                            value={new Date(selectedDate)}
                            onSelect={({startDate}) => {
                                console.log('startDate', startDate);
                                setSelectedDate(new Date(startDate).getTime());
                                setShowTimePicker(true);
                                setShowDatePicker(false);
                            }}
                            />
                    </>}

                    {showTimePicker &&<>
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
                                setPostObj({...postObj, quizStartTime:newTime.toISOString(), quizEndTime:newTime.toISOString()});
                                setSelectedLectureEndIndex(0);
                                setShowTimePicker(false);
                            }}/>
                    </>}
                </Layout>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
                    <Text category="s2">Test Questions</Text>
                    <Text category="s2">{`No of questions: ${questionList.length}`}</Text>
                </View>

                {_.map(questionList, (question, index) => <Layout key={'questionList1'+index} level="1" title="Question 3" style={{marginTop:10, padding:10, borderRadius:5}}>
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
                                return (index === indX) ? {
                                    ...o,
                                    questionType: questinTypeCode,
                                    options: 
                                        questinTypeCode === 'RADIO_BUTTON' || questinTypeCode === 'CHECKBOX' 
                                        ? (_.get(question, 'options', []).length <= 0)
                                            ? [{_id:'option:'+uuid.v4()}]
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
                        key={question.questionType+'_'+indX+'_'+index}
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
                                    options: [...o.options, {_id:'option:'+uuid.v4()}]
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
                                    setQuestionList([{_id:'question:'+uuid.v4()}]);
                                }else {
                                    setQuestionList(newQuestionList);
                                }
                                
                            }} appearance="outline">Delete</Button>
                            <Button status='warning' style={{marginLeft:5}}onPress={()=>{
                                let newQuestionList = [];
                                _.map(questionList, (o, indX) => {
                                    if(indX !== index) newQuestionList.push(o);
                                    else newQuestionList.push({_id:'question:'+uuid.v4()});
                                })             
                                setQuestionList([...newQuestionList]);                    
                            }} appearance="outline">Reset</Button>
                        </View>
                </Layout>)}

            <Button appearance="ghost" onPress={()=>{
                setQuestionList([...questionList, {_id:'question:'+uuid.v4(), options:[]}]);
            }}>Add Another Queston +</Button>

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={async ()=>{
                    //console.log(questionList);
                    let result  = await submitTest();
                    if(result){
                        setSubmitSuccessModal(true);
                        setPostObj({
                            _id:'test:'+uuid.v4(),
                            postTitle: '',
                            postDescription: 'New Test has been Assigned',
                            type: 'QUIZ',
                            quizStartTime: new Date().toISOString(),
                            quizEndTime: new Date().toISOString(),
                            classID: _.get(props, 'route.params.data._id'),
                            quizQuestions:[],
                            isDeleted:false,
                            created: new Date().toISOString()
                        });
                        setQuestionList([{_id:'question:'+uuid.v4()}]);
                        setTimeout(()=>{
                            setSubmitSuccessModal(false);
                        },3000);
                    }
                }} disabled={false} style={styles.button} size='medium'> SUBMIT </Button>
            </View>

        </View>

            <Modal
                visible={submitSuccessModal}
                style={{flex:1}}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onBackdropPress={() => setSubmitSuccessModal(false)}>

                <View style={{ width:windowWidth, height:windowHeight, position:'relative'}}>
                    <View style={{flexGrow:1}}></View>
                    <Layout level="1"  style={{justifyContent:'center', alignItems:"center", textAlign:'center', padding:30, position:'absolute', bottom:'-10%', width:'100%'}}>
                        <View>
                            <Text category="h1" style={{padding:40, textAlign:'center'}}>Tick</Text>
                            <Text category="h5">Test Successfully Created!</Text>      
                        </View>
                    </Layout>
                </View>
            </Modal>
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

export default CreateTest;