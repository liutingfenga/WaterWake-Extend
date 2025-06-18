// 礼花彩弹效果类
class ConfettiEffect {
  constructor() {
    this.colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
    ];
    this.confettiCount = 150;
    this.container = null;
    this.confettis = [];
    this.animationDuration = 3000; // 动画持续时间（毫秒）
  }

  // 创建礼花容器
  createContainer() {
    // 如果已存在容器，则移除
    this.removeContainer();
    
    // 创建新容器
    this.container = document.createElement('div');
    this.container.className = 'confetti-container';
    document.body.appendChild(this.container);
  }

  // 移除礼花容器
  removeContainer() {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }

  // 创建单个礼花
  createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // 随机位置、颜色、形状和动画时间
    const left = Math.random() * 100;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const shape = Math.random() < 0.3 ? 'circle' : 'square';
    const duration = (Math.random() * 3 + 2) * 1000; // 2-5秒
    
    confetti.style.left = `${left}%`;
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = shape === 'circle' ? '50%' : '0';
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.animationDuration = `${duration}ms`;
    
    return confetti;
  }

  // 显示庆祝消息
  showCelebrationMessage() {
    const message = document.createElement('div');
    message.className = 'celebration-message';
    message.innerHTML = `
      <h2>恭喜你！</h2>
      <p>你已经完成了今日的饮水目标！</p>
      <p>继续保持健康的饮水习惯！</p>
      <button id="close-celebration">关闭</button>
    `;
    document.body.appendChild(message);
    
    // 绑定关闭按钮事件
    document.getElementById('close-celebration').addEventListener('click', () => {
      document.body.removeChild(message);
    });
    
    // 5秒后自动关闭
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 5000);
  }

  // 播放礼花效果
  play() {
    this.createContainer();
    
    // 创建多个礼花
    for (let i = 0; i < this.confettiCount; i++) {
      const confetti = this.createConfetti();
      this.container.appendChild(confetti);
      this.confettis.push(confetti);
    }
    
    // 显示庆祝消息
    this.showCelebrationMessage();
    
    // 动画结束后清理
    setTimeout(() => {
      this.removeContainer();
    }, this.animationDuration);
  }
}

// 导出礼花效果类
window.ConfettiEffect = ConfettiEffect;