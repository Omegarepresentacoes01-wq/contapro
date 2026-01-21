
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  FileText, 
  Settings, 
  PieChart, 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  Sun, 
  Moon,
  ChevronDown,
  BarChart3,
  X
} from 'lucide-react';
import { Button, Input } from './ui';
import { useAuth } from '../App';

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 transform ${
      active 
        ? 'bg-primary text-white shadow-xl shadow-primary/40 translate-x-2' 
        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white hover:translate-x-1'
    }`}
  >
    <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-blue-400 opacity-80'}`} />
    {label}
  </Link>
);

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/financeiro/receber', icon: DollarSign, label: 'Contas a Receber' },
    { to: '/financeiro/pagar', icon: DollarSign, label: 'Contas a Pagar' },
    { to: '/financeiro/fluxo-caixa', icon: BarChart3, label: 'Fluxo de Caixa' },
    { to: '/cadastros/clientes', icon: Users, label: 'Clientes' },
    { to: '/cadastros/funcionarios', icon: Users, label: 'Funcionários' },
    { to: '/folha/pagamento', icon: FileText, label: 'Folha de Pagamento' },
    { to: '/relatorios', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] bg-[#f8fafc] dark:bg-[#020617]">
      {/* Sidebar - Desktop (Oculto na impressão e em mobile) */}
      <div className="hidden border-r-2 border-slate-800/50 bg-[#0f172a] md:block shadow-2xl z-20 print:hidden">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-16 items-center px-6 border-b-2 border-slate-800/50 mb-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tighter">CONTA<span className="text-blue-400">PRO</span></span>
            </Link>
          </div>
          
          <div className="flex-1 px-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 opacity-70">Menu Principal</p>
            <nav className="grid gap-2">
              {menuItems.slice(0, 4).map((item) => (
                <SidebarItem 
                  key={item.to} 
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  active={location.pathname === item.to}
                />
              ))}
            </nav>

            <div className="pt-6">
              <p className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 opacity-70">Administrativo</p>
              <nav className="grid gap-2">
                {menuItems.slice(4).map((item) => (
                  <SidebarItem 
                    key={item.to} 
                    to={item.to} 
                    icon={item.icon} 
                    label={item.label} 
                    active={location.pathname === item.to}
                  />
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-auto p-4 border-t-2 border-slate-800/50">
             <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-slate-300 font-bold hover:bg-red-500/20 hover:text-red-400 transition-all rounded-xl py-6" 
                onClick={logout}
             >
                <LogOut className="h-5 w-5 text-red-400" /> 
                <span>Sair do Sistema</span>
             </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm md:hidden animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs border-r border-slate-800 bg-[#0f172a] p-6 shadow-2xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <PieChart className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-black text-lg">CONTA<span className="text-blue-400">PRO</span></span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                  <X className="h-6 w-6" />
                </Button>
             </div>
             
             <div className="space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Principal</p>
                  {menuItems.slice(0, 4).map((item) => (
                    <SidebarItem key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Administrativo</p>
                  {menuItems.slice(4).map((item) => (
                    <SidebarItem key={item.to} {...item} active={location.pathname === item.to} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </div>
             </div>

             <div className="absolute bottom-6 left-6 right-6">
                <Button variant="ghost" className="w-full justify-start gap-2 text-red-400" onClick={logout}>
                   <LogOut className="h-4 w-4" /> Sair
                </Button>
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col print:w-full print:block">
        {/* Topbar (Oculto na impressão) */}
        <header className="flex h-16 items-center gap-4 border-b-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2 md:hidden">
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
               <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
             </Button>
          </div>
          
          <div className="w-full flex-1">
             {/* Espaço flexível - Busca removida pois era apenas visual */}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </Button>
            
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setHasNotifications(false)}
            >
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              {hasNotifications && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>}
            </Button>
            
            <div className="h-8 w-[2px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">João Silva</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Administrador</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-inner">
                  JS
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
};
