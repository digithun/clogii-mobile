'use strict';

import StyleSheet from 'StyleSheet';
import Dimensions from 'Dimensions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: undefined,
    height: undefined
  },
  buttonSession: {
    padding: 30,
    alignItems: 'center'
  },
  inputSession: {
    paddingTop: height * 0.1,
    alignItems: 'center'
  },
  emailButton: {
    width: 0.6 * width + 20,
    height: 40,
    marginVertical: 5
  },
  input: {
    width: 0.6 * width,
    height: 40,
    alignSelf: 'center',
    color: 'white'
  },
  inputBox: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 5
  },
  changePageText: {
    textAlign: 'center'
  },
  forgotPasswordText: {
    paddingHorizontal: width * 0.1,
    alignSelf: 'center',
    color: 'white'
  },
  errorText: {
    color: 'red'
  },
  backButton: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
  titleNavBar: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10
  },
  successText: {
    color: 'green',
    fontSize: 20
  },
  skip: {
    padding: 15,
  }
})
