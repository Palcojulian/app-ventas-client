import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import CompraForm from '../components/CompraForm';
import ComprasTabla from '../components/ComprasTabla';

type Tab = 'registrar' | 'listar';

const Compras = () => {
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
                    Registrar Compra
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
                    Ver Compras
                </button>
            </div>

            {activeTab === 'registrar' ? <CompraForm /> : <ComprasTabla />}
        </div>
    );
};

export default Compras;