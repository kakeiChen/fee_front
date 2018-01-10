# FE-Charts
> 基于ECharts提供生成图表的options公共方法：getOptions

[项目地址](http://git.ops.com/fe-group/fe-charts)

## Installation

  ```
  npm install local-charts --save
  ```
 
## Upgrade
```
npm update local-charts
``` 

## Usage
```
import { getOptions } from local-charts;
...
const options = getOptions(type, isCloss, data, chartType);
...
```

参数 | 说明 | 类型 | 可选值
:---:|:---:|:---: | :---:
type | 图表类型 | string | 'line'(折线)/'pie'(饼图)
isCross | 是否横屏 | boolean | true/false
data | 布局 | array | 后端返回数据(折线一个，饼图一个) 
chartType | 名称 | string | orderLine（单量）、active（活跃用户）、payments（平台收支）、count（件量）、sign（签单率）、incom(总收入)、outDistribution（总支出），前五个是折线、后两个是拼图
