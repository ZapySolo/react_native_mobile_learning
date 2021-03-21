import React,{useState, useEffect} from 'react';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import * as _ from 'lodash';

const CreateTestComponent = (props) => {
    const [questionList, setQuestionList] = useState(_.get(props, 'questionList', [{}]));

    useEffect(()=>{
        if(questionList.length <= 0){
            setQuestionList([{}]);
        }
        if(typeof props.setQuestionList == 'function'){
            props.setQuestionList(questionList);
        }
    },[questionList]);

    return (
        <View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text category="s2"></Text>
            <Text category="s2">{`No of questions: ${questionList.length}`}</Text>
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
                }} keyboardType="numeric" style={{marginBottom:5}} accessoryLeft={()=><Text appearance="hint">Marks</Text>}/>
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
                        setQuestionList(newQuestionList);
                    }} appearance="outline">Delete</Button>
                </View>
        </Layout>)}

    <Button appearance="ghost" onPress={()=>{
        setQuestionList([...questionList, {options:[]}]);
    }}>Add Another Queston +</Button>

    </View>);
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

export default CreateTestComponent;