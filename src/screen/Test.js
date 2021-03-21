import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select, CheckBox,Modal } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Test = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [testTimeRem, setTestTimeRem] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

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
                <Layout level="1" title="Question 1" style={{marginTop:10, padding:10, borderRadius:5}}>
                    <Text category="s1" style={{marginBottom:5}}>Q1. Fullform of BDA</Text>
                    <RadioGroup
                        selectedIndex={selectedDateIndex}
                        onChange={index => setSelectedDateIndex(index)}>
                        <Radio>Business Data Analytics</Radio>
                        <Radio>Big Data Analytics</Radio>
                        <Radio>Business Data Analysis</Radio>
                    </RadioGroup> 
                </Layout>

                <Layout level="1" title="Question 2" style={{marginTop:10, padding:10, borderRadius:5}}>
                    <Text category="s1" style={{marginBottom:5}}>Q2. Fullform of BDA</Text>
                    <Text category="s1" style={{marginBottom:5}} status='info'>Open File</Text>
                    <CheckBox style={{marginBottom:10, marginTop:5}}
                        //checked={checked}
                        //onChange={nextChecked => setChecked(nextChecked)}
                        >Business Data Analysis</CheckBox>
                    <CheckBox style={{marginBottom:10}} >Business Data Analytics</CheckBox>
                    <CheckBox style={{marginBottom:10}}>Big Data Analytics</CheckBox>
                </Layout>

                <Layout level="1" title="Question 3" style={{marginTop:10, padding:10, borderRadius:5}}>
                    <Text category="s1" style={{marginBottom:5}}>Q3. Solve and upload solution</Text>
                    <Text category="s1" style={{marginBottom:5}} status='info'>Open File</Text>
                    <Text>expo install expo-document-picker</Text>
                </Layout>

                <Layout level="1" title="Question 3" style={{marginTop:10, padding:10, borderRadius:5}}>
                    <Text category="s1" style={{marginBottom:5}}>Q3. Explain BDA in Details</Text>
                    <Input
                        multiline
                        placeholder='Type your answer here'
                        />
                </Layout>

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={()=>{setConfirmModal(true)}} disabled={false} style={styles.button} size='medium'> SUBMIT </Button>
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
                            <Text category="h5">You have 2 Unattended ansers</Text>
                            <Text category="h5">You Still have 2.21 mins left</Text>
                            <Text style={{marginBottom:40}} category="h4">Are You Sure You want to Submit?</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Button style={{width:'40%'}} appearance="outline" onPress={() => setConfirmModal(false)}>
                                    Back
                                </Button>
                                <Button style={{width:'40%'}} onPress={() => {
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