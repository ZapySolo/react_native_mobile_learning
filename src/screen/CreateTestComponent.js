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
       <></>);
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