import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';
import ProfileDropdown from '../auth/ProfileDropdown';
import Button from './Button';
import logo from '../../assets/images/logo-1.svg';
import { features } from '../../data/featuresData';

// Feature dropdown component
const FeatureDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors flex items-center"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Features
        <svg
          className={`ml-1 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50 py-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 transition-colors"
              onClick={() => handleNavigate(`/features/${feature.id}`)}
            >
              <div className="font-medium text-neutral-900 dark:text-neutral-100">{feature.name}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">{feature.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Tool dropdown component
const ToolDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {

    const dropdownRefClientRect = dropdownRef.current && dropdownRef.current.getBoundingClientRect();
    if (!dropdownRefClientRect) return;
    const isMouseInsideDropdownRef =
      event.clientX >= dropdownRefClientRect.left &&
      event.clientX <= dropdownRefClientRect.right &&
      event.clientY >= dropdownRefClientRect.top &&
      event.clientY <= (dropdownRefClientRect.bottom + dropdownRefClientRect.height * 0.8);
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !(isMouseInsideDropdownRef)) {
      setIsOpen(false);
      document.removeEventListener('mousemove', handleClickOutside);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        className="font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors flex items-center"
        onMouseEnter={() => { setIsOpen(true); document.addEventListener('mousemove', handleClickOutside); }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <svg
          className={`ml-1 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50"
        >
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Theme toggle using global function
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'));

    // Listen for theme changes
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const handleClick = () => {
    if (window.toggleTheme) {
      const newIsDark = window.toggleTheme();
      setIsDark(newIsDark);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isDark ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        )}
      </svg>
    </button>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Templates', path: '/templates' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const toolMenus = {
    csv: {
      title: 'CSV Tools',
      items: [
        { name: 'CSV Generator', path: '/csv/generate', description: 'Create custom CSV files with sample data' },
        { name: 'CSV Mapper', path: '/csv/map', description: 'Transform CSV structure' },
        { name: 'CSV Converter', path: '/csv/convert', description: 'Convert to other formats' },
        { name: 'CSV Validator', path: '/csv/validate', description: 'Check CSV data integrity' },
        { name: 'CSV Editor', path: '/csv/visualize', description: 'Edit & visualize' }
      ]
    },
    json: {
      title: 'JSON Tools',
      items: [
        { name: 'JSON Generator', path: '/json/generate', description: 'Create JSON with structured data' },
        { name: 'JSON Mapper', path: '/json/map', description: 'Transform JSON schema' },
        { name: 'JSON Converter', path: '/json/convert', description: 'Convert to other formats' },
        { name: 'JSON Formatter', path: '/json/format', description: 'Validate JSON schema & Beautify JSON' },
        { name: 'JSON Editor', path: '/json/visualize', description: 'Visual editor' }
      ]
    },
    edi: {
      title: 'EDI Tools',
      items: [
        { name: 'EDI Generator', path: '/edi/generate', description: 'Create EDI documents' },
        { name: 'EDI Mapper', path: '/edi/map', description: 'Map EDI segments' },
        { name: 'EDI Converter', path: '/edi/convert', description: 'Convert to other formats' },
        { name: 'EDI Validator', path: '/edi/validate', description: 'Validate EDI compliance' },
        { name: 'EDI Parser', path: '/edi/parse', description: 'Parse EDI files' }
      ]
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-soft py-2'
        : 'bg-white dark:bg-neutral-900 py-4'
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Mapverter Logo"
            className="h-10 w-auto dark:brightness-0 dark:invert"
          />
          <span className="ml-2 text-xl font-bold text-blue-811 dark:text-blue-811 hidden md:block">
            Mapverter
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors ${location.pathname === link.path
                ? 'text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
            >
              {link.name}
            </Link>
          ))}
          {/* <FeatureDropdown /> */}
          {/* Tool Dropdowns */}
          {Object.entries(toolMenus).map(([key, menu]) => (
            <ToolDropdown
              key={key}
              title={menu.title}
              items={menu.items}
            />
          ))}
        </div>

        {/* Auth Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`font-medium transition-colors ${location.pathname === '/dashboard'
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} />
            </>
          ) : (
            <>
              {import.meta.env.isActiveSignupFeatures && (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 font-medium transition-colors ${location.pathname === link.path
                  ? 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Tool Menus */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2">
              {Object.entries(toolMenus).map(([key, menu]) => (
                <div key={key} className="px-4 py-2">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">{menu.title}</div>
                  <div className="pl-4 space-y-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block py-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 px-4 flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;