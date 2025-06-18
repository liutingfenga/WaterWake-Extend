// 检查ECharts是否正确加载
if (typeof echarts === 'undefined') {
  console.error('ECharts库未加载！请检查网络连接或脚本引用。');
}

// 初始化图表
let waterChart = null;

// 更新图表显示
function updateChart() {
  console.log('开始更新图表...');
  waterDB.getRecentWaterRecords(7).then(dailyTotals => {
    console.log('获取到的饮水记录数据:', dailyTotals);
    // 准备图表数据
    const dates = [];
    const amounts = [];
    
    // 按日期排序（从旧到新）
    const sortedDates = Object.keys(dailyTotals).sort();
    console.log('排序后的日期:', sortedDates);
    
    sortedDates.forEach(date => {
      // 格式化日期显示（MM-DD）
      const [year, month, day] = date.split('-');
      const formattedDate = `${month}-${day}`;
      
      dates.push(formattedDate);
      amounts.push(dailyTotals[date]);
    });
    
    console.log('处理后的日期数组:', dates);
    console.log('处理后的数量数组:', amounts);
    
    // 初始化或更新图表
    const chartContainer = document.getElementById('chart-container');
    
    if (!chartContainer) {
      console.error('找不到图表容器元素!');
      return;
    }
    
    console.log('图表容器尺寸:', chartContainer.offsetWidth, chartContainer.offsetHeight);
    
    try {
      if (!waterChart) {
        console.log('初始化新图表...');
        waterChart = echarts.init(chartContainer);
      }
      
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} ml'
        },
        grid: {
          left: '5%',  // 增加左侧留白，为y轴数值提供更多空间
          right: '5%',
          bottom: '1%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          name: 'ml',
          nameTextStyle: {
            fontSize: 10,
            padding: [0, 0, 0, 10]  // 调整单位标签位置
          },
          axisLabel: {
            fontSize: 10,
            margin: 10,  // 增加标签与轴线的距离
            formatter: function(value) {
              // 对于大于等于1000的值，显示为k单位
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k';
              }
              return value;
            }
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          }
        },
        series: [{
          data: amounts,
          type: 'bar',
          itemStyle: {
            color: function(params) {
              // 根据饮水量设置不同颜色
              const value = params.value;
              if (value < 500) return '#ff6b6b'; // 红色（不足）
              if (value < 1500) return '#feca57'; // 黄色（一般）
              return '#1dd1a1'; // 绿色（良好）
            }
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      };
      
      console.log('设置图表选项...');
      waterChart.setOption(option);
      console.log('图表更新完成');
    } catch (error) {
      console.error('图表渲染错误:', error);
    }
  }).catch(error => {
    console.error('获取饮水记录失败:', error);
  });
}

// 窗口大小变化时重绘图表
window.addEventListener('resize', () => {
  if (waterChart) {
    try {
      waterChart.resize();
    } catch (error) {
      console.error('图表重绘错误:', error);
    }
  }
});

// 确保图表容器可见后再初始化图表
function ensureChartRendered() {
  const chartContainer = document.getElementById('chart-container');
  const recordsContent = document.getElementById('records-content');
  
  // 只有当记录内容区域不是隐藏状态时才渲染图表
  if (chartContainer && !recordsContent.classList.contains('hidden') && 
      chartContainer.offsetWidth > 0 && chartContainer.offsetHeight > 0) {
    if (waterChart) {
      waterChart.resize();
    } else {
      updateChart();
    }
  }
}

// 导出函数供其他模块使用
window.updateChart = updateChart;
window.ensureChartRendered = ensureChartRendered;