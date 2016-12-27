import React from 'react';

import {
  Image,
  Text,
  View,
  StyleSheet,
  ListView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  DatePickerIOS,
  DatePickerAndroid,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import moment from 'moment';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';

import PureListView from '../../../common/PureListView';
import CircleImage from '../../../common/CircleImage';
import {toHumanNumber, random, mapSource} from '../../../common/utils';
import {changePublicProfile} from '../../../actions/changeProfile';
import {linkFacebook, unlinkFacebook} from '../../../actions/login';

import CircleImageWithCategory from '../components/CircleImageWithCategory';
import NavBar from '../components/NavBar';
import {styles as commonStyles, colors as commonColors} from '../common';

import ProfileHeader from '../components/ProfileHeader';
import DatePickerDialog from '../components/DatePickerDialog';
import ModalSpinner from '../components/ModalSpinner';

import {connect} from 'react-redux'

class ProfileEditorScreen extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      name: this.props.name,
      birthDayDate: this.props.birthDayDate,
      sex: this.props.sex,
      changedProfilePicture: null,
      changedProfileCover: null,
      savingProfile: false,
      linkingFacebook: false
    };
  }

  render() {
    return (<View style={commonStyles.listViewContainer}>
      <ModalSpinner visible={this.state.savingProfile || this.state.linkingFacebook}/>
      <DatePickerDialog ref="datePicker"/>
      <NavBar
        title="แก้ไขข้อมูล"
        renderRightMenu={() => {
          return (<Image
                source={require('../img/icons/ok.png')}
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain'
                }}
              />)
        }}
        onLeftPress={() => this.props.onBackPress && this.props.onBackPress()}
        onRightPress={() => {
          this.setState({
            savingProfile: true
          });
          return this.props.changePublicProfile(this.state.name, this.state.birthDayDate, this.state.sex, this.state.changedProfilePicture, this.state.changedProfileCover)
            .then(() => {
              this.setState({
                savingProfile: false
              });
              this.props.onBackPress && this.props.onBackPress();
            })
            .catch(error => {
            });
        }}
        >
      </NavBar>
      <ProfileHeader
        user={this.props.user}
        customCoverSource={this.state.changedProfileCover ? {uri: 'data:image/jpeg;base64,' + this.state.changedProfileCover.data, isStatic: true} : null }
        customSource={this.state.changedProfilePicture ? {uri: 'data:image/jpeg;base64,' + this.state.changedProfilePicture.data, isStatic: true} : null }
        >
        <View style={styles.rowDirection}>
          <TouchableOpacity style={styles.whiteBorder} onPress={() => this.openProfilePicker()}>
            <Text style={styles.whiteText}>เปลี่ยนรูปโปรไฟล์</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteBorder} onPress={() => this.openProfileCoverPicker()}>
            <Text style={styles.whiteText}>เปลี่ยนรูปพื้นหลัง</Text>
          </TouchableOpacity>
        </View>
      </ProfileHeader>

      <View style={{flex: 2}}>
        <View style={[styles.editorBox, {marginVertical: 15}]}>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>ชื่อ</Text>
            </View>
            <View style={[styles.input, styles.bottomBorderGrey]}>
              <TextInput
                onChangeText={(name) => this.setState({name})}
                style={[styles.textGrey, {flex: 1}]}
                autoCapitalize='none'
                value={this.state.name}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>เพศ</Text>
            </View>
            <TouchableOpacity style={[styles.input, styles.bottomBorderGrey]} onPress={() => this.openSexPicker()}>
              <Text style={styles.textGrey}>{this.state.sex === 'M' ? 'ชาย' : (this.state.sex === 'F' ? 'หญิง' : 'ไม่ระบุ')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>เกิด</Text>
            </View>
            <TouchableOpacity style={styles.input} onPress={() => this.openDatePicker()}>
              <Text style={styles.textGrey}>{!this.state.birthDayDate ? 'ไม่ระบุ' : moment(this.state.birthDayDate).format('LL')}</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.editorBox2}>
          <TouchableOpacity style={styles.row2} onPress={() => this.onToggleFacebookLink()}>
            <Text style={styles.label2}>เชื่อมต่อ Facebook</Text>
            <View>
              <Switch value={this.props.facebookLinked} onValueChange={() => this.onToggleFacebookLink()}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row2} onPress={() => this.props.navigator.push({page: 'change-email'})}>
            <Text style={styles.label2}>เปลี่ยน Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row2} onPress={() => this.props.navigator.push({page: 'change-password'})}>
            <Text style={styles.label2}>เปลี่ยน Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>);
  }

  onToggleFacebookLink() {
    this.setState({
      linkingFacebook: true
    });
    if (this.props.facebookLinked) {
      return this.props.unlinkFacebook().then(() => {
        this.setState({
          linkingFacebook: false
        });
      });
    }
    else {
      return this.props.linkFacebook().then(() => {
        this.setState({
          linkingFacebook: false
        });
      });
    }
  }

  openProfilePicker() {
    ImagePicker.showImagePicker(response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          changedProfilePicture: response
        });
      }
    });
  }

  openProfileCoverPicker() {
    ImagePicker.showImagePicker(response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          changedProfileCover: response
        });
      }
    });
  }

  openDatePicker() {
    this.refs.datePicker.open().then(date => {
      this.setState({
        birthDayDate: date
      })
    });
  }

  openSexPicker() {
    Picker.init({
      pickerData: [
        'ไม่ระบุ',
        'ชาย',
        'หญิง'
      ],
      selectedValue: [this.state.sex === 'M' ? 'ชาย' : (this.state.sex === 'F' ? 'หญิง' : 'ไม่ระบุ')],
      pickerConfirmBtnText: 'OK',
      pickerCancelBtnText: 'CANCEL',
      pickerTitleText: 'เพศ',
      onPickerConfirm: (data) => {
        let sex;
        if (data[0] === 'ชาย') {
          sex = 'M';
        }
        if (data[0] === 'หญิง') {
          sex = 'F';
        }
        if (data[0] === 'ไม่ระบุ') {
          sex = null;
        }
        this.setState({
          sex
        });
      }
    });
    Picker.show();
  }
}

const styles = StyleSheet.create({
  rowDirection: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 25
  },
  whiteBorder: {
    padding: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginHorizontal: 5
  },
  whiteText: {
    color: 'white',
    fontSize: 10
  },
  editorBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: commonColors.greyBorder
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 15
  },
  input: {
    flex: 5,
    justifyContent: 'center',
    height: 50
  },
  editorBox2: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: commonColors.greyBorder
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: commonColors.greyBorder
  },
  label2: {
    fontSize: 15,
    flex: 1
  },
  bottomBorderGrey: {
    borderBottomWidth: 1,
    borderColor: commonColors.greyBorder
  },
  textGrey: {
    color: commonColors.textGrey
  }
});

const select = state => ({
  name: state.user.name,
  email: state.user.email,
  sex: state.user.sex,
  birthDayDate: state.user.birthDayDate,
  saved: state.user.savedProfile,
  facebookLinked: state.user.facebookLinked
});

// saving: state.user.savingProfile || state.user.facebookLinkProcessing

const actionsMaping = {
  changePublicProfile,
  linkFacebook,
  unlinkFacebook
};

export default connect(select, actionsMaping)(ProfileEditorScreen);
export {
  ProfileEditorScreen as Component
}
