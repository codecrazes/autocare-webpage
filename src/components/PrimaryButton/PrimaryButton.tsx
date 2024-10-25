import React, { FormEvent } from 'react';

interface ButtonProps {
    text: string;
    onClick: (e?: FormEvent<Element>) => void;
}

const PrimaryButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium transition duration-300"
            onClick={onClick}
        >
            <span className="block py-2">{text}</span>
        </button>
    );
};

export default PrimaryButton;
