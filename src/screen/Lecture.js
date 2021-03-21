import React,{useState, useRef} from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card, Input, RadioGroup,Radio, RangeCalendar, SelectItem, Select } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Header';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as _ from 'lodash';
const imageLink = 'https://source.unsplash.com/200x200';

const Leacture = (props) => {
    const [doubtText, setDoubtText] = useState('');
    const [data, setData] = useState(props.route.params.item);
    const [doubtList, setDoubtList] = useState(data);
    const [doubtButtonState, setDoubtButtonState] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    React.useEffect(() => {
        console.log(data);
    }, [props.route.params.item]);

    const renderItem = ({ item, index }) => (
        <ListItem
            style={{width:'100%'}}
            title={()=><View style={{paddingRight:10,paddingLeft:10, alignItems:(item.title==='You')?'flex-end':'flex-start'}}><Text>{item.title}</Text></View>}
            description={()=><View style={{paddingRight:10,paddingLeft:10, alignItems:(item.title==='You')?'flex-end':'flex-start'}}><Text category='label'>{item.description}</Text></View>}
            accessoryRight={() => (item.title==='You')?<Avatar size='medium' source={{uri:imageLink}}/>:<></>}
            accessoryLeft={() => (item.title!=='You')?<Avatar size='medium' source={{uri:imageLink}}/>:<></>}
        />
    );
    
    return (
    <SafeAreaView style={{ flex: 1 }}>
        <Layout level='3' style={{flex: 1}}>
            <Header title={_.get(data, 'lectureDescription', 'Lecture')} left={<Text onPress={()=>{props.navigation.navigate("Home")}}>Back</Text>} right={null}/>
            <View style={{width:'100%', backgroundColor:'black'}}>
                <Video
                    ref={video}
                    style={{height:200}}
                    source={{
                        uri: 'http://techslides.com/demos/sample-videos/small.mp4',
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <View>
                    <Button onPress={()=>{setDoubtButtonState(!doubtButtonState)}} style={{margin:10}} status='primary'accessoryLeft={()=><Text>H</Text>}>
                        Raise Doubt
                    </Button>
                </View>
            </View>
            <View style={{paddingLeft:10}}>
                <Text category="s1" >Other Students Doubt</Text>
            </View>
            <View style={{flexGrow:1, marginTop:10}}>
                <List
                    style={[styles.container, {padding:10}]}
                    data={doubtList}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <Divider />}
                    />
            </View>
            {doubtButtonState && (
                <Layout level="1" style={{padding:10, flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Input
                        style={{flexGrow:1, paddingLeft:20}}
                        //accessoryLeft={()=><Text>Left</Text>}
                        placeholder='Type your doubt here'
                        //accessoryRight={()=><Text>Send</Text>}
                        value={doubtText}
                        onChangeText={nextValue => setDoubtText(nextValue)}
                        />
                    <Text onPress={()=>{
                        if(doubtText !== ''){
                            setDoubtList([...doubtList, {title:'You', description:doubtText}]);
                            setDoubtText('');
                        }
                    }} style={{padding:10}}>Send</Text>
                </Layout>
            )}
            
        </Layout>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    //maxHeight: 238,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const data = [
    { title: 'Manisha Kode', description: 'Mam we dont have the formula for sin2T + cos2T' },
    { title: 'Simran', description: 'Mam pleae give us the spreatsheet of formulas' },
];

export default Leacture;