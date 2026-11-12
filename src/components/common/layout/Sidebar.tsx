import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', label: 'HOME',
      icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    },
    { 
      path: '/explorer', label: 'EXPLORER',
      icon: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>
    },
    { 
      path: '/compare', label: 'COMPARE',
      icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>
    },
    { 
      path: '/ranking', label: 'RANKING',
      icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></>
    },
    { 
      path: '/predict', label: 'PREDICT',
      icon: <><path d="M18 20V10M12 20V4M6 20v-6"/></>
    },
    { 
      path: '/assistant', label: 'ASSISTANT',
      icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>
    },
  ];

  return (
    <aside className="w-64 bg-black border-r border-[#1a1a1a] flex flex-col h-full shrink-0 font-mono">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 gap-3 shrink-0">
        <svg className="w-5 h-5 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z"/>
        </svg>
        <span className="text-[#FF5500] font-bold tracking-widest text-[13px] uppercase">FLAMESYNC</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-3 rounded text-[11px] font-bold tracking-widest uppercase flex items-center gap-4 transition-colors ${
                isActive 
                  ? 'bg-[#FF5500]/10 text-[#FF5500]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <svg className={`w-4 h-4 ${isActive ? 'text-[#FF5500]' : 'text-gray-600'}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings Bottom Link */}
      <div className="px-4 pb-8 shrink-0">
        <Link to="/settings" className="px-3 py-3 rounded text-[11px] font-bold tracking-widest uppercase flex items-center gap-4 text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          SETTINGS
        </Link>
      </div>
    </aside>
  );
}