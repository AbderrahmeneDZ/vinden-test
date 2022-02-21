# Positioning items inside vending truck

#### solution :

This application helps users to find an optimistic way to optimize boxes with variety of dimensions inside a volume (truck), the app takes a list of items defined by height, width and length and returns how many trucks you need to transport the furniture and how to organize it in a volume.<br>
The calculation algorithm start by selecting a category (a category is a classification of truck types by there capacity), for that, we select the category that theoretically can hold all the items in it's volume, after that we test if we can put the biggest item inside the volume, if it's okay we return the selected category, otherwise we select the category that can hold this item.<br>
Next, we run in a loop, the positioning logic of items, starting from the biggest item to the smallest, we select the space that can hold this item (there is array of available spaces, initially start with the space the selected category), once a space is selected, the chosen space will be removed from the list of availability and we deduce new spaces.<br>
As we consume a space, new spaces is produced, the first one is the top of the item where we can put boxes that has dimensions smaller or equal to this item, so at this moment we will have new space but with a greater level, for example if we positioned an item in the truck surface (**level = 0**), the surface of this item will be new space with **level = 1**
This process will execute repetitively until we position all the items.

#### weaknesses:

The code still need more time to work on it, to ensure better optimization:

1. The first problem in this solution is that this algorithm consider that all items do have a cube shape which is not a case for a sofa for example
2. As human, when a box cannot fit, you will try to find a solution by rotating, so you switch between width and length of the item, or sometime you can rotate the item so the height becomes width or length of the item

I'm sure if you analyse the solution, you can find more

#### testing the solution :

To test the solution, a graphQl is set for, one query (getCategories returns all available categories of trucks) and one mutation (estimateCategories that takes array of items and return estimation of needed categories with the positioning of the items inside)

##### to run the app

1. clone the project
2. run `npm install`
3. run `npm start`

By default, the app is served on port **http://localhost:8080** and to test graphql functions **http://localhost:8080/graphql**

##### getCategories

`query { getCategories{ description dimensions { height width length } space } }`

##### estimateCategories

`mutation { estimateCategories(input: {items: [{width: 60, height: 60, length: 91}, {width: 117, height: 96, length: 124}, {width: 56, height: 31, length: 120}, {width: 90, height: 103, length: 168}, {width: 20, height: 83, length: 137}, {width: 78, height: 46, length: 142}, {width: 78, height: 65, length: 66}, {width: 78, height: 40, length: 23}, {width: 74, height: 112, length: 59}, {width: 88, height: 24, length: 86}, {width: 10, height: 48, length: 163}, {width: 19, height: 70, length: 61}, {width: 85, height: 25, length: 60}, {width: 86, height: 119, length: 169}, {width: 57, height: 100, length: 67}, {width: 97, height: 29, length: 127}, {width: 18, height: 112, length: 45}, {width: 107, height: 100, length: 110}, {width: 83, height: 53, length: 66}, {width: 62, height: 17, length: 94}]}) { furnitureOrder { truckId item { id space width height length } level position { x0 y0 x1 y1 } } truckCategories { description id } } }`
