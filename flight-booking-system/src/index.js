import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';

// เรียกใช้ไฟล์ CSS สำหรับ Font Awesome (หากมีการติดตั้ง)
import '@fortawesome/fontawesome-free/css/all.min.css';

// เรียกใช้ไฟล์ CSS สำหรับ Bootstrap (หากมีการติดตั้ง)
import 'bootstrap/dist/css/bootstrap.min.css';

// นำเข้า Font Sarabun จาก Google Fonts (สามารถใช้ @import ใน CSS หรือ link ใน HTML แทนได้)
// หรือเพิ่ม <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet"> ใน index.html

// ต้องตรวจสอบว่ามี element ที่มี id 'root' ใน HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// เพิ่ม service worker หากต้องการให้แอปพลิเคชันเป็น PWA (Progressive Web App)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }