const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start');
const captureBtn = document.getElementById('capture');

// 打开摄像头
startBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('无法访问摄像头，请检查权限或设备连接。');
    console.error(err);
  }
});

// 抓拍当前帧
captureBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');
  // 根据视频实际大小调整 canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
});

