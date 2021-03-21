import React,{useState} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';

const CreateLeacture = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level="3" style={{flex: 1}}>
            <Header title="Create Leacture" left={<Text onPress={()=>{props.navigation.navigate("Home")}}>{'< '}Back</Text>} right={null}/>
            <ScrollView style={{flexGrow:1}}>
            <View style={{padding:10}}>
                <Input
                    label='Lecture Title'
                    placeholder='Place your title here'
                    // caption='Should contain at least 3 characters'
                    style={{marginBottom:5}}
                    // status='danger'
                    
                    //accessoryRight={() => <Text>a</Text>}
                    // captionIcon={AlertIcon}
                    // secureTextEntry={secureTextEntry}
                    // onChangeText={nextValue => setValue(nextValue)}
                    />
                <Input
                    label='Lecture Description (optional)'
                    placeholder='Place your description here'
                    multiline={true}
                    //caption='Should contain at least 3 characters'
                    //status='danger'
                    style={{marginBottom:5}}
                    textStyle={{ minHeight: 40 }}
                    //accessoryRight={() => <Text>a</Text>}
                    // captionIcon={AlertIcon}
                    // secureTextEntry={secureTextEntry}
                    // onChangeText={nextValue => setValue(nextValue)}
                    />

                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture Type</Text>
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedIndex}
                    onChange={index => setSelectedIndex(index)}>
                    <Radio>Upload Video</Radio>
                    <Radio disabled={true}>Screen Sharing</Radio>
                    <Radio disabled={true}>Live Camera Session</Radio>
                </RadioGroup>

                <Text category="label" appearance='hint' style={{fontSize:12}}>Lecture Start Time</Text>
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedDateIndex}
                    onChange={index => setSelectedDateIndex(index)}>
                    <Radio>Start Instatly</Radio>
                    <Radio>Select Date & Time</Radio>
                </RadioGroup>

                {selectedDateIndex === 1 && <>
                    <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Select Date & Time</Text>
                    <RangeCalendar
                    style={{marginBottom:5}}
                        //range={range}
                        //onSelect={nextRange => setRange(nextRange)}
                        />
                </>}

                <Text category="label" appearance='hint' style={{fontSize:12}}>Mark Attendence By:(optional)</Text>    
                <RadioGroup
                style={{marginBottom:5}}
                    selectedIndex={selectedDateIndex}

                    onChange={index => setSelectedDateIndex(index)}>
                    <Radio>Quiz</Radio>
                    <Radio>Student present for lecture</Radio>
                    <Radio>Student completing the lecture (anytime)</Radio>
                </RadioGroup>   

            <Text category="label" appearance='hint' style={{fontSize:12, marginBottom:5}}>Quiz Questions</Text>  
            <Input
                placeholder='Place your question here'
                // caption='Should contain at least 3 characters'
                style={{marginBottom:5}}
                // status='danger'
                accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>Q1.</Text>}
                accessoryRight={() => <Text status='info' style={{textDecorationLine:'underline'}}>Upload Image</Text>}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
                />  
            <Select
                //style={styles.select}
                accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>Ans.</Text>}
                placeholder='Text Field'
                style={{marginBottom:5}}
                //selectedIndex={selectedIndex}
                //onSelect={index => setSelectedIndex(index)}
                >
                <SelectItem title='Radio Button'/>
                <SelectItem title='Checkbox'/>
                <SelectItem title='Text Field'/>
                <SelectItem disabled={true} title='FileUpload'/>
            </Select>
            <Input
                placeholder='option 1'
                style={{marginBottom:5}}
                // status='danger'
                accessoryLeft={() => <Text style={{color:'#8F9BB3'}}>Option 1.</Text>}
                accessoryRight={() => <Text status='info' style={{textDecorationLine:'underline'}}>correct</Text>}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
                />  
            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Text appearance='hint'> Add Another Option + </Text>
            </View>

            <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                <Button disabled={true} style={styles.button} size='medium'> SUBMIT </Button>
            </View>

            </View>
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