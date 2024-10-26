"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import BookingModal from "@/components/Service/BookingModel";
import { availableServices, specialties } from "@/utils/Data";
import { useNotification } from "@/components/NotificationContext/NotificationContext";
import stringSimilarity from 'string-similarity';
import { FourSquare } from 'react-loading-indicators';
import apiFetch from '../../utils/APIFetch';
import PrimarySelect from "@/components/PrimarySelect/PrimarySelect";
import PrimaryInput from "@/components/PrimaryInput/PrimaryInput";
import Spinner from "@/components/Spinner/Spinner";

const images = [
    "/img/Centro_auto1.png",
    "/img/Centro_auto2.png",
    "/img/Centro_auto3.png",
    "/img/Centro_auto4.png",
    "/img/Centro_auto5.png",
    "/img/Centro_auto6.png",
];

interface BookingDetails {
    date: string;
    hour: string;
}

interface DiagnosisData {
    problem_details: {
        service: string;
        price: number;
    };
}

interface Center {
    id: number;
    name: string;
    address: string;
    rating: number; // Add the rating property
}

interface Filter {
    address: string;
    rating: string;
    open24hrs: boolean;
    wifi: boolean;
    take_and_deliver: boolean;
    accessible: boolean;
    waiting_room: boolean;
    available_services: string;
    specialties: string;
    date: string;
}


const ServicesSection: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const { addNotification } = useNotification();
    const [centers, setCenters] = useState<Center[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [filter, setFilter] = useState<Filter>({
        address: "",
        rating: "",
        open24hrs: false,
        wifi: false,
        take_and_deliver: false,
        accessible: false,
        waiting_room: false,
        available_services: "",
        specialties: "",
        date: "",
    });
    const [imageMap, setImageMap] = useState<Record<number, string>>({});
    const [limit] = useState<number>(6);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const getToken = (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("token") || sessionStorage.getItem("token");
        }
        return null;
    };

    const modalRef = useRef<HTMLElement>(null);

    const handleOpenModal = (index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);

        if (modalRef.current) {
            modalRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleConfirm = async (bookingDetails: BookingDetails): Promise<void> => {
        console.log('Agendamento confirmado:', bookingDetails);
        setModalOpen(false);

        const id = localStorage.getItem('diagnosisId');
        console.log('DiagnosisId:', id);

        if (!id) {
            addNotification('error', 'Erro', 'ID de diagnóstico não encontrado.');
            console.error('ID de diagnóstico não encontrado');
            return;
        }

        const token = getToken();
        if (!token) {
            addNotification('error', 'Erro', 'Token não encontrado. Faça login novamente.');
            console.error('Token não encontrado');
            return;
        }

        try {
            console.log('Buscando dados do diagnóstico:', id);
            const diagnosisData = await apiFetch(`/diagnosis/?diagnosis_id=${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (diagnosisData.problem_details && diagnosisData.problem_details.service && diagnosisData.problem_details.price) {
                if (!centers || !centers[selectedIndex!]) {
                    addNotification('error', 'Erro', 'Centro de mecânico não selecionado.');
                    console.error('Centro de mecânico não definido');
                    return;
                }

                const bookingData = {
                    mechanic_id: centers[selectedIndex!].id,
                    date: `${bookingDetails.date}T${bookingDetails.hour}:00`,
                    service: diagnosisData.problem_details.service,
                    price: diagnosisData.problem_details.price,
                    status: 'pending',
                };

                try {
                    const bookingResponse = await apiFetch('/bookings', {
                        method: 'POST',
                        body: JSON.stringify(bookingData),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    addNotification('success', 'Sucesso', 'Agendamento realizado com sucesso!');
                    console.log('Agendamento realizado com sucesso:', bookingResponse);
                } catch (bookingError) {
                    addNotification('error', 'Erro', 'Erro ao confirmar agendamento. Se já realizou um agendamento, aguarde a confirmação.');
                    console.error('Erro ao confirmar agendamento:', bookingError);
                }
            } else {
                addNotification('error', 'Erro', 'Detalhes do problema não disponíveis.');
                console.error('Detalhes do problema não estão definidos');
            }
        } catch (diagnosisError) {
            addNotification('error', 'Erro', 'Erro ao buscar dados do diagnóstico. Tente novamente mais tarde.');
            console.error('Erro ao buscar dados do diagnóstico:', diagnosisError);
        }
    };

    const findBestServiceMatch = (inputService: string): string => {
        const serviceLabels = availableServices.map(service => service.label);
        const { bestMatch } = stringSimilarity.findBestMatch(inputService, serviceLabels);
        return bestMatch.target;
    };

    const getQueryParams = useCallback((): Filter => {
        const availableServiceFromQuery = searchParams.get("available_services") || "";

        let bestServiceMatch = "";
        if (availableServiceFromQuery !== "") {
            bestServiceMatch = findBestServiceMatch(availableServiceFromQuery);
        }

        return {
            address: searchParams.get("address") || "",
            rating: searchParams.get("rating") || "",
            open24hrs: searchParams.get("open24hrs") === "true",
            wifi: searchParams.get("wifi") === "true",
            take_and_deliver: searchParams.get("take_and_deliver") === "true",
            accessible: searchParams.get("accessible") === "true",
            waiting_room: searchParams.get("waiting_room") === "true",
            available_services: bestServiceMatch,
            specialties: searchParams.get("specialties") || "",
            date: searchParams.get("date") || "",
        };
    }, [searchParams]);

    const cleanParams = (params: Filter): Partial<Filter> => {
        return Object.fromEntries(
            Object.entries(params).filter(([key, value]) => {
                return value !== '' && value !== false && value !== null;
            })
        ) as Partial<Filter>;
    };

    const fetchMechanics = async (queryParams: Filter, newOffset = 0, isInitialLoad = false): Promise<void> => {
        setLoading(true);
        try {
            const token = getToken();
            const cleanQueryParams = cleanParams(queryParams);

            const queryString = new URLSearchParams(
                Object.entries({
                    ...cleanQueryParams,
                    limit: String(limit),
                    offset: String(newOffset),
                }).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            const mechanics = await apiFetch(`/mechanic/filter?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (mechanics.length < limit) {
                setHasMore(false);
            }

            const newImageMap = { ...imageMap };
            mechanics.forEach((center) => {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                newImageMap[center.id] = randomImage;
            });

            setImageMap(newImageMap);

            if (isInitialLoad) {
                setCenters(mechanics);
            } else {
                setCenters(prevCenters => [...prevCenters, ...mechanics]);
            }
        } catch (error) {
            console.error("Erro ao buscar mecânicas:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQueryString = (): void => {
        const searchParams = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== "" && value !== false) {
                searchParams.set(key, value.toString());
            }
        });

        const newQuery = searchParams.toString();
        router.push(`?${newQuery}`);
    };


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setLoading(true);
            const queryParams = getQueryParams();

            const findClosestMatch = (input: string, options: { value: string }[]): string => {
                const optionLabels = options.map(option => option.value);
                const bestMatch = stringSimilarity.findBestMatch(input, optionLabels).bestMatch;
                return bestMatch.rating > 0.5 ? bestMatch.target : '';
            };

            const closestService = availableServices.some(service => service.value === queryParams.available_services)
                ? queryParams.available_services
                : findClosestMatch(queryParams.available_services, availableServices);

            const closestSpecialty = specialties.some(specialty => specialty.value === queryParams.specialties)
                ? queryParams.specialties
                : findClosestMatch(queryParams.specialties, specialties);

            setFilter({
                ...queryParams,
                available_services: closestService,
                specialties: closestSpecialty
            });

            await fetchMechanics(queryParams, 0, true);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleSearch = async (): Promise<void> => {
        setLoading(true);
        setCenters([]);
        setOffset(0);
        setHasMore(true);
        updateQueryString();
        const queryParams = getQueryParams();
        await fetchMechanics(queryParams, 0, true);
        setLoading(false);
    };

    const handleShowMore = async (): Promise<void> => {
        const newOffset = offset + limit;
        setOffset(newOffset);
        const queryParams = getQueryParams();
        await fetchMechanics(queryParams, newOffset);
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center pb-12">
            <BookingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                mechanicsDetail={centers[selectedIndex]}
                token={getToken()}
                ref={modalRef}
            />

            <div className="text-center mb-8 w-full relative">
                <Image
                    src="/img/services-banner.png"
                    alt="Banner de Serviços"
                    className="w-full h-96 object-cover"
                    height={384}
                    width={768}
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-medium">Agendamento de Serviços</h2>
                    <p className="text-2xl font-light mt-2">Agende Seu Serviço Automotivo com Facilidade e Comodidade</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md w-7/12 p-8 mb-10">
                <h2 className="text-2xl font-medium mb-4">Buscar Mecânicas</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="w-[810px]">
                        <PrimaryInput
                            type="text"
                            placeholder="Logradouro"
                            name="address"
                            value={filter.address}
                            onChange={(e) => setFilter({ ...filter, address: e.target.value })}
                        />
                    </div>
                    <div className="w-[190px]">
                        <PrimaryInput
                            type="date"
                            name="date"
                            value={filter.date}
                            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                        />
                    </div>
                    <div className="w-[355px]">
                        <PrimarySelect
                            name="available_services"
                            value={filter.available_services}
                            options={availableServices}
                            onChange={(e) => setFilter({ ...filter, available_services: e.target.value })}
                        />
                    </div>
                    <div className="w-[355px]">
                        <PrimarySelect
                            name="specialties"
                            value={filter.specialties}
                            options={specialties}
                            onChange={(e) => setFilter({ ...filter, specialties: e.target.value })}
                        />
                    </div>
                    <div className="w-[130px]">
                        <PrimarySelect
                            name="rating"
                            value={filter.rating}
                            options={[{ label: '5.0 ⭐', value: '' }, ...[1, 2, 3, 4, 5].map(star => ({ label: `${star}.0 ⭐`, value: star.toString() }))]}
                            onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
                        />
                    </div>
                    <button className="w-[130px] h-12 px-6 bg-blue-600 text-white rounded-lg" onClick={handleSearch}>
                        Buscar
                    </button>
                </div>

                <h2 className="text-2xl font-medium mt-6 mb-4">Tags</h2>
                <div className="flex gap-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={filter.open24hrs}
                            onChange={() => setFilter({ ...filter, open24hrs: !filter.open24hrs })}
                            className="hidden"
                        />
                        <span className={`flex items-center justify-center w-[91.742px] h-[36px] rounded-[12px] border border-[#0071E3] 
            ${filter.open24hrs ? 'bg-[#0071E3] text-white' : 'bg-white text-[#0071E3]'} 
            transition-colors duration-300 cursor-pointer`}>
                            24 horas
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={filter.wifi}
                            onChange={() => setFilter({ ...filter, wifi: !filter.wifi })}
                            className="hidden"
                        />
                        <span className={`flex items-center justify-center w-[91.742px] h-[36px] rounded-[12px] border border-[#0071E3] 
            ${filter.wifi ? 'bg-[#0071E3] text-white' : 'bg-white text-[#0071E3]'} 
            transition-colors duration-300 cursor-pointer`}>
                            Wi-Fi
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={filter.take_and_deliver}
                            onChange={() => setFilter({ ...filter, take_and_deliver: !filter.take_and_deliver })}
                            className="hidden"
                        />
                        <span className={`flex items-center justify-center w-[91.742px] h-[36px] rounded-[12px] border border-[#0071E3] 
            ${filter.take_and_deliver ? 'bg-[#0071E3] text-white' : 'bg-white text-[#0071E3]'} 
            transition-colors duration-300 cursor-pointer`}>
                            Leva e traz
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={filter.accessible}
                            onChange={() => setFilter({ ...filter, accessible: !filter.accessible })}
                            className="hidden"
                        />
                        <span className={`flex items-center justify-center w-[91.742px] h-[36px] rounded-[12px] border border-[#0071E3] 
            ${filter.accessible ? 'bg-[#0071E3] text-white' : 'bg-white text-[#0071E3]'} 
            transition-colors duration-300 cursor-pointer`}>
                            Acessível
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={filter.waiting_room}
                            onChange={() => setFilter({ ...filter, waiting_room: !filter.waiting_room })}
                            className="hidden"
                        />
                        <span className={`flex items-center justify-center w-[120.742px] h-[36px] rounded-[12px] border border-[#0071E3] 
            ${filter.waiting_room ? 'bg-[#0071E3] text-white' : 'bg-white text-[#0071E3]'} 
            transition-colors duration-300 cursor-pointer`}>
                            Sala de Espera
                        </span>
                    </label>
                </div>
            </div>

            <div className="w-7/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className='w-full h-full flex justify-center items-center'>
                        <Spinner />
                    </div>
                ) : centers.length > 0 ? (
                    centers.map((center, index) => (
                        <div key={center.id} className="bg-white shadow-lg rounded-lg p-4">
                            <Image
                                src={images[index % images.length]}
                                alt={center.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                                height={192}
                                width={320}
                                priority
                            />
                            <div className="mt-4">
                                <h1 className="text-xl font-medium">{center.name}</h1>
                                <p className="text-gray-500">{center.rating} ⭐</p>
                                <p className="mt-2 text-gray-700">{center.address}</p>
                                <button
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
                                    onClick={() => handleOpenModal(index)}
                                >
                                    Agendar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center">
                        <p>Ops! Não encontramos nenhum centro automotivo com esses filtros.</p>
                    </div>
                )}
            </div>

            {!loading && hasMore && (
                <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={handleShowMore}>
                    Ver Mais
                </button>
            )}
        </div>
    );
};

export default ServicesSection;
