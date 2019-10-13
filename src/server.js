const express = require('express');
const graphqlHTTP = require('express-graphql');

const app = express();
const port = process.env.PORT || '4000';

app.use(
  '/graphql',
  graphqlHTTP({
    schema: 'schema',
    pretty: true,
    graphiql: true
  })
);

app.listen(port, error => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Listening to requests on port ${port}`);
});
