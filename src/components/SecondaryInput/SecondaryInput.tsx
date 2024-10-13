import React, { useState } from 'react';
import Image from 'next/image';

interface SecondaryInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    placeholder?: string;
    name: string;
    required?: boolean;
    className?: string;
}

const SecondaryInput: React.FC<SecondaryInputProps> = ({
    value,
    placeholder,
    name,
    onChange,
    onFocus,
    required = false,
    className = ''
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                required={required}
                className={`w-[280px] h-[50px] rounded-[12px] bg-[#F5F7FA] text-[#565656] font-roboto text-[15px] font-normal leading-[120%] border-none px-[15px] pr-[40px] transition-shadow duration-300 ease focus:outline-none focus:shadow-md ${className}`}
            />
            <div
                onClick={togglePasswordVisibility}
                className="absolute right-[15px] top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
                <Image
                    src={showPassword ? '/img/closed-eye.svg' : '/img/open-eye.svg'}
                    alt="Toggle password visibility"
                    width={20}
                    height={20}
                />
            </div>
        </div>
    );
};

export default SecondaryInput;
