/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Ship, 
  Truck, 
  Search, 
  ArrowRight, 
  Package, 
  Globe, 
  ShieldCheck, 
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calculator,
  X,
  CalculatorIcon,
  Menu,
  ChevronRight,
  Layers,
  LayoutDashboard,
  ShoppingBag,
  Users as UsersIcon,
  Newspaper,
  LogOut,
  Plus,
  Trash2,
  ChevronDown,
  MessageSquare,
  User,
  Mail,
  Lock
} from 'lucide-react';

// --- Types ---

interface Order {
  id: string;
  customer: string;
  item: string;
  status: 'В обработке' | 'В пути' | 'На складе' | 'Доставлен';
  date: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

// --- Initial Data ---

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-1024', customer: 'Алексей Иванов', item: 'Электроника', status: 'В пути', date: '2024-04-10' },
  { id: 'ORD-1025', customer: 'Марат Сафин', item: 'Одежда', status: 'На складе', date: '2024-04-12' },
  { id: 'ORD-1026', customer: 'Елена Ким', item: 'Запчасти', status: 'В обработке', date: '2024-04-13' },
];

const INITIAL_NEWS: NewsItem[] = [
  { id: '1', title: 'Новый склад в Гуанчжоу', content: 'Мы открыли современный логистический хаб для ускорения обработки грузов.', date: '2024-04-01' },
  { id: '2', title: 'Снижение тарифов на авиаперевозки', content: 'Благодаря оптимизации маршрутов мы снижаем цены на 15%.', date: '2024-03-25' },
];

const INITIAL_USERS: UserData[] = [
  { id: '1', name: 'Алексей Иванов', email: 'alex@example.com' },
  { id: '2', name: 'Марат Сафин', email: 'marat@example.com' },
];

// --- Components ---

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'news'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  useEffect(() => {
    const savedOrders = localStorage.getItem('fc_orders');
    const savedUsers = localStorage.getItem('fc_users');
    const savedNews = localStorage.getItem('fc_news');

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    else {
      localStorage.setItem('fc_orders', JSON.stringify(INITIAL_ORDERS));
      setOrders(INITIAL_ORDERS);
    }

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else {
      localStorage.setItem('fc_users', JSON.stringify(INITIAL_USERS));
      setUsers(INITIAL_USERS);
    }

    if (savedNews) setNews(JSON.parse(savedNews));
    else {
      localStorage.setItem('fc_news', JSON.stringify(INITIAL_NEWS));
      setNews(INITIAL_NEWS);
    }
  }, []);

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('fc_orders', JSON.stringify(updated));
  };

  const addNews = (e: FormEvent) => {
    e.preventDefault();
    const newItem: NewsItem = {
      id: Date.now().toString(),
      title: newNews.title,
      content: newNews.content,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...news];
    setNews(updated);
    localStorage.setItem('fc_news', JSON.stringify(updated));
    setNewNews({ title: '', content: '' });
  };

  const deleteNews = (id: string) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    localStorage.setItem('fc_news', JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-surface-variant/10 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <Package className="text-primary w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">FlowCargo Admin</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <ShoppingBag className="w-5 h-5" /> Заказы
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <UsersIcon className="w-5 h-5" /> Пользователи
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'news' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <Newspaper className="w-5 h-5" /> Новости
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" /> Выйти
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-extrabold tracking-tight capitalize">
            {activeTab === 'orders' ? 'Управление заказами' : activeTab === 'users' ? 'База пользователей' : 'Редактор новостей'}
          </h1>
          <p className="text-text-secondary mt-2">Панель управления логистической архитектурой FlowCargo.</p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-surface rounded-3xl shadow-ambient overflow-hidden"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-variant/10">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">ID</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Клиент</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Груз</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Статус</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-surface-variant/5 hover:bg-surface-container transition-colors">
                      <td className="px-8 py-6 font-mono text-sm text-primary">{order.id}</td>
                      <td className="px-8 py-6 font-medium">{order.customer}</td>
                      <td className="px-8 py-6 text-text-secondary">{order.item}</td>
                      <td className="px-8 py-6">
                        <div className="relative inline-block">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="appearance-none bg-surface-container border border-surface-variant/20 rounded-lg px-4 py-2 pr-10 text-sm font-bold focus:outline-none focus:border-primary transition-all cursor-pointer"
                          >
                            <option>В обработке</option>
                            <option>В пути</option>
                            <option>На складе</option>
                            <option>Доставлен</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-text-secondary text-sm">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4"
            >
              {users.map(user => (
                <div key={user.id} className="bg-surface p-6 rounded-2xl flex items-center justify-between shadow-ambient border border-surface-variant/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{user.name}</h4>
                      <p className="text-text-secondary text-sm">{user.email}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-all">
                    Профиль
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div 
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              {/* Add News Form */}
              <div className="bg-surface p-8 rounded-3xl shadow-ambient h-fit">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Опубликовать новость
                </h3>
                <form onSubmit={addNews} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Заголовок</label>
                    <input 
                      type="text" 
                      required
                      value={newNews.title}
                      onChange={e => setNewNews({...newNews, title: e.target.value})}
                      className="w-full py-2 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none transition-all text-text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Текст новости</label>
                    <textarea 
                      required
                      rows={4}
                      value={newNews.content}
                      onChange={e => setNewNews({...newNews, content: e.target.value})}
                      className="w-full py-2 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none transition-all text-text-primary font-medium resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/10"
                  >
                    Опубликовать
                  </button>
                </form>
              </div>

              {/* News List */}
              <div className="space-y-4">
                {news.map(item => (
                  <div key={item.id} className="bg-surface p-6 rounded-2xl shadow-ambient border border-surface-variant/5 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{item.date}</span>
                      </div>
                      <button 
                        onClick={() => deleteNews(item.id)}
                        className="p-2 text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email === 'test@gmail.com' && password === '1234') {
      sessionStorage.setItem('fc_auth', 'true');
      onLogin();
      onClose();
    } else {
      setError('Неверный email или пароль');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0D0D0D] p-10 rounded-[2.5rem] border border-white/5 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            {/* Top Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#00FF9D]/20 blur-2xl rounded-full" />
                <div className="relative w-16 h-16 bg-[#00FF9D] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,157,0.3)]">
                  <span className="text-3xl font-display font-black text-black">F</span>
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Вход в аккаунт</h2>
              <p className="text-white/40 text-sm mt-1">Войдите, чтобы управлять вашими заказами</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="email" 
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/5 rounded-2xl focus:border-[#00FF9D]/50 outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/5 rounded-2xl focus:border-[#00FF9D]/50 outline-none transition-all text-white"
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs font-bold text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-xl shadow-white/5"
              >
                Продолжить
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[150] bg-background flex flex-col p-8"
        >
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#00FF9D] rounded-xl flex items-center justify-center">
                <Package className="text-black w-5 h-5" />
              </div>
              <span className="text-xl font-display font-black tracking-tight text-white">FlowCargo</span>
            </div>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="mt-auto">
            <button className="w-full py-5 bg-[#00FF9D] text-black rounded-full font-bold text-xl shadow-[0_0_30px_rgba(0,255,157,0.2)]">
              Начать работу
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CalculatorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    type: 'Standard'
  });
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isWeightValid = formData.weight !== '' && parseFloat(formData.weight) > 0;

  const calculate = (e: FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) return;

    setIsCalculating(true);
    setShowResult(false);
    setResult(null);

    setTimeout(() => {
      const weightVal = parseFloat(formData.weight) || 0;
      const randomDist = Math.floor(Math.random() * 5000) + 1000;
      const total = (weightVal * 500) + randomDist;
      setResult(total);
      setIsCalculating(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface/90 backdrop-blur-[20px] rounded-3xl shadow-ambient overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <CalculatorIcon className="w-5 h-5 text-background" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Калькулятор доставки</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={calculate} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Откуда</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Город, Страна"
                      value={formData.origin}
                      onChange={e => setFormData({...formData, origin: e.target.value})}
                      className="w-full py-2 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none transition-all text-text-primary font-medium placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Куда</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Город, Страна"
                      value={formData.destination}
                      onChange={e => setFormData({...formData, destination: e.target.value})}
                      className="w-full py-2 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none transition-all text-text-primary font-medium placeholder:text-text-secondary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Вес (кг)</label>
                    <input 
                      type="number" 
                      required
                      min="0.1"
                      step="0.1"
                      placeholder="0.00"
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                      className={`w-full py-2 bg-transparent border-b-2 outline-none transition-all text-text-primary font-medium placeholder:text-text-secondary/30 ${
                        formData.weight !== '' && parseFloat(formData.weight) <= 0 ? 'border-red-500' : 'border-surface-variant focus:border-primary'
                      }`}
                    />
                    {formData.weight !== '' && parseFloat(formData.weight) <= 0 && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">Вес должен быть больше 0</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Тип груза</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full py-2 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none transition-all text-text-primary font-medium appearance-none"
                    >
                      <option className="bg-surface">Стандартный</option>
                      <option className="bg-surface">Хрупкий</option>
                      <option className="bg-surface">Опасный</option>
                      <option className="bg-surface">Температурный режим</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!isWeightValid || isCalculating}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex flex-col items-center justify-center gap-2 ${
                    !isWeightValid || isCalculating 
                      ? 'bg-primary/50 text-background/50 cursor-not-allowed' 
                      : 'bg-[#00FF9D] text-black hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:brightness-110'
                  }`}
                >
                  {isCalculating ? 'Расчет...' : 'Рассчитать стоимость'}
                  {isCalculating && (
                    <div className="w-full max-w-[120px] h-1 mt-1">
                      <SegmentedPulse progress={0.7} />
                    </div>
                  )}
                </button>
              </form>

              <AnimatePresence>
                {showResult && result !== null && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-8 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-4">Примерная стоимость</p>
                    <h3 className="text-[2.5rem] md:text-[3rem] font-display font-extrabold text-[#00FF9D] tracking-tight leading-none mb-6">
                      {result.toLocaleString()} ₸
                    </h3>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <p className="text-sm text-text-secondary font-medium">Срок доставки: <span className="text-text-primary">5-7 дней</span></p>
                      <p className="text-sm text-text-secondary font-medium">Маршрут: <span className="text-text-primary">Гуанчжоу → Алматы</span></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SegmentedPulse = ({ progress }: { progress: number }) => {
  const segments = 10;
  return (
    <div className="flex gap-1 w-full h-2">
      {Array.from({ length: segments }).map((_, i) => {
        const isActive = (i + 1) / segments <= progress;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, scaleX: 0.8 }}
            animate={{ 
              opacity: isActive ? 1 : 0.2,
              scaleX: 1,
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface-variant)',
            }}
            transition={{ delay: i * 0.05 }}
            className="flex-1 rounded-full h-full"
          />
        );
      })}
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative p-8 bg-surface rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-ambient border border-surface-variant/10"
    >
      {/* Ghost Border Fallback Effect */}
      <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none" />
      
      <div className="mb-6 p-4 bg-surface-container rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
        <Icon className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-text-primary">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
      
      <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Подробнее <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </motion.div>
  );
};

const FadeInUp = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0.3);

  useEffect(() => {
    const auth = sessionStorage.getItem('fc_auth');
    if (auth === 'true') setIsAdmin(true);
  }, []);

  const handleTrack = () => {
    const isValid = /^FLW-\d{4}-\d{2}$/.test(refNumber);
    if (isValid) {
      setStatus('loading');
      setTimeout(() => {
        setStatus('success');
        setProgress(1);
      }, 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (isAdmin) {
    return <AdminDashboard onLogout={() => { sessionStorage.removeItem('fc_auth'); setIsAdmin(false); }} />;
  }

  return (
    <div className="min-h-screen font-sans bg-background text-text-primary">
      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={() => setIsAdmin(true)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Navigation - Simplified with only logo and buttons */}
      <nav className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 bg-[#00FF9D] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)] group-hover:scale-105 transition-transform">
              <Package className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-display font-black tracking-tight text-white">FlowCargo</span>
          </div>

          {/* Buttons (Right) */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="text-sm font-bold text-white/60 hover:text-[#00FF9D] transition-colors duration-300"
            >
              Регистрация
            </button>
            <button className="px-7 py-2.5 bg-[#00FF9D] text-black rounded-full text-sm font-bold hover:shadow-[0_0_25px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              Начать работу
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Globe className="w-3 h-3" />
              China to Kazakhstan
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] mb-8 tracking-tight">
              Доставка грузов из Китая в Казахстан
            </h1>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-lg">
              Профессиональные логистические решения с архитектурным подходом к каждому маршруту.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-background rounded-xl font-bold text-lg hover:brightness-110 transition-all beveled-glow shadow-ambient shadow-primary/20 flex items-center gap-2">
                Начать работу <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#about" className="px-8 py-4 bg-surface text-text-primary rounded-xl font-bold text-lg hover:bg-surface-container transition-all shadow-ambient flex items-center justify-center">
                О нас
              </a>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            {/* Track Shipments Card */}
            <div className="bg-surface p-8 rounded-3xl shadow-ambient relative overflow-hidden border border-surface-variant/10">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Package className="w-32 h-32 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Отследить груз</h2>
              <p className="text-text-secondary mb-8">Например, FLW-1234-56</p>
              
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. FLW-1234-56"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                    className={`w-full px-6 py-4 bg-surface-container rounded-xl outline-none transition-all font-mono text-lg text-text-primary ${
                      status === 'error' ? 'ring-4 ring-red-500/10' : 'focus:ring-4 focus:ring-primary/10'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {status === 'loading' ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : status === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : status === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <Search className="w-6 h-6 text-text-secondary" />
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleTrack}
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-ambient"
                >
                  {status === 'loading' ? 'Поиск...' : 'Отследить'}
                </button>

                <div className="pt-4">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">Segmented Pulse</span>
                    <span className="text-2xl font-display font-bold text-primary tracking-tight">{Math.round(progress * 100)}%</span>
                  </div>
                  <SegmentedPulse progress={progress} />
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* About Us Section - Hardcoded Russian */}
      <section id="about" className="overflow-hidden">
        {/* Part 1: History & Mission */}
        <div className="py-32 bg-surface relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                История и Миссия
              </div>
              <h2 className="text-5xl font-display font-extrabold text-text-primary mb-8 tracking-tight leading-tight">
                8 лет эволюции: от одного склада до глобальной сети
              </h2>
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                FlowCargo начала свой путь в 2016 году с небольшого склада в Гуанчжоу. Сегодня мы — крупнейшая логистическая сеть, объединяющая Китай и Казахстан. Наша миссия — сделать международную торговлю доступной и прозрачной.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Мы внедрили концепцию «умной логистики», исключив всех посредников из цепочки поставок. Это позволяет нам гарантировать лучшую цену и полный контроль над сохранностью вашего груза на каждом километре пути.
              </p>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <img 
                  src="https://picsum.photos/seed/history/800/600" 
                  alt="FlowCargo History" 
                  className="relative z-10 rounded-3xl shadow-2xl border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-2xl z-0" />
              </div>
            </FadeInUp>
          </div>
        </div>

        {/* Part 2: China Presence */}
        <div className="py-32 bg-surface-container relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <FadeInUp>
              <div className="lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                  Наше присутствие в Китае
                </div>
              <h2 className="text-5xl font-display font-extrabold text-text-primary mb-8 tracking-tight leading-tight">
                Собственная инфраструктура в сердце производства
              </h2>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Наш главный хаб в Гуанчжоу площадью 1500 м² оборудован по последнему слову техники. Также мы располагаем стратегическими складами в Иу и Урумчи, что позволяет охватить все ключевые производственные регионы Китая.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-surface rounded-2xl border border-white/5">
                  <h4 className="text-primary font-bold text-xl mb-2">1500 м²</h4>
                  <p className="text-xs text-text-secondary uppercase tracking-widest">Склад в Гуанчжоу</p>
                </div>
                <div className="p-6 bg-surface rounded-2xl border border-white/5">
                  <h4 className="text-primary font-bold text-xl mb-2">0 ₸</h4>
                  <p className="text-xs text-text-secondary uppercase tracking-widest">Консолидация</p>
                </div>
              </div>
              <p className="mt-8 text-text-secondary italic text-sm">
                *Мы предоставляем бесплатную проверку на брак и подробный фото-отчет при поступлении товара на склад.
              </p>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="lg:order-1 relative lg:-ml-20">
                <img 
                  src="https://picsum.photos/seed/warehouse-china/900/700" 
                  alt="China Warehouse" 
                  className="rounded-3xl shadow-2xl z-10 relative"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
              </div>
            </FadeInUp>
          </div>
        </div>

        {/* Part 3: Kazakhstan Hubs */}
        <div className="py-32 bg-surface relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                Хабы в Казахстане
              </div>
              <h2 className="text-5xl font-display font-extrabold text-text-primary mb-8 tracking-tight leading-tight">
                Разветвленная сеть распределительных центров
              </h2>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Наш главный распределительный центр находится в Алматы, откуда грузы расходятся по всей стране. Мы открыли полноценные филиалы в Астане, Шымкенте и Караганде, чтобы обеспечить минимальные сроки доставки до вашей двери.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Алматы', 'Астана', 'Шымкент', 'Караганда'].map(city => (
                  <span key={city} className="px-4 py-2 bg-surface-container rounded-full text-sm font-bold border border-white/5">
                    {city}
                  </span>
                ))}
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="relative lg:-mr-20">
                <img 
                  src="https://picsum.photos/seed/kazakhstan-logistics/900/600" 
                  alt="Kazakhstan Hub" 
                  className="rounded-3xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00FF9D]/20 rounded-full blur-2xl" />
              </div>
            </FadeInUp>
          </div>
        </div>

        {/* Part 4: Why Us */}
        <div className="py-32 bg-surface-container">
          <div className="max-w-7xl mx-auto px-6 text-center mb-20">
            <h2 className="text-5xl font-display font-extrabold text-text-primary mb-6 tracking-tight">
              Почему выбирают FlowCargo
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Мы создали сервис, который закрывает все боли предпринимателей при работе с Китаем.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Newspaper, title: 'Фото-отчет', desc: 'Детальные снимки вашего груза при получении на складе в Китае.' },
              { icon: ShieldCheck, title: 'Страхование 100%', desc: 'Полная финансовая ответственность за сохранность вашего товара.' },
              { icon: Truck, title: 'Собственный автопарк', desc: 'Современные фуры объемом 90-120 кубов для любых типов грузов.' },
              { icon: Layers, title: 'Таможня «под ключ»', desc: 'Берем на себя все вопросы по оформлению и очистке груза.' },
              { icon: User, title: 'Персональный менеджер', desc: 'Ваш личный эксперт на связи 24/7 по любым вопросам.' },
              { icon: CheckCircle2, title: 'Честные цены', desc: 'Никаких скрытых платежей и комиссий. Все прозрачно.' }
            ].map((item, i) => (
              <div key={i}>
                <FadeInUp delay={i * 0.1}>
                  <div className="p-8 bg-surface rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-text-primary">{item.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeInUp>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}