import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined, FontSizeOutlined, LeftOutlined } from '@ant-design/icons'
import _ from 'lodash'
import {
  Row,
  Col,
  Card,
  Spin,
  Button,
  Input,
  message,
  Modal,
  Form,
  Checkbox,
  Cascader,
  Select,
  Divider,
} from 'antd'
const { TextArea } = Input
import { getArticles, editTranslation } from '@/services/translatorApi'
import { useRequest } from '@umijs/hooks'
import request from 'umi-request'
import { render } from 'react-dom'
import {
  useLocation,
  useDispatch,
  useSelector,
  useHistory,
  useIntl,
  Link,
} from 'umi'
import FooterToolbar from '@/components/FooterToolbar'
import Editor from '@/components/Editor'
import { publishArticles } from '@/services/publishApi'
export default function() {
  const location = useLocation()
  const [lang, setLang] = useState()
  const [tranId, setId] = useState()
  const [firstLang, setFL] = useState(false)
  const [finish, setFinish] = useState(false)

  const { Option } = Select
  const { Meta } = Card
  //   console.log(location.query.id, 'hello')

  let { data, run: runFetch, loading } = useRequest(
    (params: any) => getArticles(params),
    {
      defaultParams: [
        {
          rowId: location.query.id,
        },
      ],
    },
  )

  let { run: runEdit } = useRequest(data => editTranslation(data), {
    manual: true,
    onSuccess: () => {
      message.success('Edited successfully')
    },
  })

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  }
  const tailLayout = {
    wrapperCol: { offset: 3, span: 16 },
  }

  const onFinish = values => {
    // add
    if (!lang) {
      console.log('nomegalul')
      alert('please select a language first')
    } else if (finish == true) {
      // console.log(values, 'ddddddddddddddddddddddddddddddddddddddddddddd')
      
      runEdit({
        editContent: values.content,
        editExcerpt: values.excerpt,
        editTitle: values.title,
        editLanguage: lang,
        status: 'published',
        originId: tranId,
        //change how the status works later..}
      })
      setFinish(false)
      // var pubData = {
      //   title: values.title,
      //   content: values.content,
      //   excerpt: values.excerpt,
      // }
      // //maybe send what language it is too
      // console.log(pubData, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
      // publishArticles(pubData)
    } else {
      // console.log('Success:', values.content)

      runEdit({
        editContent: values.content,
        editExcerpt: values.excerpt,
        editTitle: values.title,
        editLanguage: lang,
        status: 'editing',
        originId: tranId,
        //change how the status works later..}
      })
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('editing', errorInfo)
  }
  const onLanguageChange = value => {
    // console.log(value) // value shows language code
    runFetch({
      rowId: location.query.id,
      language: value,
    })
    setId(location.query.id)
    setLang(value)
  }

  const onPublish = values => {
    setFinish(true)
    // values.status = 'published'
    // put all data into a variable and return it
  }

  const langListStyle = {
    margin: '25px 25px 45px 25px',
  }
  const sourceTitleStyle = {
    margin: '0px 0px 32px 10px',
  }
  const sourceExceprtStyle = {
    margin: '0px 0px 20px 10px',
  }
  const sourceContentStyle = {
    margin: '0px 0px 0px 10px',
  }

  data = _.get(data, '[0]')
  console.log(data, 'meow')
  // console.log(data)

  return (
    <div>
      <div style={langListStyle}>
        {/* <Form.Item name="language" label="Translation List"> */}
        <span>Translation List:</span>
        <Select
          placeholder="Select the language for translation"
          onChange={onLanguageChange}
          value={lang}
          allowClear
          style={{ width: '100%' }}
        >
          <Option value="en">English</Option>
          <Option value="pt">Portuguese</Option>
          <Option value="zh-TW">Traditional Chinese</Option>
          <Option value="zh-CN">Simplified Chinese</Option>
        </Select>
        {/* </Form.Item> */}
      </div>
      {(loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '30px 50px',
          }}
        >
          <Spin></Spin>
        </div>
      )) || (
        <div>
          <Row>
            <Col span={12}>
              <Card style={sourceTitleStyle}>
                {/* <Meta title="Original Title" description={data.originTitle} /> */}
                <div
                  dangerouslySetInnerHTML={{ __html: data.originTitle }}
                ></div>
              </Card>
              ,
              <Card style={sourceExceprtStyle}>
                {/* <Meta title="Original Excerpt" description={data.originExcerpt} /> */}
                <div
                  dangerouslySetInnerHTML={{ __html: data.originExcerpt }}
                ></div>
              </Card>
              ,
              <Card style={sourceContentStyle}>
                {/* <Meta title="Original Content" description={data.originContent} /> */}
                <div
                  dangerouslySetInnerHTML={{ __html: data.originContent }}
                ></div>
              </Card>
            </Col>
            <Col span={12}>
              <Form
                {...layout}
                name="basic"
                initialValues={data}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // style={{ width: 1750, height: 20000 }}
              >
                {/* <Form.Item name="language" label="Languages">
                <Select
                  placeholder="Select the language for translation"
                  onChange={onLanguageChange}
                  // value={lang}
                  allowClear
                >
                  <Option value="en">English</Option>
                  <Option value="pt">Portuguese</Option>
                  <Option value="zh-TW">Traditional Chinese</Option>
                  <Option value="zh-CN">Simplified Chinese</Option>
                </Select>
              </Form.Item> */}

                <Form.Item label="title" name="title">
                  {/* <Editor height="40"></Editor> */}
                  <TextArea rows={4}></TextArea>
                </Form.Item>

                <Form.Item label="excerpt" name="excerpt">
                  {/* <Editor height="125"></Editor> */}
                  <TextArea rows={4}></TextArea>
                </Form.Item>

                <Form.Item
                  label="content"
                  name="content"
                  valuePropName="content"
                >
                  <Editor height="1500"></Editor>
                </Form.Item>

                {/* <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>{' '}
                  <Button
                    type="primary"
                    onClick={onPublish}
                    style={{
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                    }}
                  >
                    Publish
                  </Button>
                </Form.Item> */}
                <FooterToolbar
                  extra={
                    <span>
                      <Link to="/">
                        <LeftOutlined /> Back
                      </Link>
                    </span>
                  }
                >
                  <>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>{' '}
                    <Button
                      type="primary"
                      onClick={onPublish}
                      htmlType="submit"
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                      }}
                    >
                      Publish
                    </Button>
                  </>
                </FooterToolbar>
              </Form>
            </Col>
          </Row>
        </div>
      )}
      <br></br>
      <br></br>
    </div>
  )
}
// {
//   /* <Form.Item label="language">
//           <Cascader
//             onChange{onLanguageChange}
//             options={[
//               {
//                 value: 'en',
//                 label: 'English',
//               },
//               {
//                 value: 'pt',
//                 label: 'Portuguese',
//               },
//               {
//                 value: 'zh-TW',
//                 label: 'Traditional Chinese',
//               },
//               {
//                 value: 'zh-CN',
//                 label: 'Simplified Chinese',
//               },
//             ]}
//           />
//         </Form.Item> */
// }
