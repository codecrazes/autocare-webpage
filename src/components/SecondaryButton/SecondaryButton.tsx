import React from 'react';

interface SecondaryButtonProps {
    text: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ text, onClick, type = 'submit' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="relative top-0 left-0 rounded-[12px] bg-[#27272b] text-white w-full h-[50px] overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#3c3c42] hover:scale-105"
        >
            <div className="flex justify-center items-center h-full text-[16px]">
                {text}
            </div>
        </button>
    );
};

export default SecondaryButton;
