import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Send, LogOut, Home, Wallet, ShoppingBag, User, 
  AlertCircle, CheckCircle, Clock, Key, Download, ArrowRight, 
  Phone, MessageSquare, Video, Smartphone, ShieldCheck, PlusCircle 
} from 'lucide-react';

const API_URL = 'https://society-backend-dpj5.onrender.com/api';

// ==========================================
// ระบบพื้นหลัง Particles สไตล์ Hacker/Premium
// ==========================================
const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particlesArray;
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    class Particle {
      constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        if (mouse.x != null) {
          let dxMouse = particlesArray[a].x - mouse.x;
          let dyMouse = particlesArray[a].y - mouse.y;
          let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distanceMouse < mouse.radius) {
            ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distanceMouse / mouse.radius})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            let opacityValue = 1 - (distance / 15000);
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none" style={{background: 'linear-gradient(to bottom, #050508, #0a0a0f)'}} />;
};

// ==========================================
// ระบบหลัก (Main App)
// ==========================================
export default function SOCIETYxSHOP() {
  const [currentPage, setCurrentPage] = useState('landing'); 
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false); 
  const [showBuyModal, setShowBuyModal] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [adminStats, setAdminStats] = useState(null);
  const [bulkKeys, setBulkKeys] = useState("");
  const [selectedAdminProduct, setSelectedAdminProduct] = useState("CMD SOCIETY");

  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ otp: '', newPassword: '' });

  const [refillAmount, setRefillAmount] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [expectedAmount, setExpectedAmount] = useState(0);

  const [slipImage, setSlipImage] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [refillHistory, setRefillHistory] = useState([]);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // 🌟 ลิงก์ช่องทางติดต่อ
  const STORE_LINKS = {
    discord: "https://discord.gg/TApFSKWtYK",
    tiktok: "https://www.tiktok.com/@societyxshopv1?is_from_webapp=1&sender_device=pc",
    youtube: "https://www.youtube.com/channel/UCr60L8rgOnVKaGTil_NPMgw",
    external: "https://www.mediafire.com/file/tjhm8q83phd98yg/SOCIETYWEB.rar/file",
    reshade: "https://www.mediafire.com/file/thmir3bn1bo1wk0/รีเชรด+Society.rar/file",
    cmd: "https://www.mediafire.com/file/tf8mshzaz0j6a9m/CMD+society.rar/file"
  };

  useEffect(() => {
    loadProducts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsGuest(false);
          setCurrentPage('shop'); 
        }
      } catch (err) {
        console.log('Auth check failed');
      }
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {}
  };

  const loadOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/orders`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {}
  };

  const loadRefillHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/refill/history`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setRefillHistory(await res.json());
    } catch (err) {}
  };

  // ดึงข้อมูลแอดมิน
  const loadAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setAdminStats(await res.json());
    } catch (err) {}
  };

  const handleBuy = (product) => {
    if (isGuest) {
      showNotification('⚠ กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า', 'warning');
      setAuthMode('login');
      setCurrentPage('auth');
      return;
    }
    if (user.balance < product.price) {
      showNotification('⚠ ยอดเงินไม่พอ กรุณาเติมเงิน', 'warning');
      return;
    }
    setShowBuyModal(product); 
  };

  const handleGenerateQR = async () => {
    if (!refillAmount || isNaN(refillAmount) || Number(refillAmount) < 1) {
      return showNotification("⚠ กรุณากรอกจำนวนเงินให้ถูกต้อง", "warning");
    }
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/refill/generate-qr`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify({ amount: refillAmount }) 
      });
      const data = await response.json();
      if (data.success) { 
        setQrImage(data.qrImage); 
        setExpectedAmount(data.amount); 
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) { 
      showNotification("❌ เกิดข้อผิดพลาด", 'error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipImage(file);
      const reader = new FileReader();
      reader.onload = (evt) => setSlipPreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitSlip = async () => {
    if (!slipImage) return showNotification('⚠ กรุณาเลือกรูปสลิปก่อน', 'warning');
    
    const formData = new FormData(); 
    formData.append('slip', slipImage); 
    formData.append('amount', expectedAmount); 
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/refill/verify`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData 
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser({ ...user, balance: data.newBalance }); 
        showNotification(`✓ ${data.message}`, 'success');
        setSlipImage(null); 
        setSlipPreview(null); 
        setQrImage(null); 
        setRefillAmount(''); 
        loadRefillHistory();
      } else { 
        showNotification(data.message || 'สแกนสลิปไม่ผ่าน', 'error'); 
      }
    } catch (err) { 
      showNotification('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error'); 
    }
    setLoading(false);
  };

  const confirmPurchase = async () => {
    const product = showBuyModal; 
    setShowBuyModal(null); 
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders`, { 
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ 
          productId: product._id, 
          productName: product.name, 
          price: product.price 
        }) 
      });
      const data = await res.json();
      if (res.ok) { 
        setUser({ ...user, balance: data.newBalance }); 
        showNotification(`✓ ซื้อ ${product.name} สำเร็จ! ไปที่ประวัติเพื่อรับของ`, 'success'); 
        loadOrders(); 
      } else { 
        showNotification(data.message, 'error'); 
      }
    } catch (err) {}
  };

  const handleAuth = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(`${API_URL}${endpoint}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); 
        setUser(data.user); 
        setIsGuest(false); 
        setCurrentPage('shop'); 
        showNotification('✓ เข้าสู่ระบบสำเร็จ', 'success'); 
        setFormData({ username: '', email: '', password: '' });
      } else { 
        showNotification(data.message || 'ข้อมูลไม่ถูกต้อง', 'error'); 
      }
    } catch (err) { 
      showNotification('เกิดข้อผิดพลาด', 'error'); 
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return showNotification('⚠ รหัสผ่านใหม่ไม่ตรงกัน!', 'error');
    if (passForm.newPassword.length < 6) return showNotification('⚠ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'warning');
    showNotification('⏳ ระบบกำลังประมวลผล...', 'info');
    setTimeout(() => { 
      showNotification('✓ เปลี่ยนรหัสผ่านสำเร็จ', 'success'); 
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); 
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsGuest(false);
    setCurrentPage('landing'); 
    showNotification('✓ ออกจากระบบสำเร็จ', 'success');
  };

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type }); 
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = selectedCategory === 'ทั้งหมด' 
    ? products 
    : products.filter(p => p.category === selectedCategory);
  
  const categories = ['ทั้งหมด', ...new Set(products.map(p => p.category))];

  // CSS แกนหลัก
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700;900&family=Poppins:wght@400;600;800;900&display=swap');
    body { margin: 0; padding: 0; font-family: 'Kanit', sans-serif; background-color: #07070a; color: #fff; }
    .font-poppins, h1, .eng-num { font-family: 'Poppins', sans-serif; }
    
    .logo-glitch { position: relative; display: inline-block; transition: all 0.3s ease; }
    .logo-glitch:hover { filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.6)); transform: scale(1.02); }
    .logo-shine { 
      background: linear-gradient(120deg, #fff 30%, #d4af37 50%, #fff 70%); 
      background-size: 200% auto; 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent; 
      animation: shine 3s linear infinite; 
    }
    @keyframes shine { to { background-position: 200% center; } }
    
    .glass-panel { 
      background: rgba(15, 15, 18, 0.6); 
      backdrop-filter: blur(12px); 
      -webkit-backdrop-filter: blur(12px); 
      border: 1px solid rgba(255, 255, 255, 0.03); 
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); 
    }
    .smooth-hover { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
    .smooth-hover:hover { 
      transform: translateY(-4px); 
      border-color: rgba(212, 175, 55, 0.4); 
      box-shadow: 0 15px 35px -10px rgba(212, 175, 55, 0.2); 
    }
    .smooth-btn { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
    .smooth-btn:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 8px 20px -5px rgba(212, 175, 55, 0.3); 
    }
    .smooth-btn:active { transform: scale(0.96); }
    .nav-btn { 
      position: relative; 
      padding: 0.75rem 1.5rem; 
      border-radius: 1rem; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      color: #9ca3af; 
      font-weight: 500;
    }
    .nav-btn.active { 
      color: #d4af37; 
      background: rgba(212, 175, 55, 0.1); 
      font-weight: 700; 
      border: 1px solid rgba(212, 175, 55, 0.2); 
    }
    .nav-btn:hover:not(.active) { 
      color: #fff; 
      background: rgba(255, 255, 255, 0.05); 
    }
    .fade-in { animation: fadeIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(10px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    .key-box { 
      background: repeating-linear-gradient( 45deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 10px, rgba(20,20,20,0.2) 10px, rgba(20,20,20,0.2) 20px ); 
    }
  `;

  // ==========================================
  // 🚀 1. LANDING PAGE
  // ==========================================
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        <style>{globalStyles}</style>
        <ParticlesBackground />
        
        <div className="z-10 max-w-4xl w-full text-center fade-in">
          <div className="inline-flex items-center gap-2 bg-black/50 border border-white/10 px-5 py-2 rounded-full text-sm text-gray-300 mb-8 backdrop-blur-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            ระบบพร้อมให้บริการ 24/7
          </div>

          <div className="logo-glitch group flex flex-col items-center justify-center mb-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-wider logo-shine uppercase font-poppins drop-shadow-2xl">
              SOCIETY<span className="text-white">×</span>SHOP
            </h1>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white drop-shadow-lg leading-tight">
            ครบวงจร <span className="text-yellow-500">ราคาจับต้องได้</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            โปรแกรมคุณภาพสำหรับเกม PUBG และบริการเกมยอดนิยม<br className="hidden md:block"/>
            ซื้อง่าย ได้ไว ส่งอัตโนมัติผ่านเว็บไซต์ตลอด 24 ชั่วโมง
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-20">
            <button 
              onClick={() => { setCurrentPage('auth'); setAuthMode('login'); }} 
              className="smooth-btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full md:w-auto flex items-center justify-center gap-2 text-lg"
            >
              เริ่มต้นใช้งาน <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => { setIsGuest(true); setCurrentPage('shop'); }} 
              className="smooth-btn bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl w-full md:w-auto flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
            >
              <ShoppingBag size={20} /> เข้าชมร้านค้า (Guest)
            </button>
            <button 
              onClick={() => { setIsGuest(true); setCurrentPage('contact'); }} 
              className="smooth-btn bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2] hover:text-white font-bold px-8 py-4 rounded-xl w-full md:w-auto flex items-center justify-center gap-2 transition-colors text-lg"
            >
               <Phone size={20} /> ติดต่อเรา
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-12 border-t border-white/10 pt-10 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-black text-white eng-num mb-1">600</h3>
              <p className="text-xs md:text-sm text-gray-500 font-bold">ผู้ใช้งาน</p>
            </div>
            <div className="text-center border-l border-r border-white/5">
              <h3 className="text-2xl md:text-4xl font-black text-yellow-400 eng-num mb-1">150+</h3>
              <p className="text-xs md:text-sm text-gray-500 font-bold">ออเดอร์ที่ส่งมอบ</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-black text-white eng-num mb-1">24/7</h3>
              <p className="text-xs md:text-sm text-gray-500 font-bold">เปิดให้บริการ</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ========== AUTH PAGE ==========
  if (currentPage === 'auth' && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <style>{globalStyles}</style>
        <ParticlesBackground />

        <div className="glass-panel w-full max-w-md rounded-3xl p-8 fade-in relative z-10 border border-yellow-500/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
          <button 
            onClick={() => setCurrentPage('landing')} 
            className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
          >
            ← กลับ
          </button>

          <div className="logo-glitch group flex flex-col items-center justify-center mb-2 mt-6">
            <h1 className="text-4xl font-black tracking-wider logo-shine uppercase font-poppins">
              SOCIETY<span className="text-white">×</span>SHOP
            </h1>
            <div className="flex gap-1 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>
          <p className="text-gray-400 text-center text-sm mb-8 tracking-widest font-poppins">PREMIUM STORE</p>

          <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl">
            <button 
              onClick={() => setAuthMode('login')} 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${authMode === 'login' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              เข้าสู่ระบบ
            </button>
            <button 
              onClick={() => setAuthMode('signup')} 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${authMode === 'signup' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {authMode === 'forgot' ? (
            <div className="fade-in space-y-4">
              <p className="text-gray-400 text-sm text-center mb-4">กรอกอีเมลที่ใช้สมัคร เพื่อรับรหัสผ่านชั่วคราว (OTP)</p>
              <input 
                type="email" 
                placeholder="อีเมลของคุณ (Email)" 
                value={forgotEmail} 
                onChange={(e) => setForgotEmail(e.target.value)} 
                className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                required
              />
              <button 
                onClick={async () => {
                  if(!forgotEmail) return showNotification('กรุณากรอกอีเมล', 'warning');
                  setLoading(true);
                  try {
                    const res = await fetch(`${API_URL}/auth/forgot-password`, { 
                      method: 'POST', 
                      headers: { 'Content-Type': 'application/json' }, 
                      body: JSON.stringify({ email: forgotEmail }) 
                    });
                    const data = await res.json();
                    if(res.ok) { 
                      showNotification(data.message, 'success'); 
                      setAuthMode('reset'); 
                    } else {
                      showNotification(data.message, 'error');
                    }
                  } catch(e) { 
                    showNotification('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error'); 
                  }
                  setLoading(false);
                }} 
                disabled={loading} 
                className="smooth-btn w-full mt-2 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {loading ? 'กำลังส่งอีเมล...' : 'ส่งรหัส OTP'}
              </button>
              <button onClick={() => setAuthMode('login')} className="w-full mt-4 text-gray-500 text-sm hover:text-white transition-colors">
                ← กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          ) : authMode === 'reset' ? (
            <div className="fade-in space-y-4">
              <p className="text-gray-400 text-sm text-center mb-4">กรอกรหัส OTP จากอีเมล และตั้งรหัสผ่านใหม่</p>
              <input 
                type="text" 
                placeholder="รหัส OTP 6 หลัก" 
                value={resetData.otp} 
                onChange={(e) => setResetData({...resetData, otp: e.target.value})} 
                className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white tracking-widest text-center text-lg focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                required 
                maxLength={6}
              />
              <input 
                type="password" 
                placeholder="รหัสผ่านใหม่" 
                value={resetData.newPassword} 
                onChange={(e) => setResetData({...resetData, newPassword: e.target.value})} 
                className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                required
              />
              <button 
                onClick={async () => {
                  if(!resetData.otp || !resetData.newPassword) return showNotification('กรอกข้อมูลให้ครบ', 'warning');
                  setLoading(true);
                  try {
                    const res = await fetch(`${API_URL}/auth/reset-password`, { 
                      method: 'POST', 
                      headers: { 'Content-Type': 'application/json' }, 
                      body: JSON.stringify({ email: forgotEmail, otp: resetData.otp, newPassword: resetData.newPassword }) 
                    });
                    const data = await res.json();
                    if(res.ok) { 
                      showNotification(data.message, 'success'); 
                      setAuthMode('login'); 
                      setResetData({otp:'', newPassword:''}); 
                      setForgotEmail(''); 
                    } else {
                      showNotification(data.message, 'error');
                    }
                  } catch(e) { 
                    showNotification('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error'); 
                  }
                  setLoading(false);
                }} 
                disabled={loading} 
                className="smooth-btn w-full mt-2 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {loading ? 'กำลังเปลี่ยนรหัส...' : 'ยืนยันรหัสผ่านใหม่'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="ชื่อผู้ใช้งาน (Username)" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                  required
                />
              </div>
              {authMode === 'signup' && (
                <div className="fade-in">
                  <input 
                    type="email" 
                    placeholder="อีเมล (Email)" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                    required
                  />
                </div>
              )}
              <div>
                <input 
                  type="password" 
                  placeholder="รหัสผ่าน (Password)" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500" 
                  required
                />
              </div>

              {authMode === 'login' && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('forgot')} 
                    className="text-gray-400 text-sm hover:text-yellow-500 transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="smooth-btn w-full mt-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {loading ? 'กำลังประมวลผล...' : (authMode === 'signup' ? 'ยืนยันสมัครสมาชิก' : 'เข้าสู่ระบบ')}
              </button>
            </form>
          )}

        </div>

        {notification && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl font-bold glass-panel fade-in">
            {notification.type === 'success' ? <CheckCircle size={20} className="text-green-400" /> : <AlertCircle size={20} className="text-red-400" />}
            <span className={notification.type === 'success' ? 'text-green-400' : 'text-red-400'}>{notification.msg}</span>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 🛒 3. MAIN APP
  // ==========================================
  if (!user && !isGuest) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <style>{globalStyles}</style>
      <ParticlesBackground />

      {/* HEADER */}
      <header className="glass-panel border-b-0 border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="logo-glitch group cursor-pointer" onClick={() => { isGuest ? setCurrentPage('landing') : setCurrentPage('shop') }}>
            <h1 className="text-2xl font-black tracking-wider logo-shine uppercase font-poppins">
              SOCIETY<span className="text-white">×</span>SHOP
            </h1>
            <div className="flex gap-1 mt-[-2px] ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isGuest ? (
              <button 
                onClick={() => { setAuthMode('login'); setCurrentPage('auth'); }} 
                className="smooth-btn px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl shadow-md"
              >
                เข้าสู่ระบบ
              </button>
            ) : (
              <>
                <div className="bg-black/40 border border-white/5 rounded-xl px-5 py-2">
                  <span className="text-gray-400 text-xs block">ยอดเงินคงเหลือ</span>
                  <p className="text-yellow-400 font-bold eng-num text-lg leading-tight">฿{user?.balance.toFixed(2)}</p>
                </div>
                <button 
                  onClick={logout} 
                  className="smooth-btn flex items-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* NAV TABS */}
        <div className="border-t border-white/5 bg-black/20">
          <div className="max-w-6xl mx-auto px-6 py-2 flex gap-2 overflow-x-auto">
            {/* 🛡️ ปุ่มจัดการหลังบ้าน (เฉพาะแอดมิน) */}
            {user?.isAdmin && (
              <button onClick={() => { setCurrentPage('admin'); loadAdminData(); }} className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}>
                <ShieldCheck size={18} className="inline mr-2 mb-1" /> จัดการหลังบ้าน
              </button>
            )}

            <button onClick={() => setCurrentPage('shop')} className={`nav-btn ${currentPage === 'shop' ? 'active' : ''}`}>
              <ShoppingBag size={18} className="inline mr-2 mb-1" /> ร้านค้า
            </button>
            
            {!isGuest && (
              <>
                <button onClick={() => { setCurrentPage('refill'); loadRefillHistory(); }} className={`nav-btn ${currentPage === 'refill' ? 'active' : ''}`}>
                  <Wallet size={18} className="inline mr-2 mb-1" /> เติมเงิน
                </button>
                <button onClick={() => { setCurrentPage('orders'); loadOrders(); }} className={`nav-btn ${currentPage === 'orders' ? 'active' : ''}`}>
                  <Clock size={18} className="inline mr-2 mb-1" /> ประวัติการซื้อ
                </button>
                <button onClick={() => setCurrentPage('profile')} className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}>
                  <User size={18} className="inline mr-2 mb-1" /> ข้อมูลผู้ใช้
                </button>
              </>
            )}
            
            <button onClick={() => setCurrentPage('contact')} className={`nav-btn ${currentPage === 'contact' ? 'active' : ''}`}>
              <Phone size={18} className="inline mr-2 mb-1" /> ติดต่อเรา
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* SHOP PAGE */}
        {currentPage === 'shop' && (
          <div className="fade-in">
            {isGuest && (
               <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-6 py-4 rounded-2xl mb-6 flex items-center justify-between">
                 <span className="font-bold flex items-center gap-2"><User size={20}/> โหมดเยี่ยมชม (Guest)</span>
                 <button onClick={() => setCurrentPage('auth')} className="text-sm underline hover:text-white">
                   เข้าสู่ระบบเพื่อใช้งานเต็มรูปแบบ
                 </button>
               </div>
            )}

            <h2 className="text-3xl font-black mb-6">ร้านค้า (SHOP)</h2>
            
            <div className="flex gap-3 mb-8 overflow-x-auto py-6 px-2 -my-4 -mx-2 scrollbar-hide">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`smooth-btn px-6 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-yellow-500 text-black font-bold shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-105' 
                      : 'glass-panel text-gray-300 hover:text-white border border-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product._id} className="smooth-hover glass-panel rounded-2xl p-4 flex flex-col border-white/5 overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                  
                  {/* 🖼️ ส่วนแสดงรูปภาพสินค้า */}
                  {product.image ? (
                    <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-transparent"></div>
                      {product.badge && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-black shadow-lg">
                          {product.badge}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end mb-2">
                      {product.badge && <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold mt-2 mr-2">{product.badge}</span>}
                    </div>
                  )}

                  {/* 📝 ส่วนข้อมูลชื่อและคำอธิบาย */}
                  <div className="flex-1 flex flex-col justify-between px-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-black text-yellow-400 eng-num block">฿{product.price}</span>
                      
                      <div className="mt-1 space-y-0.5">
                        <span className="text-[10px] text-gray-500 eng-num flex items-center gap-1 uppercase tracking-tighter">
                          <ShoppingBag size={10} /> ขายแล้ว {product.soldCount || 0} ชิ้น
                        </span>
                        {product.stock === 'unlimited' ? (
                          <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                             ✓ สินค้าพร้อมส่ง
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${product.stock > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                             {product.stock > 0 ? `📦 คงเหลือ ${product.stock} ชิ้น` : '✗ สินค้าหมด'}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleBuy(product)} 
                      disabled={product.stock === 0}
                      className={`smooth-btn font-bold px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)] ${
                        product.stock === 0 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                      }`}
                    >
                      {product.stock === 0 ? 'สินค้าหมด' : 'สั่งซื้อ'}
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 CONTACT PAGE */}
        {currentPage === 'contact' && (
          <div className="fade-in">
            <h2 className="text-3xl font-black mb-6">ติดต่อเรา (CONTACT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href={STORE_LINKS.discord} target="_blank" rel="noreferrer" className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center smooth-hover border-white/5 hover:border-[#5865F2]/50 group">
                 <div className="w-20 h-20 bg-[#5865F2]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#5865F2] transition-colors">
                   <MessageSquare size={36} className="text-[#5865F2] group-hover:text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Discord</h3>
                 <p className="text-gray-400 text-sm">แจ้งปัญหา เปิดทิคเก็ต พูดคุยกับแอดมิน</p>
              </a>
              <a href={STORE_LINKS.tiktok} target="_blank" rel="noreferrer" className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center smooth-hover border-white/5 hover:border-pink-500/50 group">
                 <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-500 transition-colors">
                   <Smartphone size={36} className="text-pink-500 group-hover:text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">TikTok</h3>
                 <p className="text-gray-400 text-sm">ติดตามอัปเดตและไฮไลท์ใหม่ๆ</p>
              </a>
              <a href={STORE_LINKS.youtube} target="_blank" rel="noreferrer" className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center smooth-hover border-white/5 hover:border-red-500/50 group">
                 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                   <Video size={36} className="text-red-500 group-hover:text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">YouTube</h3>
                 <p className="text-gray-400 text-sm">รับชมรีวิวและสอนการใช้งานต่างๆ</p>
              </a>
            </div>
          </div>
        )}

        {/* REFILL PAGE */}
        {currentPage === 'refill' && !isGuest && (
          <div className="fade-in">
            <h2 className="text-3xl font-black mb-6">เติมเงิน (REFILL)</h2>
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-500">⚡</span> เติมเงินอัตโนมัติ (Dynamic QR)
              </h2>
              
              {!qrImage ? (
                <div className="space-y-4 fade-in">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">ระบุจำนวนเงินที่ต้องการเติม (บาท)</label>
                    <input 
                      type="number" 
                      value={refillAmount} 
                      onChange={(e) => setRefillAmount(e.target.value)} 
                      placeholder="เช่น 10, 35, 100 ไม่จำกัดยอดเติมขั้นต่ำ" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-xl font-bold focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleGenerateQR} 
                    disabled={loading || !refillAmount} 
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'กำลังสร้าง QR Code...' : 'สร้าง QR Code เพื่อจ่ายเงิน'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
                  <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-black">
                    <img src={qrImage} alt="PromptPay QR" className="w-48 h-48 mb-4 border-4 border-gray-100 rounded-xl" />
                    <p className="font-bold text-lg text-center">สแกนจ่ายผ่านแอปธนาคาร</p>
                    <p className="text-2xl font-black text-blue-600 mt-2">฿{expectedAmount}.00</p>
                    <p className="text-sm text-gray-500 mt-2">ชื่อบัญชี: นาย อภิวรรธน์ ภู่ถาวร</p>
                    <button 
                      onClick={() => { setQrImage(null); setRefillAmount(''); setSlipPreview(null); setSlipImage(null); }} 
                      className="mt-4 text-xs text-red-500 underline"
                    >
                      ยกเลิก / เปลี่ยนยอดเงิน
                    </button>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="bg-black/30 border border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer relative h-full flex flex-col justify-center min-h-[250px]">
                      <input type="file" accept="image/*" onChange={handleSlipUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {slipPreview ? ( 
                        <img src={slipPreview} className="mx-auto max-h-48 object-contain rounded-xl" alt="Slip Preview" /> 
                      ) : (
                        <div className="py-8">
                          <div className="text-yellow-500 text-4xl mb-2">📸</div>
                          <p className="text-gray-300 font-bold">แตะเพื่อเลือกรูปสลิป</p>
                          <p className="text-gray-500 text-sm mt-1">ต้องเป็นสลิปยอด {expectedAmount} บาทเท่านั้น แนะนำไฟล์ JPG หรือ PNG</p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={submitSlip} 
                      disabled={!slipImage || loading} 
                      className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:shadow-none"
                    >
                      {loading ? 'กำลังตรวจสอบสลิปด้วย AI...' : 'ยืนยันการเติมเงิน'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="fade-in">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-gray-400"/> ประวัติการทำรายการ</h3>
              <div className="space-y-3">
                {refillHistory.length === 0 ? ( 
                  <div className="glass-panel rounded-2xl p-8 text-center text-gray-500 border-white/5">ยังไม่มีข้อมูลการเติมเงิน</div> 
                ) : (
                  refillHistory.map((item, idx) => (
                    <div key={idx} className="smooth-hover glass-panel rounded-2xl p-5 flex justify-between items-center border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                          <Wallet className="text-yellow-400" size={20}/>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-white eng-num">฿{item.amount}</p>
                          <p className="text-gray-500 text-sm">{new Date(item.date).toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${item.status === 'verified' ? 'bg-green-500/10 text-green-400 border-green-500/20' : item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {item.status === 'verified' ? '✓ สำเร็จ' : item.status === 'pending' ? '⏳ รอดำเนินการ' : '✗ ไม่สำเร็จ'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS PAGE */}
        {currentPage === 'orders' && !isGuest && (
          <div className="fade-in">
            <h2 className="text-3xl font-black mb-6">ประวัติการสั่งซื้อ (ORDERS)</h2>
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="glass-panel rounded-3xl p-16 text-center text-gray-500 border-white/5">
                  <ShoppingBag size={56} className="mx-auto mb-4 opacity-20 text-white" />
                  <p className="text-lg">คุณยังไม่เคยสั่งซื้อสินค้า</p>
                </div>
              ) : orders.map((order, idx) => {
                const pName = order.productName.toUpperCase(); 
                let productType = 'admin_install'; 
                
                if (pName.includes('CMD')) { 
                  productType = 'key_and_download'; 
                } else if (pName.includes('EXTERNAL') || pName.includes('RESHADE')) { 
                  productType = 'download_only'; 
                }
                
                let dLink = "#"; 
                if (pName.includes('EXTERNAL')) dLink = STORE_LINKS.external; 
                else if (pName.includes('RESHADE')) dLink = STORE_LINKS.reshade; 
                else if (pName.includes('CMD')) dLink = STORE_LINKS.cmd;
                
                return (
                  <div key={idx} className="glass-panel rounded-2xl p-6 flex flex-col gap-5 border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-xl text-white mb-1">{order.productName}</p>
                        <p className="text-gray-500 text-sm eng-num">รหัสคำสั่งซื้อ: #{order._id}</p>
                      </div>
                      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                        <p className="text-yellow-400 font-black text-2xl eng-num">฿{order.price}</p>
                        <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/20">
                          ✓ สำเร็จ (รับสินค้าแล้ว)
                        </span>
                      </div>
                    </div>

                    <div className="key-box rounded-xl p-5 border border-yellow-500/20 fade-in shadow-inner">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Key size={16} className="text-yellow-400"/> สถานะการรับสินค้า
                      </h4>
                      
                      {productType === 'admin_install' && (
                        <div className="bg-black/60 p-6 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
                          <AlertCircle size={36} className="text-yellow-400 mb-3" />
                          <p className="text-white font-bold text-lg mb-1">สินค้านี้ต้องให้ Admin ติดตั้งให้</p>
                          <p className="text-gray-400 text-sm mb-5">กรุณาเข้าร่วม Discord เปิดทิคเก็ต และส่งรหัสคำสั่งซื้อนี้ให้ Admin</p>
                          <a href={STORE_LINKS.discord} target="_blank" rel="noreferrer" className="smooth-btn bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 w-fit mx-auto">
                            💬 ติดต่อ Admin ใน Discord
                          </a>
                        </div>
                      )}
                      
                      {productType === 'download_only' && (
                        <div className="bg-black/60 p-6 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
                          <div>
                            <p className="text-white font-bold text-lg mb-1">ไฟล์ของคุณพร้อมแล้ว 🎉</p>
                            <p className="text-gray-400 text-sm">ดาวน์โหลด แตกไฟล์ และสามารถเปิดใช้งานได้ทันที</p>
                          </div>
                          <a href={dLink} target="_blank" rel="noreferrer" className="smooth-btn flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            <Download size={20}/> ดาวน์โหลดไฟล์
                          </a>
                        </div>
                      )}
                      
                      {productType === 'key_and_download' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-black/60 p-5 rounded-xl border border-white/5 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl"></div>
                            <span className="text-gray-400 text-xs mb-2">License Key ของคุณ (คลิกเพื่อคลุมดำ)</span>
                            <code className="text-yellow-400 font-bold eng-num text-xl select-all bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg inline-block w-fit">
                              {order.licenseKey || 'ติดต่อแอดมินเพื่อรับสินค้า'}
                            </code>
                          </div>
                          <div className="flex flex-col gap-3">
                            <a href={dLink} target="_blank" rel="noreferrer" className="smooth-btn flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-xl font-bold transition-all shadow-lg">
                              <Download size={18}/> โหลดไฟล์โปรแกรม
                            </a>
                            <div className="bg-gray-900/80 border border-white/5 p-3 rounded-xl text-xs text-gray-400 flex items-center justify-between px-4">
                              <span>พบปัญหาการใช้งาน?</span>
                              <a href={STORE_LINKS.discord} target="_blank" rel="noreferrer" className="text-[#5865F2] hover:text-white font-bold transition-all flex items-center gap-1">
                                แจ้ง Admin
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* PROFILE PAGE */}
        {currentPage === 'profile' && !isGuest && (
          <div className="fade-in">
            <h2 className="text-3xl font-black mb-6">ข้อมูลผู้ใช้งาน (PROFILE)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-3xl p-8 border-white/5">
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-yellow-500/20">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{user.username}</h3>
                    <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">สมาชิกระบบ</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">อีเมลติดต่อ (Email)</p>
                    <p className="font-bold text-white bg-black/40 p-3.5 rounded-xl border border-white/5 eng-num">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">ยอดเงินคงเหลือ</p>
                    <p className="text-yellow-400 text-3xl font-black eng-num">฿{user.balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="glass-panel rounded-3xl p-8 mb-6 border-white/5">
                  <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <CheckCircle className="text-green-400"/> สถิติการใช้งาน
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center smooth-hover">
                      <p className="text-gray-500 text-sm mb-2">ซื้อไปแล้ว</p>
                      <p className="font-black text-3xl text-white eng-num">{orders.length} <span className="text-lg text-gray-400 font-normal">ชิ้น</span></p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center smooth-hover">
                      <p className="text-gray-500 text-sm mb-2">เป็นสมาชิกเมื่อ</p>
                      <p className="font-bold text-base text-white mt-3 eng-num">{new Date(user.createdAt).toLocaleDateString('th-TH')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-panel rounded-3xl p-8 border-white/5">
                  <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <Key className="text-yellow-500"/> เปลี่ยนรหัสผ่าน
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="รหัสผ่านเดิม" 
                      value={passForm.oldPassword} 
                      onChange={e=>setPassForm({...passForm, oldPassword: e.target.value})} 
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-yellow-500 transition-all outline-none" 
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="รหัสผ่านใหม่" 
                      value={passForm.newPassword} 
                      onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} 
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-yellow-500 transition-all outline-none" 
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="ยืนยันรหัสผ่านใหม่" 
                      value={passForm.confirmPassword} 
                      onChange={e=>setPassForm({...passForm, confirmPassword: e.target.value})} 
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-yellow-500 transition-all outline-none" 
                      required
                    />
                    <button type="submit" className="smooth-btn w-full py-3.5 bg-white/10 hover:bg-yellow-500 hover:text-black text-white font-bold rounded-xl transition-all border border-white/10 mt-2">
                      อัปเดตรหัสผ่าน
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 👑 ADMIN PAGE (เพิ่งเพิ่มมาใหม่!) */}
        {currentPage === 'admin' && user?.isAdmin && (
          <div className="fade-in space-y-8 pb-10">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">👑 ระบบแอดมิน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-2xl border-white/5">
                <p className="text-gray-400 text-sm">ยอดขายรวม</p>
                <p className="text-2xl font-black text-yellow-500 eng-num">฿{adminStats?.totalSales || 0}</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-white/5">
                <p className="text-gray-400 text-sm">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-black text-white eng-num">{adminStats?.usersCount || 0} คน</p>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle size={20}/> เติมคีย์สินค้า (Bulk Add)</h3>
              <div className="space-y-4">
                <select 
                  className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none"
                  value={selectedAdminProduct}
                  onChange={(e) => setSelectedAdminProduct(e.target.value)}
                >
                  {products.filter(p => p.name.includes('CMD')).map(p => (
                    <option key={p._id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <textarea 
                  placeholder="ก๊อปคีย์มาวางที่นี่ บรรทัดละ 1 คีย์..."
                  className="w-full h-48 bg-black/50 border border-white/10 p-4 rounded-2xl text-white font-mono text-sm outline-none focus:border-yellow-500"
                  value={bulkKeys}
                  onChange={(e) => setBulkKeys(e.target.value)}
                ></textarea>
                <button 
                  onClick={async () => {
                    if(!bulkKeys.trim()) return showNotification("กรุณากรอกคีย์", "warning");
                    setLoading(true);
                    try {
                      const res = await fetch(`${API_URL}/admin/add-keys`, { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
                        body: JSON.stringify({ productName: selectedAdminProduct, keysString: bulkKeys }) 
                      });
                      const data = await res.json(); // ดึงข้อมูลที่หลังบ้านส่งกลับมา
                      
                      if(res.ok) { 
                        showNotification("✓ เพิ่มคีย์เข้าสต็อกสำเร็จ!", "success"); 
                        setBulkKeys(""); 
                        loadProducts(); 
                        loadAdminData();
                      } else {
                        // 🚨 ถ้า Error ให้โชว์ข้อความสีแดง
                        showNotification(`❌ ${data.message || 'เพิ่มคีย์ไม่สำเร็จ'}`, "error"); 
                      }
                    } catch (err) {
                      showNotification("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ", "error");
                    }
                    setLoading(false);
                  }} 
                  disabled={loading}
                  className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl hover:bg-yellow-400 shadow-xl shadow-yellow-500/10 smooth-btn"
                >
                  {loading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการเติมคีย์ลงฐานข้อมูล'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- BUY MODAL --- */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 fade-in">
          <div className="glass-panel border border-yellow-500/40 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <h3 className="text-2xl font-black mb-2 text-white">ยืนยันการสั่งซื้อ</h3>
            <div className="w-12 h-1 bg-yellow-500 rounded-full mb-6"></div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              คุณต้องการสั่งซื้อ <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded-md">{showBuyModal.name}</span><br/>
              ในราคา <span className="text-yellow-400 font-black text-2xl eng-num pl-1">฿{showBuyModal.price}</span> ใช่หรือไม่?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowBuyModal(null)} className="smooth-btn flex-1 py-3.5 bg-black/40 border border-white/10 text-gray-300 font-bold rounded-xl hover:text-white">
                ยกเลิก
              </button>
              <button onClick={confirmPurchase} className="smooth-btn flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                ยืนยันซื้อสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION --- */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[110] flex items-center gap-3 px-6 py-4 rounded-xl font-bold glass-panel fade-in border border-white/10 shadow-2xl">
          {notification.type === 'success' ? <CheckCircle size={20} className="text-green-400" /> : notification.type === 'warning' ? <AlertCircle size={20} className="text-yellow-400"/> : <AlertCircle size={20} className="text-red-400" />}
          <span className={notification.type === 'success' ? 'text-green-400' : notification.type === 'warning' ? 'text-yellow-400' : 'text-red-400'}>
            {notification.msg}
          </span>
        </div>
      )}
    </div>
  );
}