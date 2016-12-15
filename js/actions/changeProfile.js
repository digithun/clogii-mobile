/* @flow */

'use strict';

import Parse from 'parse/react-native';

import type { Action, ThunkAction } from './types';

async function getUser() {
  const user = await Parse.User.currentAsync();
  if (!user) {
    throw new Error('not logged in');
  }
  return user;
}

async function _changePassword(newPassword) {
  const user = await getUser();
  user.set("password", newPassword);
  await user.save();
}

async function _changeEmail(newEmail) {
  const user = await getUser();
  user.set("username", newEmail);
  user.set("email", newEmail);
  await user.save();
}

export const changeEmail = (newEmail) => dispatch => {
  dispatch(changingEmail());
  _changeEmail(newEmail).then(() => {
    dispatch(changedEmail());
  }).catch(error => {
    dispatch(changeEmailError(error.message));
  });
}

function changedEmail() {
  return {
    type: 'CHANGED_EMAIL'
  }
}

function changingEmail() {
  return {
    type: 'CHANGING_EMAIl'
  }
}

function changeEmailError(error) {
  return {
    type: 'CHANGE_EMAIL_ERROR',
    payload: error
  }
}

export function clearChangeEmailState() {
  return {
    type: 'CLEAR_CHANGE_EMAIL_STATE'
  }
}

async function _changePassword(newPassword) {
  const user = await getUser();
  user.set("password", newPassword);
  await user.save();
}

export const changePassword = (newPassword) => dispatch => {
  dispatch(changingPassword());
  _changePassword(newPassword).then(() => {
    dispatch(changedPassword());
  }).catch(error => {
    dispatch(changePasswordError(error.message));
  });
}

function changedPassword() {
  return {
    type: 'CHANGED_PASSWORD'
  }
}

function changingPassword() {
  return {
    type: 'CHANGING_PASSWORD'
  }
}

function changePasswordError(error) {
  return {
    type: 'CHANGE_PASSWORD_ERROR',
    payload: error
  }
}

export function clearChangePasswordState() {
  return {
    type: 'CLEAR_CHANGE_PASSWORD_STATE'
  }
}

async function _changeProfile(data) {
  const user = await getUser();
  if (data.profilePicture) {
    const base64 = data.profilePicture.data;
    const file = new Parse.File(data.profilePicture.fileName, { base64: base64 });
    await file.save();
    user.set('profilePicture', file);
  }
  if (data.profileCover) {
    const base64 = data.profileCover.data;
    const file = new Parse.File(data.profileCover.fileName, { base64: base64 });
    await file.save();
    user.set('profileCover', file);
  }
  delete data.profileCover;
  delete data.profilePicture;
  Object.keys(data).forEach(key => {
    user.set(key, data[key]);
  });
  await user.save();
  return await user.fetch();
}

export const changePublicProfile = (name, birthDayDate, sex, profilePicture, profileCover): ThunkAction => dispatch => {
  dispatch(savingProfile());
  return _changeProfile({
    name,
    birthDayDate,
    sex,
    profilePicture,
    profileCover
  }).then(
    (user) => {
      dispatch(changedPublicProfile({
        name: user.get('name'),
        sex: user.get('sex'),
        birthDayDate: user.get('birthDayDate'),
        profilePicture: user.get('profilePicture') ? user.get('profilePicture').url() : null,
        profileCover: user.get('profileCover') ? user.get('profileCover').url() : null
      }));
    }
  );
}

export function clearSaveState() {
  return {
    type: 'CLEAR_SAVE_STATE'
  };
}

function savingProfile() {
  return {
    type: 'SAVING_PROFILE'
  };
}

function changedPublicProfile(data) {
  return {
    type: 'CHANGED_PUBLIC_PROFILE',
    ...data
  }
}

function changedEmail(email): Action {
  return {
    type: 'CHANGED_EMAIL',
    email
  };
}