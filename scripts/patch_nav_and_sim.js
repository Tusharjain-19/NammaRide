const fs = require('fs');

// 1. Patch Navbar.jsx
const navbarPath = 'website/src/components/Navbar.jsx';
let navContent = fs.readFileSync(navbarPath, 'utf8');

// Replace navItems array
const oldNavItems = `  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('simulator'), path: '/simulator' },
    { name: 'Pink Line', path: '/pink-line', badge: 'Nov 13' },
    { name: t('stations'), path: '/stations' },
    { name: t('map'), path: '/map' },
    { name: t('explore'), path: '/explore' },
    { name: t('timings'), path: '/timings' },
    { name: 'Contact', path: '/contact' },
  ];`;

const newNavItems = `  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('simulator'), path: '/simulator' },
    { name: t('pinkLine'), path: '/pink-line', badge: t('pinkLineBadge') },
    { name: t('stations'), path: '/stations' },
    { name: t('map'), path: '/map' },
    { name: t('explore'), path: '/explore' },
    { name: t('timings'), path: '/timings' },
    { name: t('contact'), path: '/contact' },
  ];`;

navContent = navContent.replace(oldNavItems, newNavItems);

// Replace desktop nav item rendering
const oldDesktopNav = `          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  \`text-xs xl:text-sm transition-colors pb-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 \${
                    isActive
                      ? 'text-emerald-500 font-bold border-emerald-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 border-transparent font-medium'
                  }\`
                }
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>`;

const newDesktopNav = `          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navItems.map((item) => {
              if (item.path === '/pink-line') {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      \`group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 \${
                        isActive
                          ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-[#EC4899] dark:border-[#EC4899]/70 ring-2 ring-pink-200 dark:ring-pink-500/20 shadow-sm'
                          : 'bg-pink-50/80 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300/90 border border-pink-200/90 dark:border-pink-500/30 hover:bg-pink-100 dark:hover:bg-pink-900/40 hover:text-pink-800 dark:hover:text-pink-200 hover:border-pink-300 dark:hover:border-pink-500/50 shadow-xs'
                      }\`
                    }
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EC4899]"></span>
                    </span>
                    <span className="tracking-tight">{item.name}</span>
                    {item.badge && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EC4899] text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    \`text-xs xl:text-sm transition-colors pb-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 \${
                      isActive
                        ? 'text-emerald-500 font-bold border-emerald-500'
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 border-transparent font-medium'
                    }\`
                  }
                >
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>`;

navContent = navContent.replace(oldDesktopNav, newDesktopNav);

// Replace mobile nav item rendering
const oldMobileNav = `          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}`;

const newMobileNav = `          {navItems.map((item) => {
            if (item.path === '/pink-line') {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-500/30 text-pink-700 dark:text-pink-300 font-bold text-sm shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EC4899]"></span>
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EC4899] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{item.name}</span>
              </Link>
            );
          })}`;

navContent = navContent.replace(oldMobileNav, newMobileNav);

fs.writeFileSync(navbarPath, navContent, 'utf8');
console.log('Navbar.jsx updated with design.md Pink Line UI!');

// 2. Patch SimulatorPage.jsx
const simPath = 'website/src/pages/SimulatorPage.jsx';
let simContent = fs.readFileSync(simPath, 'utf8');

if (!simContent.includes('useLanguage')) {
  simContent = simContent.replace(
    "import { useTheme } from '../context/ThemeContext';",
    "import { useTheme } from '../context/ThemeContext';\nimport { useLanguage } from '../context/LanguageContext';"
  );
}

if (!simContent.includes('const { lang, setLang } = useLanguage();')) {
  simContent = simContent.replace(
    "const { theme } = useTheme();",
    "const { theme } = useTheme();\n  const { lang, setLang } = useLanguage();"
  );
}

// Add lang sync effect if not present
if (!simContent.includes('NAMMARIDE_LANG_CHANGED')) {
  const syncEffect = `  // Sync language to simulator iframe when language changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_LANG_CHANGED', lang: lang }, '*');
      } catch (e) {
        // Safe fallback
      }
    }
  }, [lang]);
`;
  simContent = simContent.replace(
    "  // Sync theme to simulator iframe when theme changes",
    `${syncEffect}  // Sync theme to simulator iframe when theme changes`
  );

  // In handleMessage:
  simContent = simContent.replace(
    "if (event.data && event.data.type === 'NAMMARIDE_VIEW_CHANGED') {",
    `if (event.data && event.data.type === 'NAMMARIDE_LANG_CHANGED' && event.data.lang) {
        if (event.data.lang !== lang) {
          setLang(event.data.lang);
        }
      }
      if (event.data && event.data.type === 'NAMMARIDE_VIEW_CHANGED') {`
  );

  // In handleIframeLoad:
  simContent = simContent.replace(
    "iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_THEME_CHANGED', theme: theme }, '*');",
    `iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_THEME_CHANGED', theme: theme }, '*');\n        iframeRef.current.contentWindow.postMessage({ type: 'NAMMARIDE_LANG_CHANGED', lang: lang }, '*');`
  );
}

fs.writeFileSync(simPath, simContent, 'utf8');
console.log('SimulatorPage.jsx updated with language syncing!');
