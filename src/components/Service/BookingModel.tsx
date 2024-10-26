import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import apiFetch from '../../utils/APIFetch';

interface Hour {
  time: string;
  reserved: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: { date: string | null; hour: string | null }) => void;
  mechanicsDetail: { id: number; name: string; address: string };
  token: string;
}

// Define o tipo da referência que o BookingModal expõe
interface BookingModalRef {
  scrollIntoView: () => void;
}

const BookingModal = forwardRef<BookingModalRef, BookingModalProps>(
  ({ isOpen, onClose, onConfirm, mechanicsDetail, token }, ref) => {
    const [availableHours, setAvailableHours] = useState<Hour[]>([]);
    const [selectedHour, setSelectedHour] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const modalRef = React.useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      scrollIntoView: () => {
        if (modalRef.current) {
          modalRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    useEffect(() => {
      if (isOpen && modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      if (isOpen && selectedDate) {
        fetchReservedHours();
      }
    }, [isOpen, selectedDate]);

    const fetchReservedHours = async () => {
      try {
        const bookings = await apiFetch(`/bookings/workshop/${mechanicsDetail.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const hoursOfDay = [
          '08:00', '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00',
        ];

        const targetDate = selectedDate;

        const reservedHours = bookings
          .filter((booking: { date: string }) => booking.date.startsWith(targetDate!))
          .map((booking: { date: string }) => new Date(booking.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

        const updatedHours = hoursOfDay.map(hour => ({
          time: hour,
          reserved: reservedHours.includes(hour),
        }));

        setAvailableHours(updatedHours);
      } catch (error) {
        console.error('Erro ao buscar horários reservados:', error);
      }
    };

    const handleHourClick = (hour: Hour) => {
      if (!hour.reserved) {
        setSelectedHour(hour.time);
      }
    };

    const handleConfirm = () => {
      onConfirm({ date: selectedDate, hour: selectedHour });
    };

    const getTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-lg font-semibold mb-4">Realizar agendamento</h2>
          <p>Nome: {mechanicsDetail.name}</p>
          <p>Endereço: {mechanicsDetail.address}</p>

          <label htmlFor="date-picker" className="block text-left">
            Escolha a data:
          </label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate || ''}
            min={getTodayDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 mt-2 w-full rounded"
          />

          {selectedDate && (
            <>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {availableHours.map((hour, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded text-white ${hour.reserved ? 'bg-gray-400 cursor-not-allowed' : selectedHour === hour.time ? 'bg-blue-500' : 'bg-green-500'}`}
                    onClick={() => handleHourClick(hour)}
                    disabled={hour.reserved}
                  >
                    {hour.time}
                  </button>
                ))}
              </div>

              <p className="mt-4">Deseja confirmar o agendamento?</p>
              <div className="flex justify-between mt-4">
                <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
                <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!selectedHour}>
                  Confirmar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

BookingModal.displayName = 'BookingModal';

export default BookingModal;
