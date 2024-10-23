import React from 'react';

interface SelectInputProps {
    name: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: () => void;
    required?: boolean;
    className?: string;
}

const PrimarySelect: React.FC<SelectInputProps> = ({
    name,
    value,
    options,
    onChange,
    onFocus,
    required = false,
    className = ''
}) => {
    return (
        <div className="mb-1.5">
            <select
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                required={required}
                className={`w-full h-[50px] rounded-[12px] bg-[#F5F7FA] text-[#565656] font-roboto text-[15px] font-normal leading-[120%] border-none pl-[15px] pr-[40px] transition-shadow duration-300 ease-in-out outline-none focus:shadow-[0_0_5px_#565656] ${className}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PrimarySelect;
