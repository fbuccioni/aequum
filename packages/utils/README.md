aequum util functions collection
================================

A collection of utility functions to use as you want.

Functions
---------

#### [`data` workspace](https://github.com/fbuccioni/aequum/blob/main/packages/utils/data.util.ts)

- `hidePasswords`: Hides password fields in an object, replacing them with asterisks.
- `updateObjectByDotNotation`: Updates an object by a dot notation path, creating nested objects if necessary.
- `mergeDeep`: Merges two objects deeply, allowing for nested properties to be combined.
- `isClass`: Checks if a value is a class (constructor function).
- `isClassInstance`: Checks if a value is an instance of a class.


#### [`env` workspace](https://github.com/fbuccioni/aequum/blob/main/packages/utils/env.util.ts)

- `load`: Loads environment variables from a `.env` file, via [`dotenv` package](https://www.npmjs.com/package/dotenv).
- `asBoolean`: Converts a string to a boolean value, handling common truthy and falsy values.
- `asArray`: Converts a string to an array, separated by commas and trimming whitespace.
- `asInteger`: Converts a string to an integer, returning `undefined` if `NaN` to use with `||` operator.


#### [`func` workspace](https://github.com/fbuccioni/aequum/blob/main/packages/utils/func.util.ts)

- `isAsync`: Checks if a function is asynchronous.


#### [`math` workspace](https://github.com/fbuccioni/aequum/blob/main/packages/utils/math.util.ts)

- `naiveRound`: Naively rounds a number to a specified number of decimal places.


#### [`string` workspace](https://github.com/fbuccioni/aequum/blob/main/packages/utils/string.util.ts)

- `capitalize`: Capitalizes the first letter of a string.
