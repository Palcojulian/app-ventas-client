import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import VentaForm from '../components/VentaForm';
import VentasTabla from '../components/VentasTabla';

type Tab = 'registrar' | 'listar';

const Ventas = () => {
    const [activeTab, setActiveTab] = useState<Tab>('registrar');

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('registrar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                        activeTab === 'registrar'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer'
                    }`}
                >
                    <Plus width={18} height={18} />
                    Registrar Venta
                </button>
                <button
                    onClick={() => setActiveTab('listar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                        activeTab === 'listar'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer'
                    }`}
                >
                    <List width={18} height={18} />
                    Ver Ventas
                </button>
            </div>

            {activeTab === 'registrar' ? <VentaForm /> : <VentasTabla />}
        </div>
    );
};

export default Ventas;
