class WaterDatabase {
  constructor() {
    this.dbName = 'WaterReminderDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建饮水记录表
        if (!db.objectStoreNames.contains('waterRecords')) {
          const store = db.createObjectStore('waterRecords', { keyPath: 'id', autoIncrement: true });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 创建设置表
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
        
        // 初始化设置
        this.getSettings().then(settings => {
          if (!settings) {
            this.saveSettings({
              id: 'userSettings',
              targetAmount: 2000,  // 默认目标：2000ml
              reminderInterval: 60,  // 默认提醒间隔：60分钟
              reminderEnabled: true  // 默认启用提醒
            });
          }
        });
      };

      request.onerror = (event) => {
        console.error('数据库打开失败:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 添加饮水记录
  addWaterRecord(amount) {
    return new Promise((resolve, reject) => {
      const getDBPromise = this.db ? Promise.resolve(this.db) : this.initDB();
      
      getDBPromise.then(db => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD 格式
        
        const transaction = db.transaction(['waterRecords'], 'readwrite');
        const store = transaction.objectStore('waterRecords');
        
        const record = {
          amount: amount,
          date: dateStr,
          timestamp: now.getTime()
        };
        
        const request = store.add(record);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  // 获取指定日期的饮水记录
  getWaterRecordsByDate(date) {
    return new Promise((resolve, reject) => {
      const getDBPromise = this.db ? Promise.resolve(this.db) : this.initDB();
      
      getDBPromise.then(db => {
        const transaction = db.transaction(['waterRecords'], 'readonly');
        const store = transaction.objectStore('waterRecords');
        const index = store.index('date');
        
        const request = index.getAll(date);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  // 获取最近n天的饮水记录
  getRecentWaterRecords(days = 7) {
    return new Promise((resolve, reject) => {
      const getDBPromise = this.db ? Promise.resolve(this.db) : this.initDB();
      
      getDBPromise.then(db => {
        const transaction = db.transaction(['waterRecords'], 'readonly');
        const store = transaction.objectStore('waterRecords');
        const index = store.index('timestamp');
        
        // 计算n天前的时间戳
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);
        
        const range = IDBKeyRange.lowerBound(startDate.getTime());
        const request = index.getAll(range);
        
        request.onsuccess = () => {
          // 按日期分组并计算每日总量
          const records = request.result;
          const dailyTotals = {};
          
          // 初始化最近n天的日期
          for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyTotals[dateStr] = 0;
          }
          
          // 累加每日饮水量
          records.forEach(record => {
            if (dailyTotals.hasOwnProperty(record.date)) {
              dailyTotals[record.date] += record.amount;
            }
          });
          
          resolve(dailyTotals);
        };
        
        request.onerror = () => reject(request.error);
      });
    });
  }

  // 获取今日饮水总量
  getTodayTotalAmount() {
    const today = new Date().toISOString().split('T')[0];
    return this.getWaterRecordsByDate(today).then(records => {
      return records.reduce((total, record) => total + record.amount, 0);
    });
  }

  // 保存用户设置
  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      const getDBPromise = this.db ? Promise.resolve(this.db) : this.initDB();
      
      getDBPromise.then(db => {
        const transaction = db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        
        const request = store.put(settings);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  // 获取用户设置
  getSettings() {
    return new Promise((resolve, reject) => {
      const getDBPromise = this.db ? Promise.resolve(this.db) : this.initDB();
      
      getDBPromise.then(db => {
        const transaction = db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        
        const request = store.get('userSettings');
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }
}

// 创建数据库实例
const waterDB = new WaterDatabase();