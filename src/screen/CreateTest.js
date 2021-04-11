import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Dimensions } from 'react-native';
import * as _ from 'lodash';
import { xor } from 'lodash';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CreateTest = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [testTimeRem, setTestTimeRem] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

    /**
     * _id: Joi.string().required(),
        question: Joi.string().required(),
        questionType: Joi.string().valid('STRING', 'IMAGE'),
        answerType: Joi.string().valid('RADIO_BUTTON', 'FILE_UPLOAD', 'TEXT_INPUT', 'CHECKBOX'),
        options: Joi.array().items({
            _id: Joi.string().required(),
            text: Joi.string().required(),
            isAnswer: Joi.boolean().required()
        }).optional(),
     */

    const [questionList, setQuestionList] = useState([{}]);

    useEffect(()=>{
        if(questionList.length <= 0){
            setQuestionList([{}]);
        }
    },[questionList])

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='4' style={{flex: 1}}>
            <Header title="Create Test" left={<Text onPress={()=>{props.navigation.navigate("Home")}}>Back</Text>}/>
            <ScrollView style={{flexGrow:1}}>

            <View style={{padding:10}}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
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

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={()=>{
                    console.log(questionList);
                    setSubmitSuccessModal(true)
                    setTimeout(()=>{
                        setSubmitSuccessModal(false);
                        //props.navigation.navigate('Home');
                    },3000);
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