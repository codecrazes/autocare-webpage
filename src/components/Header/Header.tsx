import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiFetch from '@/utils/APIFetch';
import Logo from '@/components/Logo/Logo';
import { Menu, MenuItem, Avatar, Divider, IconButton, Tooltip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      apiFetch('/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((user) => {
          setUserInitial(user.first_name[0]);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário", error);
        });
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (option: string) => () => {
    handleClose();
    if (option === 'logoff') {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      router.push('/login');
    } else if (option === 'profile') {
      handleNavigation('/my-account');
    } else if (option === 'settings') {
      handleNavigation('/settings');
    } else if (option === 'bookings') {
      handleNavigation('/bookings');
    }
  };

  const getClassName = (path: string) => {
    return `cursor-pointer text-gray-600 text-sm ${router.pathname === path ? 'text-black' : ''}`;
  };

  return (
    <header className="flex items-center justify-between py-5 px-12 bg-gray-100">
      <div className="flex items-center">
        <Logo link="/" onClick={() => handleNavigation('/')} />
      </div>
      <div className="flex items-center gap-4">
        <nav className={`flex items-center gap-9 ${isMenuOpen ? 'flex-col' : 'hidden'} md:flex md:flex-row pr-5`}>
          <a className={getClassName('/')} onClick={() => handleNavigation('/')}>Home</a>
          <a className={getClassName('/about')} onClick={() => handleNavigation('/about')}>Sobre</a>
          <a className={getClassName('/contact')} onClick={() => handleNavigation('/contact')}>Contato</a>
          <a className={getClassName('/services')} onClick={() => handleNavigation('/services')}>Serviços</a>
          <button className="md:hidden" onClick={toggleMenu}>
            <Image src="/img/close-icon.svg" alt="Fechar Menu" width={20} height={20} />
          </button>
        </nav>
        {isLoggedIn ? (
          <div className="flex items-center">
            <Tooltip title="Account settings">
              <IconButton onClick={handleClick} size="small" aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true">
                <Avatar sx={{ width: 37, height: 37, bgcolor: '#0071E3' }}>{userInitial}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClick('profile')}>
                <Avatar /> Minha conta
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClick('bookings')}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                Meus agendamentos
              </MenuItem>
              <MenuItem onClick={handleMenuClick('settings')}>
                <Settings fontSize="small" sx={{ mr: 1 }} />
                Configurações
              </MenuItem>
              <MenuItem onClick={handleMenuClick('logoff')}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <button className="bg-blue-600 text-white rounded-full px-7 py-2" onClick={() => handleNavigation('/login')}>
            Login
          </button>
        )}
        <button className="block md:hidden" onClick={toggleMenu}>
          <Image src="/img/menu-icon.svg" alt="Menu" width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
