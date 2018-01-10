import React from 'react';
import { ListView, Button } from 'antd-mobile';
import './style.scss';

// const data = [
//   {
//     id: 1,
//     shareTime:'2018/01/08',
//     description: '这是分享1',
//     title: '题目1',
//     sharer: '分享者1',
//     flag:'未分享',
//   },
//   {
//     id: 2,
//     shareTime:'2018/01/08',
//     description: '这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2',
//     title: '题目2',
//     sharer: '分享者2',
//     flag:'未分享',
//   },
//   {
//     id: 3,
//     shareTime:'2018/01/08',
//     description: '这是分享1',
//     title: '题目1',
//     sharer: '分享者1',
//     flag:'未分享',
//   },
//   {
//     id: 4,
//     shareTime:'2018/01/08',
//     description: '这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2',
//     title: '题目2',
//     sharer: '分享者2',
//     flag:'未分享',
//   },
//   {
//     id: 5,
//     shareTime:'2018/01/08',
//     description: '这是分享1',
//     title: '题目1',
//     sharer: '分享者1',
//     flag:'未分享',
//   },
//   {
//     id: 6,
//     shareTime:'2018/01/08',
//     description: '这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2',
//     title: '题目2',
//     sharer: '分享者2',
//     flag:'未分享',
//   },
//   {
//     id: 7,
//     shareTime:'2018/01/08',
//     description: '这是分享1',
//     title: '题目1',
//     sharer: '分享者1',
//     flag:'未分享',
//   },
//   {
//     id: 8,
//     shareTime:'2018/01/08',
//     description: '这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2这是分享2',
//     title: '题目2',
//     sharer: '分享者2',
//     flag:'未分享',
//   },
// ];

class View extends React.Component {
  componentDidMount() {
    const { props } = this;
    props.search();
  }
  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const detailClick = (id) => {
      location.href = `/Manage/ShareDetail/${id}`;
    };
    const evaluateClick = (id) => {
      location.href = `/Manage/Evaluate/${id}`;
    };
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    const { data } = this.props;

    const state = {
      dataSource: dataSource.cloneWithRows(data),
      isLoading: true,
    };

    const row = (rowData, sectionID, rowID) => (
      <div role="row" tabIndex={rowID} key={rowID} className="row">
        <div className="row-title">
          {rowData.title}
        </div>
        <div className="row-sharer">
          分享人：{rowData.sharer}
        </div>
        <div className="row-description">
          内容简介：{rowData.description}
        </div>
        <div className="row-time">
          {rowData.shareTime}
        </div>
        <div className="button">
          <Button
            type="primary"
            className="to-detail"
            onClick={detailClick.bind(this, rowData.id)}
          >详情</Button>
          {rowData.flag === '未分享' && <Button
            type="primary"
            className="to-evaluate"
            onClick={evaluateClick.bind(this, rowData.id)}
          >评价</Button>}
        </div>
      </div>
    );

    return (
      <ListView
        style={{ flex: 1 }}
        initialListSize={6}
        dataSource={state.dataSource}
        renderRow={row}
        className="am-list"
        pageSize={1}
        useBodyScroll
        scrollRenderAheadDistance={500}
        scrollEventThrottle={200}
      />
    );
  }
}

export default View;
