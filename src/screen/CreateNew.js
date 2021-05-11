import React, {useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card,OverflowMenu,MenuItem, Input } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Modal, RefreshControl, ScrollView, LogBox,Image} from 'react-native';
import Header from '../Header';
import dummyData from '../dummyData.json';
import Repository from '../utilities/pouchDB';
import * as _ from 'lodash';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const CreateNew = (props) => {
    const [userType, setUserType] = useState(''); //STUDENT TEACHER

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="2" style={{flex: 1}}>
            <Header title={_.get(props, 'route.params.data.classTitle', '--')} left={<Ionicons name="chevron-back" size={24} color="black" onPress={()=>{
                props.navigation.goBack();
            }}/>}/>
            <ScrollView style={{padding:10}}>
                <Text category="s1" appearance="hint"  style={{margin: 2, marginBottom:10}}>Create new</Text>
                <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Card onPress={()=>{
                        props.navigation.navigate("CreatePost", {classID: _.get(props, 'route.params.data._id'), actionType:'CREATE_POST', data: {..._.get(props, 'route.params.data')}})
                    }} style={styles.card} header={() => <MaterialCommunityIcons name="post" style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Post</Text>
                    </Card>
                    <Card onPress={() => {
                        props.navigation.navigate("Create Lecture", {data:{..._.get(props, 'route.params.data')}});
                    }} style={styles.card} header={() => <Entypo name="folder-video" style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Lecture</Text>
                    </Card>
                    <Card onPress={()=>{
                        props.navigation.navigate("CreateAssignExp", {classID: _.get(props, 'route.params.data._id'), actionType:'CREATE_EXPERIMENT', data: {..._.get(props, 'route.params.data')}})
                    }} style={styles.card} header={() => <MaterialIcons style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} name="assignment" size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Experiment</Text>
                    </Card>
                </View>
                <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Card onPress={() => {
                            props.navigation.navigate("CreateAssignExp", {classID: _.get(props, 'route.params.data._id'), actionType:'CREATE_ASSIGNMENT', data: {..._.get(props, 'route.params.data')}})
                        }} style={styles.card} header={() => <MaterialIcons style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} name="assignment" size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Assignment</Text>
                    </Card>
                    <Card
                        onPress={() => {
                            props.navigation.navigate("CreateTest", {data:{..._.get(props, 'route.params.data')}});
                        }}
                        style={styles.card} header={() => <MaterialCommunityIcons style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} name="book-open-page-variant" size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Test</Text>
                    </Card>
                    <Card disabled style={styles.card} header={() => <MaterialCommunityIcons style={{alignSelf:'center', paddingTop:20, paddingBottom:20}} name="book-open-page-variant" size={42} color="black" />}>
                        <Text style={{alignSelf: 'center'}}>Exam</Text>
                    </Card>
                </View>
            </ScrollView>
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    //flexGrow:1
    //maxHeight: 238,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
  card: {
    flex: 1,
    margin: 2
  }
});

export default CreateNew;