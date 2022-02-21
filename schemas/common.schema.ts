import { GraphQLObjectType, GraphQLInt } from "graphql";

const positionType = new GraphQLObjectType({
  name: "Position",
  fields: () => ({
    x0: { type: GraphQLInt },
    y0: { type: GraphQLInt },
    x1: { type: GraphQLInt },
    y1: { type: GraphQLInt },
  }),
});

const dimensionType = new GraphQLObjectType({
  name: "Dimension",
  fields: () => ({
    height: { type: GraphQLInt },
    width: { type: GraphQLInt },
    length: { type: GraphQLInt },
  }),
});

export { positionType, dimensionType };
