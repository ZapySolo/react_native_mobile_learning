import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Dimensions } from 'react-native';
import * as _ from 'lodash';
import { map } from 'lodash';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const quetions = [
    {
        _id:'question:1',
      "answer": "Big Data Analysis",
      "marks": "1",
      "options": [],
      "question": "Full form of BDA",
      "questionType": "TEXT_INPUT",
    },
    {
        _id:'question:2',
      "marks": "1",
      "options": [
        {
            _id:'option:1',
          "isAnswer": true,
          "text": "Big Data Analysis",
        },
        {
            _id:'option:2',
          "isAnswer": false,
          "text": "Big Data Analytic",
        },
        {
            _id:'option:3',
          "isAnswer": false,
          "text": "Business Data Analysis",
        },
        {
            _id:'option:4',
            "isAnswer": false,
          "text": "Business Data Analytic",
        },
      ],
      "question": "Full form of BDA",
      "questionType": "RADIO_BUTTON",
    }, {
        _id:'question:3',
      "marks": "1",
      "options": [
        {
            _id:'option:112',
          "isAnswer": true,
          "text": "Big Data Analysis",
        },
        {
            _id:'option:232',
          "isAnswer": false,
          "text": "Big Data Analytic",
        },
        {
            _id:'option:343',
          "isAnswer": false,
          "text": "Business Data Analysis",
        },
        {
            _id:'option:443',
          "text": "Business Data Analytic",
        },
      ],
      "question": "Full form of BDA",
      "questionType": "RADIO_BUTTON",
    },

    {
        _id:'question:4',
      "marks": "1",
      "options": [
        {
            _id:'option:5',
          "isAnswer": true,
          "text": "Option 1",
        },
        {
            _id:'option:6',
            "isAnswer": false,
          "text": "Option 2",
        },
        {
            _id:'option:7',
          "isAnswer": true,
          "text": "Option 3",
        },
      ],
      "question": "Full form of BDA",
      "questionType": "CHECKBOX",
    },
  ]
console.log('quetions',quetions);

const Test = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [testTimeRem, setTestTimeRem] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

    const [answers, setAnswers] = useState([]);

    const [selectedRadioIndex, setSelectedRadioIndex] = useState([]);
    const [selectedCheckIndex, setSelectedCheckIndex] = useState({});

    const [score, setScore] = useState(0);

    useEffect(()=>{
        console.log('answers',answers);
    },[answers])

    const checkAnswers = () => {
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
                    if(ques.answer !== ans.answerText) flag = false;
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
            <Header title="BDA Test: Module 1" right={<View style={{alignItems:'center'}}><Text category="label" appearance="hint">Time</Text><Text>{testTimeRem}</Text></View>} left={<Text onPress={()=>{props.navigation.navigate("Home")}}>Back</Text>}/>
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
                        {_.map(value.options, (o, indX) => <CheckBox  style={{marginBottom:10, marginTop:5}}
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
                style={{flex:1}}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onBackdropPress={() => setConfirmModal(false)}>
                <View style={{ width:windowWidth, height:windowHeight, position:'relative'}}>
                    <View style={{flexGrow:1}}></View>
                    <Layout level="1" style={{justifyContent:'center', alignItems:"center", textAlign:'center', padding:30,position:'absolute', bottom:'-10%'}}>
                        <View>
                            <Text category="h5">You have Scored {score} Marks</Text>
                            <Text category="h5">You have 2 Unattended ansers</Text>
                            <Text category="h5">You Still have 2.21 mins left</Text>
                            <Text style={{marginBottom:40}} category="h4">Are You Sure You want to Submit?</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Button style={{width:'40%'}} appearance="outline" onPress={() => setConfirmModal(false)}>
                                    Back
                                </Button>
                                <Button style={{width:'40%'}} onPress={() => {
                                    console.log('answers',answers);
                                    setConfirmModal(false);
                                    setSubmitSuccessModal(true);
                                    setTimeout(()=>{
                                        setSubmitSuccessModal(false);
                                    },5000);
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
                            <Text category="h5">Test Successfully Submitted!</Text>      
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