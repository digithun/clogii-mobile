import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';

import * as helpers from '../helpers';

const editorSchema = Schema({
  name: { type: String, required: true },
  profilePicture: String,
  followingCount: { type: Number, default: 0 },
  clogIds: { type: [Schema.Types.ObjectId], ref: 'Clog' },
});

const Editor = mongoose.model('Editor', editorSchema);
const EditorTC = composeWithMongoose(Editor);

EditorTC.addFields({
  isFollowing: {
    type: 'Boolean',
    resolve: () => false,
  },
  followingCount: {
    type: 'Int',
    resolve: () => 0,
  },
});

helpers.countArray(EditorTC, 'clogCount', 'clogs');

export function onReady({ modelTCs }) {
  helpers.relateArray(EditorTC, modelTCs.Clog, 'clogs', 'clogIds');
}

export {
  Editor as Model,
  EditorTC as TC,
};
