// 初始化提醒闹钟
function setupReminder() {
  // 获取用户设置
  chrome.storage.local.get(['reminderInterval', 'reminderEnabled'], (result) => {
    // 清除现有闹钟
    chrome.alarms.clear('waterReminder');
    
    // 如果启用了提醒，则创建新闹钟
    if (result.reminderEnabled !== false) {
      const interval = result.reminderInterval || 60; // 默认60分钟
      
      chrome.alarms.create('waterReminder', {
        periodInMinutes: interval
      });
      
      console.log(`已设置每${interval}分钟提醒一次`);
    }
  });
}

// 显示喝水提醒通知
function showWaterReminder() {
  chrome.notifications.create('waterReminder', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '喝水提醒',
    message: '该喝水啦！保持水分摄入有助于健康。',
    buttons: [
      { title: '已喝 250ml' }
    ],
    priority: 2
  });
}

// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'waterReminder') {
    showWaterReminder();
  }
});

// 监听通知按钮点击事件
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId === 'waterReminder') {
    // 记录饮水量（通过消息传递给popup页面）
    chrome.runtime.sendMessage({ action: 'addWaterRecord', amount: 250 });
    
    // 关闭通知
    chrome.notifications.clear(notificationId);
  }
});

// 监听设置变更
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 
      (changes.reminderInterval || changes.reminderEnabled)) {
    setupReminder();
  }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSettings') {
    setupReminder();
    sendResponse({ success: true });
  }
});

// 插件安装或更新时初始化
chrome.runtime.onInstalled.addListener((details) => {
  // 初始化默认设置
  chrome.storage.local.get(['reminderInterval', 'reminderEnabled'], (result) => {
    if (result.reminderInterval === undefined) {
      chrome.storage.local.set({
        reminderInterval: 60, // 默认60分钟
        reminderEnabled: true // 默认启用
      });
    }
    
    // 设置提醒
    setupReminder();
  });
  
  // 当插件首次安装时，打开欢迎页面
  if (details.reason === 'install') {
    // 创建并打开欢迎页面
    chrome.tabs.create({
      url: 'index.html'
    });
  }
});