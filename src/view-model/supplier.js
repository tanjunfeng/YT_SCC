// /**
//  * @file supplier.js
//  * @author Tanjf
//  * 
//  * 供应商修改前修改后的信息
//  */
// class ViewModel {
//     getObject(type, oldValue, newValue) {
//         return {
//             type,
//             old: oldValue,
//             new: newValue
//         }
//     }
//     const aaa = {
//         supplierBasicInfo: {
//             companyName: 'gonsi ming'
//         }
//     }

//     const keys = Object.keys(before);
//     const result = [];
//     for (let i of keys) {
//         const beforeItem = before[i];
//         const afterItem = after[i];
//         const names = aaa[i];
//         const childKeys = Object.keys(i);
//         for (let j of childKeys) {
//             const a = {
//                 name: names[j],
//                 after: afterItem[j],
//                 before: begoreItem[j]
//             }
//             result.push(a);
//         }
//     }

//     toJson() {
//         return this.result;
//     }
// }

// export default (data) => new ViewModel(data).toJson();
