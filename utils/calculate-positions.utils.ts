import {
  IFurnitureItem,
  IFurnitureItemPosition,
} from "../interface/furniture-item.interface";
import { ISpace } from "../interface/space.interface";
import {
  categories,
  ITruckCategory,
} from "../interface/truck-category.interface";
import { v4 as uniqId } from "uuid";

/**
 * Todo:
 * There are some spaces that have a shared space
 * we should recalculate it when a space is used
 */

const MAX_HEIGHT = Math.max.apply(
  Math,
  categories.map(function (item) {
    return item.dimensions.height;
  })
);
const MAX_WIDTH = Math.max.apply(
  Math,
  categories.map(function (item) {
    return item.dimensions.width;
  })
);
const MAX_LENGTH = Math.max.apply(
  Math,
  categories.map(function (item) {
    return item.dimensions.length;
  })
);

/**
 * This function will return list of categories required to pick up items
 * it will be calculated based on items space and volumes
 */
const selectRequiredTruckCategories = (
  items: IFurnitureItem[]
): ITruckCategory => {
  const totalVolume = items.reduce(
    (prev, curr) => prev + curr.height * curr.space,
    0
  );

  const maxItemHeight = Math.max.apply(
    Math,
    items.map(function (item) {
      return item.height;
    })
  );
  const maxItemWidth = Math.max.apply(
    Math,
    items.map(function (item) {
      return item.width;
    })
  );
  const maxItemLength = Math.max.apply(
    Math,
    items.map(function (item) {
      return item.length;
    })
  );

  // first will try to find the first truck where theoretically  we can put all our items
  let category = categories.find((cat) => cat.volume >= totalVolume);

  /**
   * if there is a category that can hold all the items,
   * we test if the dimension of this truck can fit the biggest item between the boxes
   */
  if (
    category &&
    category.dimensions.height >= maxItemHeight &&
    category.dimensions.width >= maxItemWidth &&
    category.dimensions.length >= maxItemLength
  ) {
    return category;
  }

  /**
   * in case the selected category can't fit the biggest item, we select new one
   */
  category = categories.find(
    (cat) =>
      cat.dimensions.height >= maxItemHeight &&
      cat.dimensions.width >= maxItemWidth &&
      cat.dimensions.length >= maxItemLength
  );
  return {
    ...category,
    id: uniqId(),
  };
};

/**
 * The following code will calculate space and volume of each item
 * and eliminate items that cannot fit in any category
 */
const calculateItemsSpaceAndVolume = (
  items: IFurnitureItem[]
): {
  accepted: IFurnitureItem[];
  rejected: IFurnitureItem[];
} => {
  return {
    accepted: Array.from(items)
      .filter(
        ({ height, width, length }) =>
          height <= MAX_HEIGHT && width <= MAX_WIDTH && length <= MAX_LENGTH
      )
      .map((item) => {
        const { width, length } = item;
        item.id = uniqId();
        item.space = width * length;
        return item;
      })
      .sort((a, b) => b.space * b.height - a.space * a.height),
    // .sort((itemA, itemB) => {
    //   if (itemB.height > itemA.height) {
    //     return 1;
    //   } else if (itemB.height < itemA.height) {
    //     return -1;
    //   } else {
    //     return itemB.space - itemA.space;
    //   }
    // }),
    rejected: Array.from(items).filter(
      ({ height, width, length }) =>
        height > MAX_HEIGHT && width > MAX_WIDTH && length > MAX_HEIGHT
    ),
  };
};

/**
 * calculate new available spaces
 */
const calculateNewSpace = (
  availableSpaces: ISpace[],
  selectedSpace: ISpace,
  item: IFurnitureItem
) => {
  /**
   * when we put a box (item in a position, the top item will be a new space where we can put new items)
   */
  const newSpaces: ISpace[] = [
    {
      id: uniqId(),
      space: item.space,
      height: selectedSpace.height + item.height,
      level: selectedSpace.level + 1,
      position: {
        x0: selectedSpace.position.x0,
        y0: selectedSpace.position.y0,
        x1: item.width,
        y1: item.length,
      },
    },
  ];

  let space =
    (selectedSpace.position.x1 - selectedSpace.position.x0 - item.width) *
    (selectedSpace.position.y1 - selectedSpace.position.y0);
  if (space > 0) {
    newSpaces.push({
      id: uniqId(),
      space:
        (selectedSpace.position.x1 - selectedSpace.position.x0 - item.width) *
        (selectedSpace.position.y1 - selectedSpace.position.y0),
      height: selectedSpace.height,
      level: selectedSpace.level,
      position: {
        x0: selectedSpace.position.x0 + item.width,
        y0: selectedSpace.position.y0,
        x1: selectedSpace.position.x1,
        y1: selectedSpace.position.y1,
      },
    });
  }

  space =
    (selectedSpace.position.x1 - selectedSpace.position.x0) *
    (selectedSpace.position.y1 - selectedSpace.position.y0 - item.length);

  if (space > 0) {
    newSpaces.push({
      id: uniqId(),
      space:
        (selectedSpace.position.x1 - selectedSpace.position.x0) *
        (selectedSpace.position.y1 - selectedSpace.position.y0 - item.length),
      height: selectedSpace.height,
      level: selectedSpace.level,
      position: {
        x0: selectedSpace.position.x0,
        y0: selectedSpace.position.y0 + item.length,
        x1: selectedSpace.position.x1,
        y1: selectedSpace.position.y1,
      },
    });
  }

  /**
   * sort space ascending by level and space
   */
  return [...availableSpaces, ...newSpaces]
    .filter((s) => s.id !== selectedSpace.id)
    .sort((sA, sB) => {
      if (sA.level < sB.level) {
        return 1;
      } else if (sA.level > sB.level) {
        return -1;
      } else {
        return sA.space - sB.space;
      }
    });
};

/**
 * calculate item position
 */
const selectSpaceForItem = (
  item: IFurnitureItem,
  availableSpaces: ISpace[],
  truckCategory: ITruckCategory
): {
  selectedSpace: ISpace;
  positionedItem: IFurnitureItemPosition;
} => {
  const selectedSpace = availableSpaces.find(
    (s) => s.space >= item.space && s.height >= item.height
  );

  if (!selectedSpace!) {
    return null;
  }

  return {
    selectedSpace,
    positionedItem: {
      truckId: truckCategory.id,
      item,
      level: selectedSpace.level,
      position: {
        x0: selectedSpace.position.x0,
        y0: selectedSpace.position.y0,
        x1: item.width,
        y1: item.height,
      },
    },
  };
};

export default (
  items: IFurnitureItem[]
): {
  furniturePositions: IFurnitureItemPosition[];
  selectedCategories: ITruckCategory[];
  availableSpaces: ISpace[];
  rejectedItems: IFurnitureItem[];
} => {
  const { accepted, rejected } = calculateItemsSpaceAndVolume(items);

  const furniturePositions: IFurnitureItemPosition[] = [];
  let availableSpaces: ISpace[] = [];

  const selectedCategories: ITruckCategory[] = [];

  let attempt = 0;
  let length = furniturePositions.length;

  while (furniturePositions.length < accepted.length) {
    const remainingItems: IFurnitureItem[] = accepted.filter(
      (item) =>
        furniturePositions.findIndex((p) => p.item.id === item.id) === -1
    );
    const currentCategory = selectRequiredTruckCategories(remainingItems);

    selectedCategories.push(currentCategory);

    availableSpaces.push({
      id: uniqId(),
      height: currentCategory.dimensions.height,
      space: currentCategory.space,
      level: 0,
      position: currentCategory.position,
    });

    remainingItems.forEach((item) => {
      const result = selectSpaceForItem(item, availableSpaces, currentCategory);

      if (result) {
        const { positionedItem, selectedSpace } = result;

        furniturePositions.push(positionedItem);

        availableSpaces = calculateNewSpace(
          availableSpaces,
          selectedSpace,
          item
        );
      }
    });

    if (furniturePositions.length === length) {
      attempt++;
    } else {
      length = furniturePositions.length;
    }

    if (attempt === 3) {
      break;
    }
  }

  return {
    furniturePositions,
    selectedCategories,
    availableSpaces,
    rejectedItems: rejected,
  };
};
