import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import Navbar from './NavBar';
import NotificationsList from './NotificationsList';


class NotificationsHome extends React.Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <Navbar
          renderRightMenu={() => (
            <TouchableOpacity><Image style={{height: 20, resizeMode: 'contain'}} source={require('../img/search.png')}/></TouchableOpacity>
          )}
          renderTitle={() => (
            <Image style={{width: 80, height: 30, resizeMode: 'contain'}} source={require('../img/title.png')}/>
          )}
          titleStyle={{
            flex: 1,
            alignItems: 'flex-start'
          }}
        />
        <NotificationsList />
      </View>
    )
  }
}

export default NotificationsHome
