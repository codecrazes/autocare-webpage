import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '@/components/Logo/Logo';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const getClassName = (path) => {
    return `text-gray-600 text-sm ${router.pathname === path ? 'text-black' : ''}`;
  };

  return (
    <header className="flex items-center justify-between py-5 px-12 bg-gray-100">
      <div className="flex items-center">
        <Logo link="/" onClick={handleLogoClick} />
      </div>
      <div className="flex items-center gap-4">
        <nav className={`flex items-center gap-9 ${isMenuOpen ? 'flex-col' : 'hidden'} md:flex md:flex-row pr-5 cursor-pointer`}>
          <a className={getClassName('/')} onClick={() => handleNavigation('/')}>Home</a>
          <a className={getClassName('/about')} onClick={() => handleNavigation('/about')}>Sobre</a>
          <a className={getClassName('/contact')} onClick={() => handleNavigation('/contact')}>Contato</a>
          <a className={getClassName('/services')} onClick={() => handleNavigation('/services')}>Serviços</a>
          <button className="md:hidden" onClick={toggleMenu}>
            <Image src="/img/close-icon.svg" alt="Fechar Menu" width={20} height={20} />
          </button>
        </nav>
        <button
          className="bg-blue-600 text-white rounded-full px-7 py-2 md:block"
          onClick={() => handleNavigation('/login')}
        >
          Login
        </button>
        <button className="block md:hidden" onClick={toggleMenu}>
          <Image src="/img/close-icon.svg" alt="Menu" width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
