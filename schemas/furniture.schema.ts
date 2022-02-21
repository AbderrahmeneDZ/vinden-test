import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { positionType } from "./common.schema";

const furnitureItemType = new GraphQLObjectType({
  name: "FurnitureItem",
  fields: () => ({
    id: { type: GraphQLString },
    space: { type: GraphQLInt },
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
    length: { type: GraphQLInt },
  }),
});

const furniturePositionType = new GraphQLObjectType({
  name: "FurnitureItemPosition",
  fields: () => ({
    truckId: { type: GraphQLString },
    item: { type: furnitureItemType },
    level: { type: GraphQLInt },
    position: { type: positionType },
  }),
});

export { furnitureItemType, furniturePositionType };
