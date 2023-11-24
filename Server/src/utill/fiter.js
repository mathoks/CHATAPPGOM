// import {flatten} from "flat";

// const filter = (data, searchText) => {
//   var NewList = [];

//   data?.map((element) => {
//     const {
//       about,
//       idx,
//       lastname,
//       firstname,
//       user_id,
//       createdat,
//       city_id,
//       ...rest
//     } = flatten(element);
//     const newString = Object.values(rest).toString().replace(/[',']/g, " ");
//     const newOb = Object.defineProperty(element, "searchField", {
//       value: newString,
//       writable: true,
//       configurable: true,
//     });
//     return NewList.push(newOb);
//   });
//   console.log(NewList)
//   const words = searchText.split(" ");
//   return NewList.filter((list) =>
//     words.every((word) => list.searchField.includes(word))
//   ).sort((a, b) => a.createdat - b.createdat);
// };

// export default filter;

import { flatten } from "flat";

const filter = (data, searchText) => {
  // Use the `map` function to transform the original array
  const filteredData = data.map((element) => {
    const {
      about,
      idx,
      lastname,
      firstname,
      user_id,
      createdat,
      city_id,
      ...rest
    } = flatten(element);

    // Create the new "searchField" property directly
    const searchField = Object.values(rest).toString().replace(/[',']/g, " ");
    
    // Use the object spread operator to create a new object with the "searchField" property
    return { ...element, searchField };
  });

  // Split the search text into words
  const words = searchText.split(" ");

  // remove empty strings

  const filteredArray = words.filter((item) => item !== "");

  // Filter and sort the data
  const filteredAndSortedData = filteredData
    .filter((item) =>
      filteredArray.every((word) => item.searchField.includes(word))
    )
    .sort((a, b) => a.createdat - b.createdat);

  console.log(filteredAndSortedData);

  return filteredAndSortedData;
};

export default filter;
