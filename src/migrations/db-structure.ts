// type PropertyType =
//   | 'title'
//   | 'number'
//   | 'checkbox'
//   | 'created_time'
//   | 'last_edited_time'
//   | 'rich_text';
//
// interface Property {
//   type: PropertyType;
//   title: [];
//   // Add other properties specific to each type if needed
// }
//
// interface DatabaseStructure {
//   [tableName: string]: {
//     properties: {
//       [propertyName: string]: Property;
//     };
//   };
// }

export const dbStructure = {
  test: {
    properties: {
      // title: {
      //   type: 'title',
      // },
      count: {
        type: 'number',
        number: 0,
      },
    },
  },
  // task: {
  //   properties: {
  //     title: {
  //       type: 'title',
  //       title: {},
  //     },
  //
  //     userId: {
  //       type: 'number',
  //       number: 0,
  //     },
  //     memo: {
  //       type: 'rich_text',
  //       rich_text: [
  //         {
  //           plain_text: '',
  //         },
  //       ],
  //     },
  //     actAttempts: {
  //       type: 'number',
  //       number: 0,
  //     },
  //     estAttempts: {
  //       type: 'number',
  //       number: 1,
  //     },
  //     isFinished: {
  //       type: 'checkbox',
  //       checkbox: false,
  //     },
  //     isArchived: {
  //       type: 'checkbox',
  //       checkbox: false,
  //     },
  //     isCurrentTask: {
  //       type: 'checkbox',
  //       checkbox: false,
  //     },
  //     createdAt: {
  //       type: 'created_time',
  //       created_time: '',
  //     },
  //     updatedAt: {
  //       type: 'last_edited_time',
  //       last_edited_time: '',
  //     },
  //   },
  // },
};
