import React, { Component } from 'react';
import { Button, Card, TextareaItem, InputItem, Toast } from 'antd-mobile';
import './index.scss';

class View extends Component {
  state = {
    mfHasError:false,
    msHasError:false,
    mtHasError:false,
    dfHasError:false,
    dsHasError:false,
    dtHasError:false,
  };
  componentDidMount() {
    // const { props } = this;
    // props.detail(props.params.id);
  }
  onChange = (name, value) => {
    const newValue = value.trim();
    this.props.changeRecord({ [`${name}`]: newValue });
  };
  onScoreChange = (name, type, value) => {
    const newValue = value.trim();
    if (newValue !== '1' && newValue !== '2' && newValue !== '') {
      this.setState({
        [`${type}`]: true,
      });
    } else {
      this.setState({
        [`${type}`]: false,
      });
      this.props.changeRecord({ [`${name}`]: newValue });
      this.props.addScore();
    }
  };
  toList = () => {
    location.href = '/Manage/ShareList';
  };
  necessary = () => {
    const { record } = this.props;
    return (
      record.meritF === ''
      || record.meritScoreF === ''
      || record.defectF === ''
      || record.defectScoreF === ''
    );
  };
  incomplete = () => {
    const { record } = this.props;
    if (record.meritS === '' && record.meritScoreS !== '') {
      return true;
    }
    if (record.meritT === '' && record.meritScoreT !== '') {
      return true;
    }
    if (record.defectS === '' && record.defectScoreS !== '') {
      return true;
    }
    return (record.defectT === '' && record.defectScoreT !== '');
  };
  errorScore = () => {
    const { record } = this.props;
    if (record.meritScoreF !== '' && record.meritScoreF !== '1' && record.meritScoreF !== '2') { return true; }
    if (record.meritScoreS !== '' && record.meritScoreS !== '1' && record.meritScoreS !== '2') { return true; }
    if (record.meritScoreT !== '' && record.meritScoreT !== '1' && record.meritScoreT !== '2') { return true; }
    if (record.defectScoreF !== '' && record.defectScoreF !== '1' && record.defectScoreF !== '2') { return true; }
    if (record.defectScoreS !== '' && record.defectScoreS !== '1' && record.defectScoreS !== '2') { return true; }
    return (record.defectScoreT !== '' && record.defectScoreT !== '1' && record.defectScoreT !== '2');
  };
  submit = () => {
    const { record } = this.props;
    const values = {
      ...record,
      id:this.props.params.id,
    };
    if (this.necessary()) {
      Toast.fail('请将必填项填写完整', 1);
    } else if (record.score < 6 || record.score > 10) {
      Toast.fail('总分不符合规定', 1);
    } else if (this.incomplete()) {
      Toast.fail('不要光填分数', 1);
    } else if (this.errorScore()) {
      Toast.fail('请按要求填写分数', 1);
    } else {
      this.props.submit({ ...values }).then(
        (success) => {
          success && this.toList();
        }
      );
    }
  };
  render() {
    // console.log(this.props.record);
    return (
      <div>
        <Card className="card" style={{ margin:'5px' }}>
          <Card.Header
            title="优点（至少1条，每条加1-2分）"
          />
          <Card.Body>
            <div className="box">
              <TextareaItem
                title="优点1"
                autoHeight
                placeholder="请输入优点，必填"
                onChange={this.onChange.bind(this, 'meritF')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分，必填"
                error={this.state.mfHasError}
                onChange={this.onScoreChange.bind(this, 'meritScoreF', 'mfHasError')}
              >加分</InputItem>
            </div>
            <div className="box">
              <TextareaItem
                title="优点2"
                autoHeight
                placeholder="请输入优点"
                onChange={this.onChange.bind(this, 'meritS')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分"
                error={this.state.msHasError}
                onChange={this.onScoreChange.bind(this, 'meritScoreS', 'msHasError')}
              >加分</InputItem>
            </div>
            <div className="box">
              <TextareaItem
                title="优点3"
                autoHeight
                placeholder="请输入优点"
                onChange={this.onChange.bind(this, 'meritT')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分"
                error={this.state.mtHasError}
                onChange={this.onScoreChange.bind(this, 'meritScoreT', 'mtHasError')}
              >加分</InputItem>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ margin:'5px' }}>
          <Card.Header
            title="缺点（至少1条，每条扣1-2分）"
          />
          <Card.Body>
            <div className="box">
              <TextareaItem
                title="缺点1"
                autoHeight
                placeholder="请输入缺点，必填"
                onChange={this.onChange.bind(this, 'defectF')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分，必填"
                error={this.state.dfHasError}
                onChange={this.onScoreChange.bind(this, 'defectScoreF', 'dfHasError')}
              >减分</InputItem>
            </div>
            <div className="box">
              <TextareaItem
                title="缺点2"
                autoHeight
                placeholder="请输入缺点"
                onChange={this.onChange.bind(this, 'defectS')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分"
                error={this.state.dsHasError}
                onChange={this.onScoreChange.bind(this, 'defectScoreS', 'dsHasError')}
              >减分</InputItem>
            </div>
            <div className="box">
              <TextareaItem
                title="缺点3"
                autoHeight
                placeholder="请输入缺点"
                onChange={this.onChange.bind(this, 'defectT')}
              />
              <InputItem
                type="number"
                clear
                placeholder="请输入评分"
                error={this.state.dtHasError}
                onChange={this.onScoreChange.bind(this, 'defectScoreT', 'dtHasError')}
              >减分</InputItem>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ margin:'5px' }}>
          <Card.Header
            title="其他建议（不增减分数）"
          />
          <Card.Body>
            <TextareaItem
              title="建议1"
              autoHeight
              placeholder="请输入建议"
              onChange={this.onChange.bind(this, 'suggestF')}
            />
            <TextareaItem
              title="建议2"
              autoHeight
              placeholder="请输入建议"
              onChange={this.onChange.bind(this, 'suggestS')}
            />
            <TextareaItem
              title="建议3"
              autoHeight
              placeholder="请输入建议"
              onChange={this.onChange.bind(this, 'suggestT')}
            />
          </Card.Body>
        </Card>
        <div style={{ padding: '10px' }}>
          <span style={{ paddingRight: 10, display: 'inline-block' }}>总分：{this.props.record.score}</span>
          (基础6分,满分10分)
        </div>
        <Button
          type="primary"
          className="to-detail"
          onClick={this.submit.bind(this)}
          style={{ margin:'15px 5px 5px 5px' }}
        >提交</Button>
        <Button
          type="ghost"
          className="to-detail"
          onClick={this.toList.bind(this)}
          style={{ margin:'5px' }}
        >返回</Button>
      </div>
    );
  }
}

export default View;
