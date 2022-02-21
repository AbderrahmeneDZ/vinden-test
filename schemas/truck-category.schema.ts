import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { dimensionType, positionType } from "./common.schema";

const categoryType = new GraphQLObjectType({
  name: "TruckCategory",
  fields: () => ({
    description: { type: GraphQLString },
    dimensions: { type: dimensionType },
    position: { type: positionType },
    volume: { type: GraphQLInt },
    space: { type: GraphQLInt },
  }),
});

const selectedTruckCategoryType = new GraphQLObjectType({
  name: "SelectedTruckCategory",
  fields: () => ({
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    dimensions: { type: dimensionType },
    space: { type: GraphQLInt },
  }),
});

export { categoryType, selectedTruckCategoryType };
