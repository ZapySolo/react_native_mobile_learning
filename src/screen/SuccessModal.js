import React,{useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
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

const SuccessModal = (props) => {
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        setVisibility(props.visibility);
    }, [props.visibility]);
    
    return (<Modal
        visible={visibility}
        style={{flex:1}}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onBackdropPress={() => {
            if(typeof props.onModalClose === 'function'){
                props.onModalClose(false);
            }
        }}
        >
        <View style={{ width:windowWidth, height:windowHeight, position:'relative'}}>
            <View style={{flexGrow:1}}></View>
            <Layout level="1"  style={{justifyContent:'center', alignItems:"center", textAlign:'center', padding:30, position:'absolute', bottom:'-10%', width:'100%'}}>
                <View>
                    <Text category="h1" style={{padding:40, textAlign:'center'}}>Tick</Text>
                    <Text category="h5">{props.text}</Text>      
                </View>
            </Layout>
        </View>
    </Modal>);
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

export default SuccessModal;