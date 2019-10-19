const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

const DB = require('../src/utils/db');
const calculatePrice = require('../src/helpers/calculatePrice');

const convertionType = new GraphQLObjectType({
  name: 'Conversion',
  description: 'The buying or selling rate',
  fields: () => ({
    id: { type: GraphQLInt },
    rate: { type: GraphQLFloat },
    date: { type: GraphQLString },
    type: { type: GraphQLString }
  })
});

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'root query',
  fields: {
    conversionHistory: {
      type: GraphQLList(convertionType),
      description: 'gets all transaction history',
      resolve: () => DB
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'root mutation',
  fields: {
    calculatePrice: {
      type: convertionType,
      description: 'calculates the buying or selling rate in Naira',
      args: {
        type: { type: GraphQLNonNull(GraphQLString) },
        margin: { type: GraphQLNonNull(GraphQLFloat) },
        exchangeRate: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (_source, args) => calculatePrice(args)
    }
  }
});

const schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
