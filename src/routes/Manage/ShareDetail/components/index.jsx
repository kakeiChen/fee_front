import React, { Component } from 'react';
import { Tabs, Button, Accordion } from 'antd-mobile';

// const list = [
//   {
//     defect:['缺点1', '缺点2', '缺点3'],
//     merit:[
//       '优点1优点1优点1优点1优点1优点1优点1优点1',
//       '优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1',
//       '优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1优点1',
//     ],
//     suggest:['建议1', '建议1', '建议1'],
//   },
//   {
//     defect:['缺点2'],
//     merit:['优点2'],
//     suggest:['建议2'],
//   },
// ];
// const averageScore = 9;

class View extends Component {
  componentDidMount() {
    const { props } = this;
    props.detail({ id:props.params.id });
  }
  toList = () => {
    location.href = '/Manage/ShareList';
  };
  render() {
    const tabs = [
      { title: '优点' },
      { title: '缺点' },
      { title: '建议' },
    ];
    const { list, averageScore } = this.props;

    return (
      <div>
        <Accordion defaultActiveKey="0" className="my-accordion">
          {
            list.map((item, index) => {
              const title = `观众${index + 1}`;
              const key = `listener-${index}`;
              return (
                <Accordion.Panel header={title} key={key}>
                  <div>
                    <Tabs
                      tabs={tabs}
                      initialPage={1}
                    >
                      <div style={{ padding:'20px' }}>
                        {item.merit.map((merits, meritIndex) => {
                          const meritKey = `merit-${meritIndex}`;
                          return (<div style={{ padding:'5px' }} key={meritKey}>{merits}</div>);
                        })}
                      </div>
                      <div style={{ padding:'20px' }}>
                        {item.defect.map((defects, defectIndex) => {
                          const meritKey = `merit-${defectIndex}`;
                          return (<div style={{ padding:'5px' }} key={meritKey}>{defects}</div>);
                        })}
                      </div>
                      <div style={{ padding:'20px' }}>
                        {item.suggest.map((suggests, suggestIndex) => {
                          const meritKey = `merit-${suggestIndex}`;
                          return (<div style={{ padding:'5px' }} key={meritKey}>{suggests}</div>);
                        })}
                      </div>
                    </Tabs>
                  </div>
                </Accordion.Panel>
              );
            })
          }
        </Accordion>
        <div
          style={{ padding:'10px' }}
        >
          总平均分：{averageScore}</div>
        <Button
          type="primary"
          className="to-detail"
          onClick={this.toList.bind(this)}
        >返回</Button>
      </div>
    );
  }
}

export default View;
