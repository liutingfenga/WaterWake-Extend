document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const targetAmountInput = document.getElementById('target-amount');
  const reminderEnabledInput = document.getElementById('reminder-enabled');
  const reminderIntervalInput = document.getElementById('reminder-interval');
  const customWaterAmountInput = document.getElementById('custom-water-amount');
  const intervalContainer = document.getElementById('interval-container');
  const clearTodayBtn = document.getElementById('clear-today');
  const clearAllBtn = document.getElementById('clear-all');
  const saveBtn = document.getElementById('save-btn');
  
  // 加载设置
  function loadSettings() {
    waterDB.getSettings().then(settings => {
      if (settings) {
        targetAmountInput.value = settings.targetAmount || 2000;
        reminderEnabledInput.checked = settings.reminderEnabled !== false;
        reminderIntervalInput.value = settings.reminderInterval || 60;
        customWaterAmountInput.value = settings.customWaterAmount || 200;
        
        // 根据是否启用提醒来显示/隐藏间隔设置
        intervalContainer.style.display = reminderEnabledInput.checked ? 'flex' : 'none';
      }
    });
    
    // 同时从chrome.storage获取设置（用于后台脚本）
    chrome.storage.local.get(['reminderInterval', 'reminderEnabled'], (result) => {
      if (result.reminderInterval !== undefined) {
        reminderIntervalInput.value = result.reminderInterval;
      }
      if (result.reminderEnabled !== undefined) {
        reminderEnabledInput.checked = result.reminderEnabled;
      }
    });
  }
  
  // 保存设置
  function saveSettings() {
    const targetAmount = parseInt(targetAmountInput.value) || 2000;
    const reminderEnabled = reminderEnabledInput.checked;
    const reminderInterval = parseInt(reminderIntervalInput.value) || 60;
    const customWaterAmount = parseInt(customWaterAmountInput.value) || 200;
    
    // 保存到IndexedDB
    waterDB.saveSettings({
      id: 'userSettings',
      targetAmount: targetAmount,
      reminderEnabled: reminderEnabled,
      reminderInterval: reminderInterval,
      customWaterAmount: customWaterAmount
    }).then(() => {
      // 同时保存到chrome.storage（用于后台脚本）
      chrome.storage.local.set({
        reminderInterval: reminderInterval,
        reminderEnabled: reminderEnabled,
        customWaterAmount: customWaterAmount
      }, () => {
        // 通知后台脚本更新设置
        chrome.runtime.sendMessage({ action: 'updateSettings' });
        
        // 显示保存成功提示
        alert('设置已保存');
      });
    }).catch(error => {
      console.error('保存设置失败:', error);
      alert('保存设置失败');
    });
  }
  
  // 清除今日数据
  function clearTodayData() {
    if (confirm('确定要清除今日的饮水记录吗？')) {
      const today = new Date().toISOString().split('T')[0];
      
      // 获取今日记录
      waterDB.getWaterRecordsByDate(today).then(records => {
        // 获取数据库连接
        const dbPromise = waterDB.db ? Promise.resolve(waterDB.db) : waterDB.initDB();
        
        dbPromise.then(db => {
          const transaction = db.transaction(['waterRecords'], 'readwrite');
          const store = transaction.objectStore('waterRecords');
          
          // 删除每条记录
          const deletePromises = records.map(record => {
            return new Promise((resolve, reject) => {
              const request = store.delete(record.id);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          });
          
          // 等待所有删除操作完成
          Promise.all(deletePromises).then(() => {
            alert('今日数据已清除');
          }).catch(error => {
            console.error('清除数据失败:', error);
            alert('清除数据失败');
          });
        });
      });
    }
  }
  
  // 清除所有数据
  function clearAllData() {
    if (confirm('确定要清除所有饮水记录吗？此操作不可恢复！')) {
      // 获取数据库连接
      const dbPromise = waterDB.db ? Promise.resolve(waterDB.db) : waterDB.initDB();
      
      dbPromise.then(db => {
        const transaction = db.transaction(['waterRecords'], 'readwrite');
        const store = transaction.objectStore('waterRecords');
        
        const request = store.clear();
        
        request.onsuccess = () => {
          alert('所有数据已清除');
        };
        
        request.onerror = () => {
          console.error('清除数据失败:', request.error);
          alert('清除数据失败');
        };
      });
    }
  }
  
  // 绑定事件
  reminderEnabledInput.addEventListener('change', () => {
    intervalContainer.style.display = reminderEnabledInput.checked ? 'flex' : 'none';
  });
  
  saveBtn.addEventListener('click', saveSettings);
  clearTodayBtn.addEventListener('click', clearTodayData);
  clearAllBtn.addEventListener('click', clearAllData);
  
  // 初始化
  loadSettings();
});