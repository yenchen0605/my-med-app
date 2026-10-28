import './App.css';
import { useState } from 'react';
import relecoxImg from './assets/relecox.jpg';
import ursolicImg from './assets/ursolic.jpg';
import takepronImg from './assets/TAKEPRON.jpg';
import lipitorImg from './assets/LIPITOR.jpg';
import NorvascImg from './assets/NORVASC.jpg';
import glucophageImg from './assets/Glucophage.jpg';
import coumadinImg from './assets/Coumadin.jpg';

// 1. 定義資料規格
interface Nurse {
  id: string;
  name: string;
  staffId: string;
  department: string;
  cartId: string;
}

interface Medicine {
  id: string;
  code: string;
  name: string;
  imageurl?: string;
  scientificName: string;
  quantity: number;
  status: 'matched' | 'mismatched'; // 系統辨識結果
  isVerified: boolean;              // 是否完成核對打勾
  effect: string;
  sideEffects: string;
  usage: string;
}

interface PatientTask {
  id: string;
  bed: string;
  patientName: string;
  mrn: string;
  status: 'pending' | 'completed';
  time: string;
  medicines: Medicine[];
}

// 預設可登入的護理人員清單
const availableNurses: Nurse[] = [
  { id: 'n1', name: '王雅婷', staffId: 'N10928', department: '成人生加護病房 (AICU)', cartId: 'AICU 智慧給藥車 #03' },
  { id: 'n2', name: '陳曉晴', staffId: 'N10845', department: '成人生加護病房 (AICU)', cartId: 'AICU 智慧給藥車 #01' },
];

// 初始病患處方清單
const initialPatients: PatientTask[] = [
  {
    id: 'p1',
    bed: 'AICU-1001',
    patientName: '陳大明',
    mrn: '19032348',
    status: 'pending',
    time: '09:00 早班處方',
    medicines: [
      {
        id: 'p1-m1',
        code: '09098',
        name: '禮痛保膠囊',
        imageurl: relecoxImg,
        scientificName: 'Relecox Cap 200mg',
        quantity: 1,
        status: 'matched',
        isVerified: false,
        effect: '消炎止痛，用於關節炎、急性術後疼痛。',
        sideEffects: '可能出現胃部不適、水腫；長期使用需注意心血管風險。',
        usage: '口服，餐後服用。',
      },
      {
        id: 'p1-m2',
        code: '13505',
        name: '“政德”膽速力錠100毫克(吾膽利喜)',
        imageurl: ursolicImg,
        scientificName: 'URSOLIC TABLETS 100MG (URSODEOXYCHOLIC ACID)',
        quantity: 2,
        status: 'matched',
        isVerified: false,
        effect: '促進膽汁分泌、改善膽汁鬱積、溶解膽固醇結石。',
        sideEffects: '輕微腹瀉、消化不良、皮膚癢。',
        usage: '口服，每日 2～3 次，隨餐吞服。',
      },
      {
        id: 'p1-m3',
        code: '04321',
        name: '泰克胃通口溶錠',
        scientificName: 'Takepron OD 30mg',
        quantity: 1,
        status: 'matched',
        isVerified: false,
        imageurl: takepronImg, // 可暫不放或放預設圖
        effect: '氫離子幫浦阻斷劑，治療胃潰瘍、逆流性食道炎。',
        sideEffects: '頭痛、腹瀉、便秘、腹脹。',
        usage: '口服，每日早晨一次，舌下含化或吞服。',
      },
      {
        id: 'p1-m4',
        code: '08129',
        name: '可邁丁錠',
        scientificName: 'Coumadin 2.5mg (Warfarin)',
        quantity: 1,
        status: 'mismatched', // ✕ 不符合（測試禁止打勾防呆機制）
        isVerified: false,
        imageurl: coumadinImg,
        effect: '抗凝血劑，預防術後深層靜脈栓塞與肺栓塞。',
        sideEffects: '異常出血、瘀青、血尿。',
        usage: '口服，固定時間每日一次，密切監測凝血功能。',
      },
    ],
  },
  {
    id: 'p2',
    bed: 'AICU-1002',
    patientName: '林美惠',
    mrn: '18492011',
    status: 'pending',
    time: '18:00 晚班處方',
    medicines: [
      {
        id: 'p2-m1',
        code: '07891',
        name: '脈優錠',
        scientificName: 'Norvasc 5mg (Amlodipine)',
        quantity: 1,
        status: 'matched',
        isVerified: false,
        imageurl: NorvascImg,
        effect: '鈣離子阻斷劑，用於治療高血壓、心絞痛。',
        sideEffects: '周邊水腫、面部潮紅、頭暈。',
        usage: '口服，每日早晨或固定時間服用一顆。',
      },
      {
        id: 'p2-m2',
        code: '05124',
        name: '立普妥膜衣錠',
        scientificName: 'Lipitor 20mg (Atorvastatin)',
        quantity: 1,
        status: 'matched',
        isVerified: false,
        imageurl: lipitorImg,
        effect: '降血脂藥物，降低膽固醇及低密度脂蛋白。',
        sideEffects: '肌肉痠痛、輕微胃腸障礙。',
        usage: '口服，每日一次睡前服用。',
      },
    ],
  },
  {
    id: 'p3',
    bed: 'AICU-1005',
    patientName: '張國良',
    mrn: '20194820',
    status: 'completed',
    time: '12:00 午班處方',
    medicines: [
      {
        id: 'p3',
        code: '03456',
        name: '得佑降血糖膜衣錠',
        scientificName: 'Glucophage 500mg (Metformin)',
        quantity: 2,
        status: 'matched',
        isVerified: false,
        imageurl: glucophageImg,
        effect: '第二型糖尿病第一線用藥，提高胰島素敏感度。',
        sideEffects: '胃腸不適、腹瀉、金屬味覺。',
        usage: '口服，每日兩次隨餐或餐後立即服用。',
      },
    ],
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'verification'>('login');
  const [currentNurse, setCurrentNurse] = useState<Nurse | null>(null);
  const [inputStaffId, setInputStaffId] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const [patients, setPatients] = useState<PatientTask[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');
  const [openId, setOpenId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<'matched' | 'mismatched'>('matched');

  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const currentMedicines = currentPatient.medicines;
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStaffId.trim()) {
      alert('請輸入員工代號');
      return;
    }
    const found = availableNurses.find((n) => n.staffId.toLowerCase() === inputStaffId.trim().toLowerCase());
    const nurseToLogin = found || {
      id: 'custom',
      name: `${inputStaffId} 護理師`,
      staffId: inputStaffId.trim(),
      department: '成人生加護病房 (AICU)',
      cartId: 'AICU 智慧給藥車 #03',
    };
    setCurrentNurse(nurseToLogin);
    setCurrentPage('dashboard');
  };

  const handleQuickLogin = (nurse: Nurse) => {
    setCurrentNurse(nurse);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentNurse(null);
    setInputStaffId('');
    setInputPassword('');
    setCurrentPage('login');
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setOpenId(null);
    setCurrentPage('verification');
  };

  const handleToggleVerify = (medId: string) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient.id !== selectedPatientId) return patient;

        const targetMed = patient.medicines.find((m) => m.id === medId);
        if (targetMed && targetMed.status !== 'matched') {
          alert('此藥品 AI 影像特徵比對不符合，系統禁止進行核對確認！');
          return patient;
        }

        const updatedMeds = patient.medicines.map((m) =>
          m.id === medId ? { ...m, isVerified: !m.isVerified } : m
        );

        const isAllVerified = updatedMeds.every((m) => m.isVerified);

        return {
          ...patient,
          medicines: updatedMeds,
          status: isAllVerified ? 'completed' : 'pending',
        };
      })
    );
  };

  const handleToggleStatus = () => {
    setScanStatus((prev) => (prev === 'matched' ? 'mismatched' : 'matched'));
  };

  const handleReset = () => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatientId
          ? {
            ...p,
            status: 'pending',
            medicines: p.medicines.map((m) => ({ ...m, isVerified: false })),
          }
          : p
      )
    );
    alert('已重置當前病患的核對勾選狀態');
  };

  // 動態字級對應表
  const typography = {
    sm: {
      appTitle: 'text-lg',
      panelTitle: 'text-base font-bold',
      homeTitle: 'text-base font-bold',
      headerMeta: 'text-xs',
      patientBed: 'text-xs',
      patientName: 'text-base font-bold',
      patientInfo: 'text-xs',
      patientTag: 'text-[11px]',
      patientBtn: 'text-xs px-2.5 py-1',
      badge: 'text-xs',
      medName: 'text-base font-bold',
      medSub: 'text-xs',
      medQtyLabel: 'text-[11px]',
      medQtyNum: 'text-lg font-bold',
      checkBoxSize: 'w-6 h-6',
      checkIconSize: 'w-4 h-4',
      infoBtn: 'text-xs px-2 py-0.5',
      infoText: 'text-xs',
      infoTitle: 'text-xs font-bold',
      statusTitle: 'text-xs font-bold',
      statusTag: 'text-[10px]',
      camLabel: 'text-[10px]',
      actionBtn: 'text-xs py-2',
      loginTitle: 'text-xl font-bold',
      loginSub: 'text-xs',
      loginInput: 'text-sm py-2 px-3',
      loginBtn: 'text-sm py-2',
    },
    base: {
      appTitle: 'text-xl',
      panelTitle: 'text-lg font-bold',
      homeTitle: 'text-lg font-bold',
      headerMeta: 'text-sm',
      patientBed: 'text-sm',
      patientName: 'text-lg font-bold',
      patientInfo: 'text-sm',
      patientTag: 'text-xs',
      patientBtn: 'text-sm px-3.5 py-1.5',
      badge: 'text-sm',
      medName: 'text-lg font-bold',
      medSub: 'text-sm',
      medQtyLabel: 'text-xs',
      medQtyNum: 'text-2xl font-bold',
      checkBoxSize: 'w-7 h-7',
      checkIconSize: 'w-5 h-5',
      infoBtn: 'text-xs px-2.5 py-1',
      infoText: 'text-sm',
      infoTitle: 'text-sm font-bold',
      statusTitle: 'text-sm font-bold',
      statusTag: 'text-xs',
      camLabel: 'text-xs',
      actionBtn: 'text-sm py-2.5',
      loginTitle: 'text-2xl font-bold',
      loginSub: 'text-sm',
      loginInput: 'text-base py-2.5 px-3.5',
      loginBtn: 'text-base py-2.5',
    },
    lg: {
      appTitle: 'text-2xl',
      panelTitle: 'text-2xl font-black text-[#1e383f]',
      homeTitle: 'text-2xl font-black text-[#1e383f]',
      headerMeta: 'text-base ',
      patientBed: 'text-base font-bold',
      patientName: 'text-2xl font-black',
      patientInfo: 'text-base font-medium',
      patientTag: 'text-sm font-bold',
      patientBtn: 'text-base font-bold px-5 py-2.5',
      badge: 'text-base font-bold',
      medName: 'text-2xl font-black',
      medSub: 'text-base font-medium',
      medQtyLabel: 'text-sm font-semibold',
      medQtyNum: 'text-3xl font-black',
      checkBoxSize: 'w-9 h-9 border-3',
      checkIconSize: 'w-7 h-7',
      infoBtn: 'text-sm font-bold px-3.5 py-1.5',
      infoText: 'text-base font-normal',
      infoTitle: 'text-base font-bold',
      statusTitle: 'text-base font-black',
      statusTag: 'text-sm font-bold',
      camLabel: 'text-sm font-medium',
      actionBtn: 'text-base font-bold py-3',
      loginTitle: 'text-3xl font-black',
      loginSub: 'text-base',
      loginInput: 'text-lg py-3 px-4 font-semibold',
      loginBtn: 'text-lg py-3 font-bold',
    },
  }[textSize];

  // 比對結果 UI：對比大幅度拉高
  const scanUi = {
    matched: {
      box: 'bg-emerald-50 border-emerald-400',
      iconBox: 'bg-emerald-600',
      icon: '✓',
      title: '符合',
      titleColor: 'text-emerald-950 font-bold',
      tag: '',
      tagClass: 'text-emerald-900 bg-emerald-100 border border-emerald-400',
    },
    mismatched: {
      box: 'bg-rose-50 border-rose-400',
      iconBox: 'bg-rose-600',
      icon: '✕',
      title: '不符合，外觀不一致',
      titleColor: 'text-rose-950 font-bold',
      tag: '',
      tagClass: 'text-rose-900 bg-rose-100 border border-rose-400',
    },
  }[scanStatus];

  return (
    <div className="h-screen bg-[#e8f3f8] p-3 flex flex-col overflow-hidden transition-all duration-150">
      {/* 頂部 Header：高對比邊框與深色字 */}
      <header className="bg-white p-3.5 rounded-xl shadow-sm border border-[#a6d2e6] flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className={`${typography.appTitle} font-black text-[#1e383f] transition-all`}>
            藥物辨識系統
          </h1>

          <div className="h-5 w-px bg-[#a6d2e6]"></div>

          {/* 首頁按鈕 */}
          {currentPage !== 'login' && (
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className={`w-9 h-9 rounded-lg border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${currentPage === 'dashboard'
                ? 'bg-[#437682] text-white border-[#437682]'
                : 'bg-[#eef7fb] hover:bg-[#c5e4f2] text-[#1e383f] border-[#a6d2e6]'
                }`}
              title="返回病患清單"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
          )}

          {/* Aa 字體調整按鈕 */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setIsFontMenuOpen((prev) => !prev)}
              className={`h-9 px-3 rounded-lg border text-sm font-black transition-all flex items-center justify-center cursor-pointer ${isFontMenuOpen
                ? 'bg-[#437682] text-white border-[#437682] shadow-sm'
                : 'bg-[#eef7fb] hover:bg-[#c5e4f2] text-[#1e383f] border-[#a6d2e6]'
                }`}
              title="調整字體大小"
            >
              <span className="tracking-tighter">Aa</span>
            </button>

            {isFontMenuOpen && (
              <div className="absolute left-full ml-2 flex items-center bg-white p-1 rounded-lg border border-[#a6d2e6] shadow-lg gap-1 z-30">
                <button
                  type="button"
                  onClick={() => { setTextSize('sm'); setIsFontMenuOpen(false); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${textSize === 'sm' ? 'bg-[#437682] text-white' : 'hover:bg-[#eef7fb] text-slate-700'
                    }`}
                >
                  小
                </button>
                <button
                  type="button"
                  onClick={() => { setTextSize('base'); setIsFontMenuOpen(false); }}
                  className={`px-3 py-1 text-sm font-bold rounded-md cursor-pointer ${textSize === 'base' ? 'bg-[#437682] text-white' : 'hover:bg-[#eef7fb] text-slate-700'
                    }`}
                >
                  中
                </button>
                <button
                  type="button"
                  onClick={() => { setTextSize('lg'); setIsFontMenuOpen(false); }}
                  className={`px-3 py-1 text-base font-black rounded-md cursor-pointer ${textSize === 'lg' ? 'bg-[#437682] text-white' : 'hover:bg-[#eef7fb] text-slate-700'
                    }`}
                >
                  大
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右側：病患與人員資訊 */}
        <div className="flex items-center gap-3">
          {currentPage === 'verification' && (
            <div className={`flex items-center gap-2 ${typography.headerMeta}`}>
              <span className="bg-[#eef7fb] px-3 py-1 rounded-lg border border-[#a6d2e6] text-slate-800">
                病歷號：<strong className="text-[#1e383f]">{currentPatient.mrn}</strong>
              </span>
              <span className="bg-[#c5e4f2] text-[#1e383f] px-3 py-1 rounded-lg border border-[#8ec7df] font-black">
                病患：<strong className="text-[#1e383f]">{currentPatient.patientName}</strong>
              </span>
              <span className="bg-[#eef7fb] px-3 py-1 rounded-lg border border-[#a6d2e6] text-slate-800">
                床號：{currentPatient.bed}
              </span>
            </div>
          )}

          {currentNurse && (
            <div className="flex items-center gap-2">
              <span className={`${typography.headerMeta} bg-[#eef7fb] px-3 py-1 rounded-lg border border-[#a6d2e6] text-[#1e383f]`}>
                護理師：{currentNurse.name} {currentNurse.staffId} ({currentNurse.cartId})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg transition-colors cursor-pointer font-bold"
                title="登出人員"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* 頁面 1：護理人員登入入口                                   */}
      {/* ========================================================= */}
      {currentPage === 'login' && (
        <main className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#a6d2e6] shadow-md p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">

              <h2 className={`${typography.loginTitle} text-[#1e383f]`}>藥物辨識系統</h2>
            </div>

            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className={`block ${typography.loginSub} font-bold text-[#1e383f] mb-1`}>
                  員工代號 (Staff ID)
                </label>
                <input
                  type="text"
                  placeholder="例如：N10928"
                  value={inputStaffId}
                  onChange={(e) => setInputStaffId(e.target.value)}
                  className={`w-full ${typography.loginInput} rounded-xl border border-[#a6d2e6] bg-[#fdfefe] text-[#1e383f] focus:outline-none focus:ring-2 focus:ring-[#437682]`}
                />
              </div>



              <button
                type="submit"
                className={`w-full ${typography.loginBtn} bg-[#437682] hover:bg-[#345d67] text-white rounded-xl shadow-sm transition-all cursor-pointer font-bold`}
              >
                登入
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#a6d2e6] w-full"></div>
              <span className="bg-white px-3 text-xs text-slate-500 font-bold absolute">排班人員快速登入</span>
            </div>

            <div className="space-y-2 pt-1">
              {availableNurses.map((nurse) => (
                <button
                  key={nurse.id}
                  type="button"
                  onClick={() => handleQuickLogin(nurse)}
                  className="w-full text-left p-3 rounded-xl border border-[#a6d2e6] hover:border-[#437682] hover:bg-[#f0f8fb] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className={`${typography.headerMeta} font-bold text-[#1e383f] group-hover:text-[#437682] block`}>
                      {nurse.name} <span className="font-mono text-slate-500 font-normal">({nurse.staffId})</span>
                    </span>
                    <span className="text-xs text-slate-600">
                      {nurse.department} · {nurse.cartId}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#437682] bg-[#eef7fb] group-hover:bg-[#437682] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors border border-[#a6d2e6]">
                    進入 →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 頁面 2：病患排程清單總覽                                   */}
      {/* ========================================================= */}
      {currentPage === 'dashboard' && (
        <main className="space-y-6 overflow-y-auto flex-1 min-h-0 pt-3">
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`${typography.homeTitle} text-[#1e383f] transition-all`}>
                  今日待給藥病患排程
                </h3>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patients.map((patient) => {
                const isCompleted = patient.status === 'completed';
                const verifiedCount = patient.medicines.filter((m) => m.isVerified).length;

                return (
                  <div
                    key={patient.id}
                    className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${isCompleted
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-[#a6d2e6] hover:border-[#437682] hover:shadow-md'
                      }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2.5 py-1 rounded-lg font-black font-mono bg-[#c5e4f2] text-[#1e383f] border border-[#8ec7df] ${typography.patientBed}`}>
                          {patient.bed}
                        </span>

                        {isCompleted ? (
                          <span className={`${typography.patientTag} font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1`}>
                            <span>✓</span> 核對完成
                          </span>
                        ) : (
                          <span className={`${typography.patientTag} font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300`}>
                            待核對 ({verifiedCount}/{patient.medicines.length})
                          </span>
                        )}
                      </div>

                      <h4 className={`${typography.patientName} text-[#1e383f] mt-2`}>
                        {patient.patientName}
                      </h4>
                      <p className={`${typography.patientInfo} text-slate-700 mt-1`}>
                        病歷號：<span className="font-mono font-bold text-slate-900">{patient.mrn}</span>
                      </p>
                      <p className={`${typography.patientInfo} text-slate-500 mt-0.5`}>
                        時段：{patient.time}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e8f3f8] flex items-center justify-between">
                      <span className={`${typography.patientInfo} text-slate-700`}>
                        待取藥物：<strong className="text-[#1e383f] font-black">{patient.medicines.length}</strong> 種
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSelectPatient(patient.id)}
                        className={`rounded-lg font-bold transition-all cursor-pointer ${typography.patientBtn} ${isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-[#437682] hover:bg-[#345d67] text-white shadow-sm'
                          }`}
                      >
                        {isCompleted ? '檢視紀錄' : '前往核對 →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* ========================================================= */}
      {/* 頁面 3：藥品核對工作台                                     */}
      {/* ========================================================= */}
      {currentPage === 'verification' && (
        <main className="mt-3 grid grid-cols-2 gap-6 flex-1 min-h-0">
          {/* 左側：取藥目標清單 */}
          <section className="flex flex-col min-h-0 h-full min-w-0 space-y-3">
            <div className="flex justify-between items-center shrink-0">
              <h2 className={`${typography.panelTitle} text-[#1e383f] transition-all`}>取藥目標清單</h2>
              <span className={`${typography.headerMeta} text-slate-700 font-bold`}>
                已核對：{currentMedicines.filter((m) => m.isVerified).length} / {currentMedicines.length}
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
              {currentMedicines.map((med) => {
                const isOpen = openId === med.id;
                const isMatched = med.status === 'matched';

                return (
                  <div
                    key={med.id}
                    className={`w-full bg-white rounded-2xl border-2 p-3.5 shadow-xs space-y-2 transition-all ${med.isVerified
                      ? 'border-emerald-500 bg-emerald-50/25'
                      : isMatched
                        ? 'border-[#a6d2e6]'
                        : 'border-rose-400 bg-rose-50/30'
                      }`}
                  >
                    {/* 卡片頂部狀態列 */}
                    <div className="flex justify-between items-center pb-1">
                      <div className="flex items-center gap-2">
                        <span className={`${typography.badge} px-3 py-0.5 rounded-full font-black ${isMatched ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' : 'bg-rose-100 text-rose-900 border border-rose-400'
                          }`}>
                          {isMatched ? '✓ 符合' : '✕ 不符合'}
                        </span>

                        {med.isVerified && (
                          <span className={`${typography.badge} px-2.5 py-0.5 rounded-md font-black bg-[#437682] text-white`}>
                            ✓ 已確認
                          </span>
                        )}
                      </div>

                      <span className={`${typography.badge} font-mono text-slate-500 font-bold`}>
                        #{med.code}
                      </span>
                    </div>

                    {/* 卡片主體 */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">

                        {/* 打勾 Checkbox：如果不符合則 disabled 且反灰 */}
                        <button
                          type="button"
                          disabled={!isMatched}
                          onClick={() => handleToggleVerify(med.id)}
                          className={`${typography.checkBoxSize} rounded-lg border-2 flex items-center justify-center font-black transition-all shrink-0 ${!isMatched
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                            : med.isVerified
                              ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm cursor-pointer'
                              : 'bg-white border-[#437682] hover:border-[#1e383f] text-transparent cursor-pointer'
                            }`}
                          title={
                            !isMatched
                              ? '藥物影像比對不符合，系統禁止確認'
                              : med.isVerified
                                ? '點擊取消確認'
                                : '點擊確認此藥品'
                          }
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={typography.checkIconSize} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        <div
                          onClick={() => med.imageurl && setPreviewImage({ url: med.imageurl, name: med.name })}
                          className="w-28 h-24 bg-white rounded-xl border border-[#a6d2e6] shrink-0 overflow-hidden shadow-inner cursor-zoom-in relative group transition-all hover:border-[#437682]"
                          title="點擊放大檢視藥品外觀與尺規"
                        >
                          {med.imageurl ? (
                            <>
                              <img
                                src={med.imageurl}
                                alt={med.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              {/* 右下角小放大鏡提示標籤 */}
                              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                🔍 放大
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-[#437682] font-bold">暫無圖片</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h3 className={`${typography.medName} leading-tight ${med.isVerified ? 'text-emerald-950' : 'text-[#1e383f]'}`}>
                            {med.name}
                          </h3>
                          <p className={`${typography.medSub} text-slate-600 leading-tight font-medium`}>
                            {med.scientificName}
                          </p>

                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setOpenId(isOpen ? null : med.id)}
                              className={`${typography.infoBtn} rounded-lg border border-[#a6d2e6] bg-[#eef7fb] hover:bg-[#c5e4f2] text-[#1e383f] transition-colors flex items-center gap-1 cursor-pointer font-bold`}
                            >
                              <span>{isOpen ? '收起詳細資訊' : '詳細資訊'}</span>
                              <span className="text-[10px]">{isOpen ? '▲' : '▼'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 應取數量 */}
                      <div className="text-right shrink-0 pr-2">
                        <span className={`${typography.medQtyLabel} block text-slate-500 font-bold mb-0.5`}>應取數量</span>
                        <span className={`${typography.medQtyNum} text-[#437682] leading-none`}>
                          x {med.quantity} <span className={`${typography.badge} font-bold text-slate-600`}>顆</span>
                        </span>
                      </div>
                    </div>

                    {/* 詳細資訊手風琴展開 */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[#a6d2e6] bg-[#f4f9fb] rounded-xl p-3 space-y-1.5 transition-all">
                        <p className={`${typography.infoText} text-slate-800 leading-relaxed`}>
                          <strong className={`${typography.infoTitle} text-[#1e383f]`}>作用：</strong>
                          {med.effect}
                        </p>
                        <p className={`${typography.infoText} text-slate-800 leading-relaxed`}>
                          <strong className={`${typography.infoTitle} text-[#1e383f]`}>副作用：</strong>
                          {med.sideEffects}
                        </p>
                        <p className={`${typography.infoText} text-slate-800 leading-relaxed`}>
                          <strong className={`${typography.infoTitle} text-[#1e383f]`}>用法：</strong>
                          {med.usage}
                        </p>
                      </div>
                    )}
                  </div>

                );
              })}
            </div>
          </section>

          {/* 右側：辨識與操作 */}
          <section className="flex flex-col min-h-0 h-full min-w-0 space-y-3">
            <h2 className={`${typography.panelTitle} text-[#1e383f] transition-all`}>辨識結果</h2>

            <div className="bg-white rounded-xl border border-[#a6d2e6] p-4 shadow-xs flex-1 min-h-0 flex flex-col gap-3">
              {/* 比對狀態提示框 */}
              <div className={`${scanUi.box} border-2 rounded-lg p-3 flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-6 h-6 rounded-full ${scanUi.iconBox} text-white flex items-center justify-center text-xs font-black shrink-0`}>
                    {scanUi.icon}
                  </span>
                  <p className={`${typography.statusTitle} ${scanUi.titleColor} leading-tight`}>
                    {scanUi.title}
                  </p>
                </div>

              </div>

              {/* 虛擬科技感鏡頭視窗 */}
              <div className="relative w-full flex-1 min-h-0 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
                <div className="absolute inset-3 border border-dashed border-[#8ec7df]/80 rounded flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-0.5 bg-[#8ec7df] absolute"></div>
                  <div className="w-0.5 h-3 bg-[#8ec7df] absolute"></div>
                </div>
                <div className="absolute inset-x-0 h-0.5 bg-[#8ec7df] shadow-[0_0_8px_#8ec7df] animate-bounce opacity-85"></div>

                <div className="text-center z-10 space-y-0.5">
                  <span className={`${typography.camLabel} font-mono text-[#8ec7df] tracking-wider block font-black`}>
                    CAMERA STREAM ACTIVE
                  </span>
                  <span className={`${typography.camLabel} text-slate-300 font-medium`}>
                    藥物辨識區域鎖定中
                  </span>
                </div>

                <span className={`absolute top-2 left-2 bg-black/70 text-slate-200 ${typography.camLabel} font-mono px-1.5 py-0.5 rounded border border-white/20 font-bold`}>
                  AI: READY
                </span>
              </div>

              {/* 操作按鈕群組 */}
              <div className="space-y-2 pt-1 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`w-full ${typography.actionBtn} px-4 bg-[#437682] hover:bg-[#345d67] active:scale-[0.99] text-white font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                >
                  <span>🔄</span>
                  重新掃描 (切換狀態)
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className={`w-full ${typography.actionBtn} px-4 bg-white hover:bg-rose-50 active:scale-[0.99] text-rose-700 font-black rounded-lg border-2 border-rose-300 transition-all cursor-pointer`}
                >
                  重新取藥
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {/* ========================================================= */}
      {/*圖片放大 */}

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-4 max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col gap-3 cursor-default"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">

                <h3 className="font-bold text-slate-900 text-base md:text-lg">
                  {previewImage.name} - 藥品外觀
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="關閉"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 min-h-[300px] max-h-[70vh] border border-slate-100">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-xs"
              />
            </div>

            <p className="text-xs text-slate-500 text-center">
              點擊右上角「✕」或背景任一處即可關閉放大檢視
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
