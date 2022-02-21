import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema,
} from "graphql";
import { categories } from "../interface/truck-category.interface";
import { furniturePositionType } from "./furniture.schema";
import {
  selectedTruckCategoryType,
  categoryType,
} from "./truck-category.schema";
import calculatePositions from "../utils/calculate-positions.utils";

const furnitureOrderType = new GraphQLObjectType({
  name: "FurnitureOrderType",
  fields: () => ({
    furnitureOrder: { type: new GraphQLList(furniturePositionType) },
    truckCategories: { type: new GraphQLList(selectedTruckCategoryType) },
  }),
});

const EstimateCategoriesType = new GraphQLInputObjectType({
  name: "FurnitureInputItemsType",
  fields: () => ({
    items: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: "FurnitureInputItemType",
          fields: () => ({
            height: { type: GraphQLInt },
            width: { type: GraphQLInt },
            length: { type: GraphQLInt },
          }),
        })
      ),
    },
  }),
});

const query = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getCategories: {
      type: new GraphQLList(categoryType),
      args: {
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        return categories;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    estimateCategories: {
      type: furnitureOrderType,
      args: {
        input: { type: new GraphQLNonNull(EstimateCategoriesType) },
      },
      resolve(parent, args) {
        const result = calculatePositions(args.input.items);
        console.log(result.selectedCategories[0]);
        return {
          furnitureOrder: result.furniturePositions,
          truckCategories: result.selectedCategories,
        };
      },
    },
  },
});

const schema = new GraphQLSchema({ query, mutation });
export { schema };
