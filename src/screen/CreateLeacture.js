import React,{useState} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect } from 'react/cjs/react.development';
import CreateTestComponent from './CreateTestComponent';

const CreateLeacture = (props) => {
    const [selectedLectureTypeIndex, setSelectedLectureTypeIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedLectureStartIndex, setSelectedLectureStartIndex] = useState(0);
    const [selectedAttendenceByIndex, setSelectedAttendenceByIndex] = useState(0);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    const [questionList, setQuestionList] = useState([{}]);
    
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

    const [lectureDetails, setLectureDetails] = useState({
        _id:'lecture:123456',
        lectureTitle:'',
        lectureDescription: '',
        lectureType:'VIDEO_UPLOAD', //SCREEN_SHARING LIVE_CAMERA
        videoLink:'',//OPTIONAL
        startTime: new Date(),
        attendanceBy: 'QUIZ', //STUDENT_PRESENT COMPLETED
        classID: 'class:1234',
        lectureDoubt:[],
        quizQuestions:[]
    });


    // const lectureType = [
    //     { value:'VIDEO_UPLOAD', title:'Upload Video' }, 
    //     { value:'SCREEN_SHARING', title:'Screen Sharing' }, 
    //     { value:'LIVE_CAMERA', title:'Live Camera Session' }
    // ];

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="3" style={{flex: 1}}>
            <Header title="Create Leacture" left={<Text onPress={()=>{props.navigation.navigate("Home")}}>{'< '}Back</Text>} right={null}/>
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
                    <Radio>Upload Video</Radio>
                    <Radio disabled={true}>Screen Sharing</Radio>
                    <Radio disabled={true}>Live Camera Session</Radio>
                </RadioGroup>

                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture Start Time</Text>
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedLectureStartIndex}
                    onChange={index => {
                        if(index === 1){
                            setShowDateTimePicker(true);
                        }
                        setSelectedLectureStartIndex(index)
                    }}>
                    <Radio>Start Instatly</Radio>
                    <Radio disabled>Select Date & Time</Radio>
                    <Text style={{fontStyle:'italic'}}>{`Schedule on: ${new Date(lectureDetails.startTime).toDateString()} ${new Date(lectureDetails.startTime).toTimeString()}`}</Text>
                </RadioGroup>

                {showDateTimePicker && <>
                    <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Select Date & Time</Text>
                    
                    <RangeCalendar
                        style={{marginBottom:5}}
                        value={new Date(selectedDate)}
                        onSelect={({startDate}) => {
                            setShowDateTimePicker(false);
                            setSelectedDate(new Date(startDate));
                        }}
                        />
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={selectedTime}
                        mode={'time'}
                        display="default"
                        onChange={({nativeEvent})=>{
                            setSelectedTime(new Date(nativeEvent.timestamp))
                            //setShowDateTimePicker(false);
                        }}/>
                </>}

                <Text category="label" appearance='hint' style={{fontSize:12}}>Mark Attendence By:(optional)</Text>    
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedAttendenceByIndex}
                    onChange={index => {
                        if(index === 0){
                            setLectureDetails({...lectureDetails, attendanceBy:'QUIZ'})
                        } else if (index === 1){
                            setLectureDetails({...lectureDetails, attendanceBy:'STUDENT_PRESENT'})
                        } else if (index === 2){
                            setLectureDetails({...lectureDetails, attendanceBy:'COMPLETED'})
                        }
                        setSelectedAttendenceByIndex(index)
                    }}>
                    <Radio>Quiz</Radio>
                    <Radio>Student present for lecture</Radio>
                    <Radio>Student completing the lecture (anytime)</Radio>
                </RadioGroup>   

            {selectedAttendenceByIndex===0 && <>
                <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Quiz Questions</Text>  
                <CreateTestComponent questionList={questionList} setQuestionList={setQuestionList} />
            </>}

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button onPress={()=>{
                    console.log(lectureDetails);
                    setLectureDetails({});
                    }} style={styles.button} size='medium'> SUBMIT </Button>
            </View>

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