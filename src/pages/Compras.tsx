import { useState } from 'react';
import { Plus, List, ShoppingCart } from 'lucide-react';
import CompraForm from '../components/CompraForm';
import ComprasTabla from '../components/ComprasTabla';
import Card from '../components/ui/Card';

type Tab = 'registrar' | 'listar';

const TABS: { value: Tab; label: string; icon: typeof Plus }[] = [
    { value: 'registrar', label: 'Registrar compra', icon: Plus },
    { value: 'listar', label: 'Ver compras', icon: List },
];

const Compras = () => {
    const [activeTab, setActiveTab] = useState<Tab>('registrar');

    return (
        <div className="space-y-5">
            <div role="tablist" className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                {TABS.map(({ value, label, icon: Icon }) => {
                    const active = activeTab === value;
                    return (
                        <button
                            key={value}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActiveTab(value)}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                                active
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-200 hover:cursor-pointer'
                            }`}
                        >
                            <Icon width={16} height={16} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'listar' && (
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="text-indigo-600" size={20} />
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Historial de compras
                            </h3>
                            <p className="text-sm text-gray-500">
                                Todas las compras registradas en el sistema.
                            </p>
                        </div>
                    </div>
                    <ComprasTabla />
                </Card>
            )}

            {activeTab === 'registrar' && <CompraForm />}
        </div>
    );
};

export default Compras;
