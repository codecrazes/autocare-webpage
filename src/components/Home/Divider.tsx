"use client";

import Image from 'next/image';

export default function Divider() {
    return (
        <div className="flex justify-center items-center gap-80 w-full h-60 bg-gray-100">
            <div className="flex w-100 flex-col justify-center items-center">
                <Image 
                    src="/img/icon-save.png" 
                    alt="save_icon" 
                    width={90} 
                    height={90} 
                    className="mb-4" 
                />
                <p className="text-lg font-medium text-gray-800">Diagnóstico Inteligente</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <Image 
                    src="/img/icon-correct.png" 
                    alt="correct_icon" 
                    width={90} 
                    height={90} 
                    className="mb-4" 
                />
                <p className="text-lg font-medium text-gray-800">Resultado Imediato</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <Image 
                    src="/img/icon-booking.png" 
                    alt="agenda_icon" 
                    width={90} 
                    height={90} 
                    className="mb-4" 
                />
                <p className="text-lg font-medium text-gray-800">Agendamento Fácil</p>
            </div>
        </div>
    );
}
