import React from 'react';
import Image from 'next/image';

interface LogoProps {
    link: string;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ link, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (onClick) onClick();
    };

    return (
        <div className="flex items-center relative">
            <a href={link} onClick={handleClick}>
                <Image
                    className="w-[179px] h-[29px] md:w-[150px] md:h-[24px]"
                    src="/img/logo.svg"
                    alt="Carro minimalista com duas circunferências representando as rodas e alguns traços sugerindo a forma de um veículo"
                    width={179}
                    height={29}
                />
            </a>
        </div>
    );
};

export default Logo;
