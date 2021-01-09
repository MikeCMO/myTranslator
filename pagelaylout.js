var TradOrSimp = require("traditional-or-simplified");
var franc = require("franc");

console.log(TradOrSimp.isSimplified("w"));
// return (
//   <div>
//     {
//       <Row justify="space-around">
//         <Col span={11}>
//           <Card>
//             <h1>{data.originTitle}</h1>
//             <hr />
//             <div
//               style={{ height: '250px', overflowY: 'scroll' }}
//               className="post-content"
//               dangerouslySetInnerHTML={{
//                 __html: data.originExcerpt,
//               }}
//             ></div>
//             <hr />
//             <div
//               style={{ height: '550px', overflowY: 'scroll' }}
//               className="post-content"
//               dangerouslySetInnerHTML={{
//                 __html: data.originContent,
//               }}
//             ></div>
//           </Card>
//         </Col>
//         <Col span={11}>
//           <Card>
//             <Input
//               value={data.title}
//               onChange={e =>
//                 dispatch({
//                   type: 'post/set',
//                   path: 'data.title',
//                   value: e.target.value,
//                 })
//               }
//             ></Input>
//             <hr />
//             <div style={{ height: '250px' }}>
//               <Editor
//                 content={data.excerpt}
//                 onChange={e => console.log(e.target)}
//               ></Editor>
//             </div>
//             <hr />
//             <div style={{ height: '550px' }}>
//               <Editor content={data.content}></Editor>
//             </div>
//             {/* <div
//               className="post-content"
//               dangerouslySetInnerHTML={{
//                 __html: data.content,
//               }}
//             ></div> */}
//           </Card>
//         </Col>
//       </Row>
//     }
//     <br />
//     <br />
//     <br />
//   </div>
// )
// console.log(originId, "poggy woggy");

// if (since) {
//   if (originId) {
//     const data = await Translate.find({ originId });

//     return data;
//   } else {
//     const data = await Translate.find({
//       publishedDate: {
//         $gte: since[0],
//         $lte: since[1],
//       },
//     });

//     return data;
//   }
// } else {
//   if (originId) {
//     console.log("originId", originId);
//     const data = await Translate.find({ originId });
//     console.log(originId, data);
//     return data;
//   } else {
//     const data = await Translate.find({});

//     return data;
//   }
// }

// {
//   title: 'Status',
//   dataIndex: 'status',
//   initialValue: 'all',
//   filters: true,
//   hideInSearch: true,
//   key: 'status',
//   valueEnum: {
//     all: { text: 'All', status: 'Default' },
//     open: {
//       text: '未解决',
//       status: 'Error',
//     },
//     // closed: {
//     //   text: '已解决',
//     //   status: 'Success',
//     // },
//     // processing: {
//     //   text: '解决中',
//     //   status: 'Processing',
//     // },
//     published: {
//       text: 'published',
//       status: 'published',
//     },
//     editing: {
//       text: 'editing',
//       status: 'editing',
//     },
//     unedited: {
//       text: 'unedited',
//       status: 'unedited',
//     },
//   },
//   width: '10%',
// },

// title: async (d, { to }) => {
//   if (to == "english") {
//     const translation = await translate({
//       text: d.title,
//       source: "pt",
//       target: "en",
//     });
//     // console.log(d.originalLanguage);
//     console.log(translation.sentences[0].trans);
//     return translation.sentences[0].trans;
//   } else {
//     return d.title;
//   }
// },
// text: async (d, { to }) => {},
