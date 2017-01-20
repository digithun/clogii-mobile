const schema = `
  enum Category {
    D
    M
    G
    N
  }

  scalar Date

  type Tag {
    name: String!
    trendingClogs: [Clog!]!
  }

  type User {
    name: String!
    profilePicture: String
  }

  type Editor {
    name: String!
    profilePicture: String
  }

  type Clog {
    id: Int!
    title: String!
    cover: String
    category: Category!
    author: Editor!
    review: String!
    followers: [User!]!
    followerCount: Int!
    followersYouKnow: [User!]!
    likes: [User!]!
    likeCount: Int!
    viewCount: Int!
    tags: [Tag!]!
    createdAt: Date!
  }

  type CategoryDetail {
    category: Category!
    recommendedClogs: [Clog!]!
    trendingClogs: [Clog!]!
    recentlyClogs: [Clog!]!
    editors: [Editor!]!
  }

  type Query {
    trendingClogs(category: Category): [Clog!]!
    recommendedClog: Clog!
    favoriteTags: [Tag!]!
    heroBanners: [Clog!]!
    categoryDetail(category: Category!): CategoryDetail!
    getClogs: [Clog!]!
    getClog: Clog!
  }
`;

export default schema;