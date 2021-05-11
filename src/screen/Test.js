import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Dimensions } from 'react-native';
import * as _ from 'lodash';
import { map } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import Repository from '../utilities/pouchDB';

let db = new Repository();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Test = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [testTimeRem, setTestTimeRem] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

    const [answers, setAnswers] = useState([]);

    const [selectedRadioIndex, setSelectedRadioIndex] = useState([]);
    const [selectedCheckIndex, setSelectedCheckIndex] = useState({});

    const [quetions, setquetions] = useState([]);

    const [score, setScore] = useState(0);

    const [postDetails, setPostDetails] = useState();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            //
            setScore(0);
            setAnswers([]);
            //setquetions([]);
            console.log('Test Component Mounted!');
            //
        });
        return unsubscribe;
    }, [props.navigation]);

    useEffect(()=>{
        setPostDetails(_.get(props, 'route.params.data'));
        console.log("_.get(props, 'route.params.data')",_.get(props, 'route.params.data'));
        setquetions(_.get(props, 'route.params.data.quizQuestions'));
    },[_.get(props, 'route.params.data')]);

    const onPressModalConfirm = async () => {
        setConfirmModal(false);
        setSubmitSuccessModal(true);
        let result = await db.findByID(postDetails._id);
        let clientID = JSON.parse(await AsyncStorage.getItem('@client_profile'))._id;
        let quizResponse = {
            studentID: clientID,
            response: answers,
            score: score
        }
        console.log('result',result);
        if(_.get(result, 'quizResponse', []).length <= 0){
            result.quizResponse = [quizResponse]
        } else {
            if(!_.find(result.quizResponse, o => o.studentID === clientID)){
                result.quizResponse = [...result.quizResponse, quizResponse];
            } else {
                alert('You have already responded!\nYour response will not be saved');
                console.log('You have already responded!');
                return;
            }
        }
        await db.upsert(result);
    }

    const checkAnswers = () => {
        console.log('answers',answers);
        let score = 0;
        for(let ques of quetions){
            let ans = _.find(answers, o => o.questionID === ques._id);
            if(ans){
                if(ques.questionType === 'CHECKBOX'){

                    let flag = true;
                    let arr = [];
                    for (let i of ques.options){
                        if(i.isAnswer === true){
                            arr.push(i._id);
                        }
                    }
                    if(!_.isEqual(arr.sort(), ans.answers.sort())) flag = false;
                    if(flag) score = score + Number(ques.marks);

                } else if (ques.questionType === 'RADIO_BUTTON'){
                    let flag = true;
                    let res = _.find(ques.options, o => o._id === ans.answers.optionID);
                    if(res.isAnswer === false) flag = false;
                    if(flag) score = score + Number(ques.marks);
                } else if(ques.questionType === 'TEXT_INPUT'){
                    let flag = true;
                    if(!(new RegExp(ques.answer, 'i').test(ans.answerText))) flag = false;
                    if(flag) score = score + Number(ques.marks);
                }
            } else {
                //user did not attenpted
            }
        }
        setScore(score);
    }
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='4' style={{flex: 1}}>
            <Header 
                title="BDA Test: Module 1" 
                right={<View style={{alignItems:'center'}}><Text category="label" appearance="hint">Time</Text><Text>{testTimeRem}</Text></View>} 
                left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                    props.navigation.goBack();
                }}/>}
                />
            <ScrollView style={{flexGrow:1}}>

            <View style={{padding:10}}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text category="s2">Test Questions</Text>
                    <Text category="s2">No of questions: 20</Text>
                </View>

                {_,map(quetions, (value, index) => {
                    if(value.questionType === 'RADIO_BUTTON'){
                        return (<Layout level="1" title="Question 1" style={{marginTop:10, padding:10, borderRadius:5}}>
                        <Text category="s1" style={{marginBottom:5}}>{`Q${index+1}. ${value.question}`}</Text>
                        <RadioGroup
                            selectedIndex={selectedRadioIndex[index]}
                            onChange={radioChange => {
                                let optionID = _.find(value.options, (valX, indx) => Number(radioChange) === indx)._id;
                                let obj = {
                                    questionID: value._id,
                                    type:'RADIO_BUTTON',
                                    answers:{
                                        optionID: optionID
                                    }
                                };
                                let ans = _.filter(answers, (o) => o.questionID !== value._id);
                                ans.push(obj);
                                setAnswers(ans);
                                let radioIndxArr = [...selectedRadioIndex];
                                radioIndxArr[index] = radioChange;
                                setSelectedRadioIndex(radioIndxArr);
                            }}>
                                {_.map(value.options, (radioVal, index) => <Radio key={'radioVal.text'+index}>{radioVal.text}</Radio>)}
                        </RadioGroup>
                    </Layout>);
                    } else if(value.questionType === 'CHECKBOX') {
                        return (<Layout level="1" title="Question 2" style={{marginTop:10, padding:10, borderRadius:5}}>
                        <Text category="s1" style={{marginBottom:5}}>{`Q${index+1}. ${value.question}`}</Text>
                        <Text category="s1" style={{marginBottom:5}} status='info'>Open File</Text>
                        {_.map(value.options, (o, indX) => <CheckBox key={'CheckBox'+indX+index} style={{marginBottom:10, marginTop:5}}
                            checked={selectedCheckIndex[value._id+indX]}
                            onChange={nextChecked => {
                                if(nextChecked === true){
                                    let optionID = _.find(value.options, (valX, indxx) => Number(indX) === indxx)._id;
                                    let ans = _.find(answers, (o) => o.questionID === value._id);
                                    if(ans){
                                        ans.answers.push(optionID);
                                    } else {
                                        ans = {
                                            questionID: value._id,
                                            type:'CHECKBOX',
                                            answers:[
                                                optionID
                                            ]
                                        }
                                    }
                                    let answerX = _.filter(answers, (o) => o.questionID !== value._id);
                                    answerX.push(ans);
                                    setAnswers(answerX);

                                    let obj = {};
                                    obj[value._id+indX] = nextChecked;
                                    setSelectedCheckIndex({...selectedCheckIndex, ...obj});
                                } else {
                                    let optionID = _.find(value.options, (valX, indxx) => Number(indX) === indxx)._id;
                                    let ans = _.find(answers, (o) => o.questionID === value._id);
                                    if(ans){
                                        let ansAns = _.filter(ans.answers, o => o !== optionID);
                                        ans.answers = ansAns;
                                    } else {

                                    }
                                    let answerX = _.filter(answers, (o) => o.questionID !== value._id);
                                    answerX.push(ans);
                                    setAnswers(answerX);

                                    let obj = {...selectedCheckIndex};
                                    delete obj[value._id+indX];
                                    setSelectedCheckIndex(obj);
                                }
                            }}
                            >{o.text}</CheckBox>)}
                    </Layout>);
                    } else if(value.questionType === 'TEXT_INPUT') {
                        return <Layout level="1" title="Question 3" style={{marginTop:10, padding:10, borderRadius:5}}>
                        <Text category="s1" style={{marginBottom:5}}>{`Q${index+1}. ${value.question}`}</Text>
                        <Input
                            multiline
                            placeholder='Type your answer here'
                            value={_.get(_.find(answers, o => o.questionID === value._id), 'answerText', '')}
                            onChangeText={(ansText)=>{
                                let ans = _.filter(answers, (o) => o.questionID !== value._id);
                                ans.push({
                                    questionID: value._id,
                                    type:'TEXT_INPUT',
                                    answerText: ansText
                                })
                                setAnswers(ans);
                            }}
                            />
                        </Layout>
                    }
                })}

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={()=>{setConfirmModal(true); checkAnswers();}} disabled={false} style={styles.button} size='medium'> SUBMIT </Button>
            </View>

            </View>
            <Modal
                visible={confirmModal}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                //onBackdropPress={() => setConfirmModal(false)}
                style={{width: '100%', height: '100%', marginTop: '10%'}}
                >
                <View style={{flexGrow:1}} onPress={() => setConfirmModal(false)}/>
                <View style={{width:'100%', backgroundColor: 'red'}}>
                    <Layout level="1" style={{justifyContent:'center', flexDirection:'column-reverse', alignItems:"center", textAlign:'center', padding:30, width: '100%'}}>
                    
                        <View style={{width: '100%'}}>
                            <Text category="h5">You have {quetions.length - answers.length} Unattended ansers</Text>
                            {_.has(postDetails, 'quizEndTime') && <Text category="h5">You Still have ... mins left</Text>}
                            <Text style={{marginBottom:40}} category="h4">Are You Sure You want to Submit?</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Button style={{width:'45%'}} appearance="outline" onPress={() => {
                                    setConfirmModal(false);
                                    }}>Back</Button>
                                <Button style={{width:'45%'}} onPress={() => {
                                    onPressModalConfirm();
                                    }}>
                                    Submit
                                </Button>
                            </View>
                            
                        </View>
                    </Layout>
                </View>
            </Modal>
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
                            <Text category="h5" style={{textAlign:'center'}}>Test Successfully Submitted!</Text>      
                            <Text category="h5" style={{textAlign:'center'}}>You have scored {score} Marks</Text>
                            <Button style={{marginTop: 10}} appearance="outline" onPress={() => {
                                    props.navigation.goBack();
                                    }}>Back to homescreen</Button>
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

export default Test;