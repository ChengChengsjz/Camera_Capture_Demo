const video = document.getElementById('video');
let currentStream = null;
let devices = []; // 摄像头列表
let currentIndex = 0;

// 获取摄像头列表
async function getCameraDevices() {
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  devices = allDevices.filter(d => d.kind === 'videoinput');
}

// 打开指定摄像头
async function openCamera(index) {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const deviceId = devices[index]?.deviceId;
  if (!deviceId) return alert('没有可用摄像头');

  const constraints = {
    video: { deviceId: { exact: deviceId } }
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    currentStream = stream;
  } catch (err) {
    console.error('打开摄像头失败', err);
    alert('无法访问摄像头');
  }
}

// 初始化
document.getElementById('start').addEventListener('click', async () => {
  await getCameraDevices();
  if (devices.length === 0) return alert('没有检测到摄像头');
  currentIndex = 0;
  openCamera(currentIndex);
});

// 切换到下一个摄像头
document.getElementById('nextCamera').addEventListener('click', () => {
  if (devices.length <= 1) return; // 只有一个摄像头无需切换
  currentIndex = (currentIndex + 1) % devices.length;
  openCamera(currentIndex);
});
