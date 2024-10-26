"use client"

import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/APIFetch';
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface Diagnosis {
    id: string;
    predicted_problem: string;
    problem_details: {
        service: string;
        price: string;
        price_details: string;
    };
}

interface Booking {
    id: string;
    service: string;
    price: string;
    date: string;
    status: string;
}

const Bookings = () => {
    const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const getToken = (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("token") || sessionStorage.getItem("token");
        }
        return null;
    };

    const token = getToken();
    const router = useRouter();

    const fetchDiagnosis = async () => {
        try {
            const data = await apiFetch('/diagnosis/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDiagnosis(data);
        } catch (error) {
            console.error('Erro ao buscar diagnósticos:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const data = await apiFetch('/bookings/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings(data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    const handleLocate = (service: string) => {
        const queryParams = new URLSearchParams({
            available_services: service,
        });
        router.push(`/services?${queryParams.toString()}`);
    };

    const handleCancel = async (bookingId: string) => {
        try {
            await apiFetch(`/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.id !== bookingId)
            );
        } catch (error) {
            console.error('Erro ao cancelar o agendamento:', error);
        }
    };

    useEffect(() => {
        fetchDiagnosis();
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-100 flex flex-col items-center pb-12">
            <div className="text-center mb-8 w-full relative">
                <Image
                    src="/img/carro.png"
                    alt="Banner de Serviços"
                    className="w-full h-96 object-cover"
                    height={384}
                    width={768}
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-medium">Histórico de Serviços</h2>
                    <p className="text-2xl font-light mt-2">Acompanhe todos os serviços realizados e agendados para manter o
                        controle completo sobre o atendimento do seu veículo</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Meus Diagnósticos</h2>
            <div className="w-7/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagnosis.length > 0 ? (
                    diagnosis.map((diag) => (
                        <div key={diag.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                            <Image src="/img/Centro_auto1.png" alt={diag.problem_details.service} className="w-full h-40 object-cover rounded-lg mb-4" width={320} height={192} />
                            <h1 className="text-lg font-medium">{diag.predicted_problem}</h1>
                            <p className="text-sm text-gray-700">{diag.problem_details.price}</p>
                            <div className="mt-4">
                                <p className="text-sm">Serviço: {diag.problem_details.service}</p>
                                <p className="text-sm">Preço Detalhado: {diag.problem_details.price_details}</p>
                            </div>
                            <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                onClick={() => handleLocate(diag.problem_details.service)}
                            >
                                Localizar Oficina
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Nenhum diagnóstico encontrado.</p>
                )}
            </div>

                <h2 className="text-2xl font-semibold mb-4">Meus Agendamentos</h2>
                <div className="w-7/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                                <Image src="/img/Centro_auto2.png" alt={booking.service} className="w-full h-40 object-cover rounded-lg mb-4" width={320} height={192} />
                                <p className="text-lg font-medium">{booking.service}</p>
                                <div className="mt-4 w-[320px]">
                                    <p className="text-sm">Preço: {booking.price}</p>
                                    <p className="text-sm">Data: {booking.date}</p>
                                    <p className="text-sm">Status: {booking.status}</p>
                                </div>
                                <button
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    onClick={() => handleCancel(booking.id)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum agendamento encontrado.</p>
                    )}
                </div>
        </div>
    );
};

export default Bookings;
