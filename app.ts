import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schemas";
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.NODE_ENV || 8080;
app.listen(PORT, () => {
  console.log(`app running on http://localhost:${PORT}`);
});
