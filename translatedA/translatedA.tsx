import React, { useEffect, useRef } from 'react'
// import TablePage from '@/components/Page/TablePage'
import { PlusOutlined } from '@ant-design/icons'
import _ from 'lodash'
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table'
import { Table, Tag, Space, Button, Select, Divider, Popover } from 'antd'
import { getArticles } from '@/services/translatorApi'
import { useRequest } from '@umijs/hooks'
import request from 'umi-request'

import moment from 'moment'
import { render } from 'react-dom'
moment.locale('en')
import { Link } from 'umi'
import QueryForm from '@/components/Form/QueryForm'
// export default function() {
//   let { data, error, loading } = useRequest(() =>
//     getArticles({
//       language: 'en',
const { Option } = Select
interface GithubIssueItem {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: Label[]
  state: string
  locked: boolean
  assignee?: any
  assignees: any[]
  milestone?: any
  comments: number
  created_at: string
  updated_at: string
  closed_at?: any
  author_association: string
  body: string
}
interface Label {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string
}
interface User {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}
const columns: ProColumns<any>[] = [
  {
    title: 'Number',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: 'Title',
    dataIndex: 'originTitle',
    copyable: true,
    ellipsis: true,
    rules: [
      {
        required: true,
        message: 'required',
      },
    ],

    hideInSearch: true,
  },
  {
    title: 'Original Language',
    dataIndex: 'originalLanguage',
    valueType: 'text',
    key: 'langFilter',
    // hideInSearch: true,
    renderFormItem: (items, props) => {
      return (
        <Select placeholder="Select Language to Filter">
          <Option value="en">English</Option>
          <Option value="pt">Portuguese</Option>
          <Option value="zh-TW">Traditional Chinese</Option>
          <Option value="zh-CN">Simplified Chinese</Option>
        </Select>
      )
    },
    render: d => {
      var lang = 'loading'

      if (d == 'pt') {
        lang = 'Portuguese'
      }
      if (d == 'en') {
        lang = 'English'
      }
      if (d == 'zh-TW') {
        lang = 'Traditional Chinese'
      }
      if (d == 'zh-CN') {
        lang = 'Simplified Chinese'
      }
      return <div>{lang}</div>
    },
  },

  {
    title: 'Published Date',
    key: 'since',
    dataIndex: 'publishedDate',
    valueType: 'dateRange',

    width: '20%',
    render: text => moment(text).format('YYYY-MM-DD'),
  },
  {
    title: 'Status',
    dataIndex: 'editings',
    valueType: 'text',
    hideInSearch: true,
    render: (text, d) => {
      var engStatus = 'red'
      var tradCNStatus = 'red'
      var simpCNStatus = 'red'
      var portStatus = 'red'
      var engEditor
      var tradEditor
      var simpEditor
      var portEditor
      if (d.editings.length != 0) {
        for (var i = 0; i < d.editings.length; i++) {
          if (d.editings[i].status == 'editing') {
            if (d.editings[i].editLanguage == 'en') {
              engStatus = 'gold'
              engEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'zh-TW') {
              tradCNStatus = 'gold'
              tradEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'zh-CN') {
              simpCNStatus = 'gold'
              simpEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'pt') {
              portStatus = 'gold'
              portEditor = d.editings[i].editorName
            }
          } else if (d.editings[i].status == 'published') {
            if (d.editings[i].editLanguage == 'en') {
              engStatus = 'green'
              engEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'zh-TW') {
              tradCNStatus = 'green'
              tradEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'zh-CN') {
              simpCNStatus = 'green'
              simpEditor = d.editings[i].editorName
            }
            if (d.editings[i].editLanguage == 'pt') {
              portStatus = 'green'
              portEditor = d.editings[i].editorName
            }
          }
        }
      }
      if (d.originalLanguage == 'pt') {
        portStatus = '#A1A7A6'
      } else if (d.originalLanguage == 'zh-TW') {
        tradCNStatus = '#A1A7A6'
      } else if (d.originalLanguage == 'zh-CN') {
        simpCNStatus = '#A1A7A6'
      } else if (d.originalLanguage == 'en') {
        engStatus = '#A1A7A6'
      }
      return (
        <div>
          <div>
            <Popover content={engEditor} title="Editor">
              <Tag color={engStatus}>English</Tag>
            </Popover>
            <Popover content={tradEditor} title="Editor">
              <Tag color={tradCNStatus}>Traditional Chinese</Tag>
            </Popover>
            <Popover content={simpEditor} title="Editor">
              <Tag color={simpCNStatus}>Simplified Chinese</Tag>
            </Popover>
            <Popover content={portEditor} title="Editor">
              <Tag color={portStatus}>Portuguese</Tag>
            </Popover>
          </div>
        </div>
      )
    },
  },

  {
    title: 'Edit',
    valueType: 'option',
    render: (text, row, _, action) => [
      <Button key="3" type="primary">
        <Link to={`translatedB?id=${row.originId}`}>Edit Article</Link>
      </Button>,
    ],
  },
  {
    title: 'originId',
    dataIndex: 'originId',
    valueType: 'text',
    hideInTable: true,
    hideInSearch: true,
  },
]
export default () => {
  const actionRef = useRef<ActionType>()
  return (
    <div
      style={{
        background: '#f5f5f5',
        margin: -24,
        padding: 24,
      }}
    >
      <ProTable<GithubIssueItem>
        columns={columns}
        pagination={{
          showQuickJumper: true,
        }}
        actionRef={actionRef}
        request={async (params: any, sorter, filter) => {
          console.log(params, 'hi')
          const data = await getArticles({
            since: params.since,
            langFilter: params.langFilter,
            accessToken: localStorage.access_token,
          })
          return {
            data,
            total: data.length,
          }
        }}
        rowKey="id"
        dateFormatter="string"
        headerTitle="Articles"
      />
    </div>
  )
}
