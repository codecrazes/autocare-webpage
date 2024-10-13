import React from 'react';

interface TextInputProps {
    type?: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    required?: boolean;
    className?: string;
}

const PrimaryInput: React.FC<TextInputProps> = ({
    type = 'text',
    placeholder,
    name,
    value,
    onChange,
    onFocus,
    required = false,
    className = ''
}) => {
    return (
        <div className="mb-1.5">
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                required={required}
                className={`w-[280px] h-[50px] rounded-[12px] bg-[#F5F7FA] text-[#565656] font-roboto text-[15px] font-normal leading-[120%] border-none pl-[15px] pr-[40px] transition-shadow duration-300 ease-in-out outline-none focus:shadow-[0_0_5px_#565656] ${className}`}
            />
        </div>
    );
};

export default PrimaryInput;
