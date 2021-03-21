import React from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Divider, List, ListItem, Icon, Button, Avatar, Card} from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet} from 'react-native'

const Header = (props) => {
    return (
      <Layout level="1" style={styles.container}>
            <View style={{width:55, justifyContent:'center', alignItems:'center'}}>
                {props.left}
            </View>
            <View style={{flexGrow:1}}>
                <Text category='h5'>{props.title}</Text>
            </View>
            {props.right && <View style={{width:55, justifyContent:'center', alignItems:'center'}}>
                {props.right}
            </View>}
        </Layout>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    height:80,
    flexDirection:'row', 
    alignItems:'center', 
    //backgroundColor:'#fff', 
    // shadowOffset: {width :10, height: 10}, 
    // shadowColor: "black", 
    // shadowOpacity: 0.50,
    // elevation:2,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

export default Header;