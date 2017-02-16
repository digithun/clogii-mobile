import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';

const episodeSchema = Schema({
  no: { type: Number, required: true },
  title: { type: String, required: true },
  preview: String,
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, required: true },
});

const Episode = mongoose.model('Episode', episodeSchema);
const EpisodeTC = composeWithMongoose(Episode);

EpisodeTC.addFields({
  likeCount: {
    type: 'Int',
    resolve: () => 0,
  },
  commentCount: {
    type: 'Int',
    resolve: () => 0,
  },
});

export {
  Episode as Model,
  EpisodeTC as TC,
};