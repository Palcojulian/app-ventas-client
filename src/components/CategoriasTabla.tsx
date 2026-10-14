import { Pencil } from 'lucide-react';
import { useCategorias } from '../hooks/useCategoria';
import Badge from './ui/Badge';
import { estadoToVariant } from './ui/badge-helpers';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';
import type { Categoria } from '../types/categoria.types';

interface CategoriasTablaProps {
    onEdit: (categoria: Categoria) => void;
}

const CategoriasTabla = ({ onEdit }: CategoriasTablaProps) => {
    const { data: categorias, isLoading } = useCategorias();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="hidden sm:block overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Prefijo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Descripción</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Fecha</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <tr key={`skel-${i}`}>
                                      {Array.from({ length: 7 }).map((__, j) => (
                                          <td key={j} className="px-4 py-3">
                                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : categorias && categorias.length > 0
                              ? categorias.map((categoria) => (
                                    <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500">{categoria.id}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {categoria.nombre}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                                            {categoria.prefijo ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                            <span className="line-clamp-1">{categoria.descripcion}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={estadoToVariant(categoria.estado)}>
                                                {categoria.estado}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                                            {new Date(categoria.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => onEdit(categoria)}
                                                className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors hover:cursor-pointer"
                                                title="Editar"
                                                aria-label={`Editar ${categoria.nombre}`}
                                            >
                                                <Pencil width={16} height={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                              : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10">
                                            <EmptyState
                                                title="Sin categorías"
                                                description="Aún no hay categorías registradas. Crea la primera desde el formulario."
                                            />
                                        </td>
                                    </tr>
                                )}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden divide-y divide-gray-100">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={`skel-${i}`} className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                    ))
                ) : categorias && categorias.length > 0 ? (
                    categorias.map((categoria) => (
                        <div key={categoria.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {categoria.nombre}
                                        </h4>
                                        <Badge variant={estadoToVariant(categoria.estado)}>
                                            {categoria.estado}
                                        </Badge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        #{categoria.id} · {categoria.prefijo ?? 's/prefijo'}
                                    </p>
                                    {categoria.descripcion && (
                                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                                            {categoria.descripcion}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(categoria)}
                                    aria-label={`Editar ${categoria.nombre}`}
                                >
                                    <Pencil size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState
                        title="Sin categorías"
                        description="Aún no hay categorías registradas."
                    />
                )}
            </div>
        </div>
    );
};

export default CategoriasTabla;
