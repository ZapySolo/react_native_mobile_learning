import React,{useState} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';

const CreateJoinClass = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="4" style={{flex: 1}}>
            <Header title="Create/Join Class" left={<Text onPress={()=>{props.navigation.navigate("Home")}}>{'< '}Back</Text>} right={null}/>
            <View style={{flexGrow:1, margin:10}}>
                <Layout level="1" style={{padding:10, paddingBottom:20, borderRadius:5}}>
                    <View>
                        <Text category="h6">Create New Classroom</Text>
                    </View>
                    <View style={{marginTop:10}}>
                        <Input
                            label='Class Title'
                            placeholder=''
                            caption='Should contain at least 4 characters'
                            style={{marginBottom:5}}
                            // status='danger'
                            />
                    </View>

                    <View style={{marginTop:10}}>
                        <Input
                            label='Class Sub Title'
                            placeholder=''
                            caption='Should contain at least 4 characters'
                            style={{marginBottom:5}}
                            // status='danger'
                            />
                    </View>
                    <View style={{marginTop:10}}>
                        <Button >Create Class</Button>
                    </View>
                </Layout>
            </View>
            
            <Layout level="1" style={{margin:10, marginTop:0, padding:10, borderRadius:5}}>
                <View>
                    <Text category="h6">Join Classroom</Text>
                </View>
                <View style={{marginTop:10, flexDirection:'row', alignItems:'flex-end'}}>
                    <Input
                        label='Class Code'
                        placeholder=''
                        //caption='Should contain at least 4 characters'
                        style={{marginBottom:5, flexGrow:1, marginRight:5}}
                        // status='danger'
                        keyboardType="numeric"
                        />
                    <Button style={{height:40, width:40, marginBottom:9}}></Button>
                </View>
            </Layout>
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

export default CreateJoinClass;