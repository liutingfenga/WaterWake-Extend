document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const progressBar = document.getElementById('progress');
  const currentAmountEl = document.getElementById('current-amount');
  const targetAmountEl = document.getElementById('target-amount');
  const waterButtons = document.querySelectorAll('.water-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const toggleRecordsBtn = document.getElementById('toggle-records');
  const recordsContent = document.getElementById('records-content');
  const toggleBenefitsBtn = document.getElementById('toggle-benefits');
  const benefitsContent = document.getElementById('benefits-content');
  
  // 创建礼花效果实例
  const confettiEffect = new ConfettiEffect();
  
  // 记录是否已经显示过今日的庆祝效果
  let celebrationShown = false;
  
  // 从存储中获取今日是否已显示过庆祝效果
  chrome.storage.local.get(['celebrationDate'], (result) => {
    const today = new Date().toISOString().split('T')[0];
    if (result.celebrationDate === today) {
      celebrationShown = true;
    }
  });
  
  // 更新进度条和饮水量显示
  function updateProgress() {
    Promise.all([
      waterDB.getTodayTotalAmount(),
      waterDB.getSettings()
    ]).then(([currentAmount, settings]) => {
      const targetAmount = settings ? settings.targetAmount : 2000;
      
      // 更新显示
      currentAmountEl.textContent = currentAmount;
      targetAmountEl.textContent = targetAmount;
      
      // 计算进度百分比（最大100%）
      const percentage = Math.min(100, (currentAmount / targetAmount) * 100);
      progressBar.style.width = `${percentage}%`;
      
      // 检查是否达到目标并且今日尚未显示过庆祝效果
      if (currentAmount >= targetAmount && !celebrationShown) {
        // 播放礼花效果
        confettiEffect.play();
        
        // 标记今日已显示过庆祝效果
        celebrationShown = true;
        const today = new Date().toISOString().split('T')[0];
        chrome.storage.local.set({ celebrationDate: today });
      }
      
      // 更新图表
      if (typeof updateChart === 'function') {
        updateChart();
      } else {
        console.error('updateChart函数未定义');
      }
      
      // 更新自定义饮水量按钮
      updateCustomWaterButton(settings);
    });
  }
  
  // 更新自定义饮水量按钮
  function updateCustomWaterButton(settings) {
    // 检查是否已存在自定义按钮
    let customButton = document.querySelector('.water-btn[data-custom="true"]');
    
    // 如果没有自定义按钮，创建一个
    if (!customButton) {
      customButton = document.createElement('button');
      customButton.classList.add('water-btn');
      customButton.setAttribute('data-custom', 'true');
      
      // 添加点击事件
      customButton.addEventListener('click', () => {
        const amount = parseInt(customButton.dataset.amount);
        addWaterRecord(amount);
      });
      
      // 将按钮添加到容器中
      document.querySelector('.water-buttons').appendChild(customButton);
    }
    
    // 设置自定义按钮的数值
    const customAmount = settings && settings.customWaterAmount ? settings.customWaterAmount : 200;
    customButton.textContent = `${customAmount}ml`;
    customButton.dataset.amount = customAmount;
  }
  
  // 添加饮水记录
  function addWaterRecord(amount) {
    waterDB.addWaterRecord(amount).then(() => {
      updateProgress();
    }).catch(error => {
      console.error('添加饮水记录失败:', error);
    });
  }
  
  // 绑定按钮点击事件
  waterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const amount = parseInt(button.dataset.amount);
      addWaterRecord(amount);
    });
  });
  
  // 绑定设置按钮点击事件
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // 绑定记录展开/收起按钮点击事件
  toggleRecordsBtn.addEventListener('click', () => {
    recordsContent.classList.toggle('hidden');
    
    if (recordsContent.classList.contains('hidden')) {
      toggleRecordsBtn.textContent = '展开';
    } else {
      toggleRecordsBtn.textContent = '收起';
      // 当展开时，确保图表正确渲染
      setTimeout(() => {
        if (typeof ensureChartRendered === 'function') {
          ensureChartRendered();
        }
      }, 300); // 等待过渡动画完成
    }
  });
  
  // 绑定喝水有益展开/收起按钮点击事件
  toggleBenefitsBtn.addEventListener('click', () => {
    benefitsContent.classList.toggle('hidden');
    
    if (benefitsContent.classList.contains('hidden')) {
      toggleBenefitsBtn.textContent = '展开';
    } else {
      toggleBenefitsBtn.textContent = '收起';
    }
  });
  
  // 确保图表容器已加载并可见后再初始化图表
  setTimeout(() => {
    if (typeof ensureChartRendered === 'function') {
      ensureChartRendered();
    }
  }, 500);
  
  // 初始化
  updateProgress();
  
  // 不再自动初始化图表，只在用户点击展开时初始化
});