/* eslint-disable no-console */
import LinearGradient from 'zrender/lib/graphic/LinearGradient';

const getTime = (resultTime) => {
  const time = {
    year: [],
    date: [],
  };
  resultTime.forEach((item) => {
    const currentTime = `${item.split('-')[1]}/${item.split('-')[2]}`;
    const currentYear = `${item.split('-')[0]}/`;
    time.date.push(currentTime);
    time.year.push(currentYear);
  });
  return time;
};

/*
 * title:标题
 * time: 时间
 * data:
  * {
  * series：createLineSeries方法创建出的series
  * legend：生成的图例数据
  * }
 *
 * */
const createOption = (title, time, data, type) => {
  const option = {
    backgroundColor: '#151E3F',
    textStyle: {
      color: '#8f91a5',
    },
    title: {
      text: `● ${title}`,
      padding: [12, 10, 10, 10],
      textStyle: {
        color: '#86e7ff',
        fontSize: 15,
        align: 'center',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 20, 39, 0.8)',
    },
    legend: {
      right:'0',
      borderRadius: 50,
      padding: [15, 30, 15, 30],
      backgroundColor: '#111d37',
      textStyle: {
        color: '#8f91a5',
      },
      inactiveColor: '#111d37', // 图例关闭时的颜色
      // data: ['邮件营销', '联盟广告'],
      data: data.legend,
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: { // 设置网格颜色
        show: true,
        lineStyle: {
          color: '#174153',
        },
      },
      axisLine: { // 设置横轴颜色
        lineStyle: {
          color: '#174153',
        },
      },
      boundaryGap: false,
      // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: time.date,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#174153',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#174153',
        },
      },
    },
    series: data.series,
  };
  if (type === 'sign') {
    option.yAxis.axisLabel = {
      formatter: '{value}%',
    };
    option.tooltip.formatter = (params) => {
      let result = '';
      params.forEach((item) => {
        if (item.seriesIndex === 0) {
          result += `${item.name}<br />`;
        }
        result += `<span style="display:inline-block;margin-right:5px;
            border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>`;
        result += `<span style="color: ${item.color}">${item.seriesName}</span>`;
        result += `<span style="color: ${item.color};margin-left:4px;">${`${item.data}%`}</span><br />`;
      });

      return result;
    };
  }
  return option;
};
/*
  * data: 数组
  * [{
  * data: 折线数据
  * name: 折线名称
  * color: 折线颜色
  * areaColor1： 区域颜色（上）
  * areaColor2： 区域颜色（下）
  * }]
  * */
const createLineSeries = (data) => {
  const LineData = {
    series: [],
    legend: [],
  };
  data.forEach((item) => {
    LineData.series.push({
      type: 'line',
      name: item.name,
      smooth: true,
      data: item.data,
      areaStyle: {
        normal: {
          color: new LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: item.areaColor1,
          }, {
            offset: 0.8,
            color: item.areaColor2,
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
      itemStyle: {
        normal: {
          color: item.color,
        },
      },
    });
    LineData.legend.push(item.name);
  });
  return LineData;
};
/*
* data: 数组
* [{
* data: 饼状图数据
* totalAmount: 圆心内容
* legend： 图例内容
* color： 饼状图颜色
* tipPosition： 提示tip 位置
* }]
* */
const createPieOption = (title, data, isCross) => {
  const option = {
    backgroundColor: '#151E3F',
    textStyle: {
      color: '#8f91a5',
    },
    tooltip: {
      show: true,
    },
    grid: {
      left: '4%',
      right: '4%',
      containLabel: true,
    },
    legend: {
      orient: 'vertical',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#fff',
      },
      backgroundColor: '#282E46',
      padding: [10, 10, 10, 10],
      borderRadius: 10,
      right: isCross ? '25%' : '20px',
      top: '35%',
      // selectedMode: false,
      inactiveColor: '#151E3F', // 图例关闭时的颜色
      data: data.legend,
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            formatter: data.totalAmount,
            position: 'center',
            color: '#fff',
            fontSize: 18,
            lineHeight: 28,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: data.data.map((item, index) => {
          const resItem = item;
          resItem.tooltip = {
            trigger: 'item',
            formatter: `<div style='max-width: 200px; white-space: normal;'><span style='color: ${data.color[index]}'>
              {b} {c}</span> <span style='color: #6FBCDE'>{d}%</span><br />${item.desc || ''}</div>`,
            position: 'inside',
            textStyle: 'width: 50px',
          };
          return resItem;
        }),
      },
    ],
    color: data.color,
  };
  if (title) {
    option.title = {
      text: `● ${title}`,
      padding: [12, 10, 10, 10],
      textStyle: {
        color: '#86e7ff',
        fontSize: 15,
        align: 'center',
      },
    };
  }
  return option;
};
/*
  * type:图表类型
  * isCross: 是否横屏
  * data: 数据
  * chartType: 表格类型
  * line: orderLine（单量）、active（活跃用户）、payments（平台收支）、count（件量）、sign（签单率）
  * pie: incom(总收入)、outDistribution（总支出）
  * */
const getOptions = (type, isCross, data, chartType) => {
  if (!data || JSON.stringify(data) === '{}') {
    return undefined;
  }
  if (type === 'line') {
    // this.createLine(isCross, data, chartType);
    if (chartType === 'orderLine') { // 单量
      const orderData = [{
        data: data.totalCreateNum,
        name: '创建单量',
        color: '#f7da00',
        areaColor1: 'rgba(247, 218, 0, 0.3)',
        areaColor2: 'rgba(247, 218, 0, 0)',
      }, {
        data: data.totalFinishNum,
        name: '完成单量',
        color: '#7b75ff',
        areaColor1: 'rgba(123, 117, 255, 0.3)',
        areaColor2: 'rgba(123, 117, 255, 0)',
      }];
      const time = getTime(data.date);
      const seriesData = createLineSeries(orderData);
      const options = createOption('单量', time, seriesData);
      return options;
    } else if (chartType === 'active') { // 活跃用户
      const activeData = [{
        data: data.totalSendMerchantNum,
        name: '发单商家数',
        color: '#00e06c',
        areaColor1: 'rgba(0, 224, 108, 0.3)',
        areaColor2: 'rgba(0, 224, 108, 0)',
      }, {
        data: data.totalReceiverRiderNum,
        name: '接单骑手数',
        color: '#fe7578',
        areaColor1: 'rgba(254, 117, 120, 0.3)',
        areaColor2: 'rgba(254, 117, 120, 0)',
      }];
      const time = getTime(data.date);
      const seriesData = createLineSeries(activeData);
      const options = createOption('活跃用户', time, seriesData);
      return options;
    } else if (chartType === 'payments') { // 平台收支
      const paymentsData = [{
        data: data.incomeTotalAmount,
        name: '平台收入',
        color: '#ff8549',
        areaColor1: 'rgba(255, 133, 73, 0.3)',
        areaColor2: 'rgba(255, 133, 73, 0)',
      }, {
        data: data.outcomeTotalAmount,
        name: '平台支出',
        color: '#8f27cb',
        areaColor1: 'rgba(143, 39, 203, 0.3)',
        areaColor2: 'rgba(143, 39, 203, 0)',
      }];
      const time = getTime(data.date);
      const seriesData = createLineSeries(paymentsData);
      const options = createOption('平台收支', time, seriesData);
      return options;
    } else if (chartType === 'count') { // 件量
      const count = [{
        data: data.expressInNum,
        name: '入库量',
        color: '#F7DA00',
        areaColor1: 'rgba(247, 218, 0, 0.3)',
        areaColor2: 'rgba(247, 218, 0, 0)',
      }, {
        data: data.expressSignNum,
        name: '签收量',
        color: '#9789FF',
        areaColor1: 'rgba(123, 117, 255, 0.3)',
        areaColor2: 'rgba(123, 117, 255, 0)',
      }];
      const time = getTime(data.date);
      const seriesData = createLineSeries(count);
      const options = createOption('件量', time, seriesData);
      return options;
    } else if (chartType === 'sign') { // 签单率
      const expressSignPer = data.expressSignPer || [];
      const todayExpressSignPer = data.todayExpressSignPer || [];
      const sign = [{
        data: expressSignPer.map((item) => (item * 100).toFixed(2)),
        name: '操作签收率',
        color: '#00E06C',
        areaColor1: 'rgba(247, 218, 0, 0.3)',
        areaColor2: 'rgba(247, 218, 0, 0)',
      }, {
        data: todayExpressSignPer.map((item) => (item * 100).toFixed(2)),
        name: '当日签收率',
        color: '#FE7578',
        areaColor1: 'rgba(123, 117, 255, 0.3)',
        areaColor2: 'rgba(123, 117, 255, 0)',
      }];
      const time = getTime(data.date);
      const seriesData = createLineSeries(sign);
      const options = createOption('签收率', time, seriesData, chartType);
      return options;
    }
  } else if (type === 'pie') {
    // this.createLine(isCross, data, chartType);
    // this.createPie(isCross, data, chartType);
    if (chartType === 'incom') { // 总收入
      const createData = {
        data: [
          { name: '商家充值', value: data.total.totalRechargeAccount, desc: '商家的订单费用，短信费用，罚款从商家充值里面扣除' },
          { name: '缴纳押金', value: data.total.totalDepositAccount },
          { name: '骑手罚款', value: data.total.totalRiderFineAccount },
        ],
        totalAmount: `${data.total.incomeTotalAmount}\n总收入`,
        legend: [{
          name: '商家充值',
          icon: 'circle',
        }, {
          name: '缴纳押金',
          icon: 'circle',
        }, {
          name: '骑手罚款',
          icon: 'circle',
        }],
        color: ['#83daff', '#8f27cb', '#f7da00'],
      };
      const options = createPieOption('收支分布', createData, isCross);
      return options;
    } else if (chartType === 'outDistribution') {
      const createData = {
        data: [
          { name: '充值满送', value: data.total.totalGiftAccount },
          { name: '骑手提现', value: data.total.totalRiderWithdrawAccount, desc: '包含收入提现和押金提现' },
        ],
        totalAmount: `${data.total.outcomeTotalAmount}\n总支出`,
        legend: [{
          name: '充值满送',
          icon: 'circle',
        }, {
          name: '骑手提现',
          icon: 'circle',
        }],
        color: ['#ee61d5', '#ff9400'],
      };
      const options = createPieOption('', createData, isCross);
      return options;
    }
  }
  return undefined;
};

const initChart = (echarts, id) => {
  const myChart = echarts.init(document.getElementById(id));
  window.addEventListener('resize', () => {
    myChart.resize();
  });
  return myChart;
};

const setOptions = (dom, options) => {
  dom && options && dom.setOption(options);
};

export default getOptions;

export {
  initChart,
  getOptions,
  setOptions,
};
