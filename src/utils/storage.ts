/**
* Obtener data del localStorage
*/
export const getData = <T = unknown>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
        return JSON.parse(value) as T;
    } catch {
        return value as unknown as T;
    }
};

/**
* Guardar data en localStorage
*/
export const saveData = (key: string, data: unknown): void => {
    if (typeof data === 'string') {
        localStorage.setItem(key, data);
    } else {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

/**
* Eliminar una key
*/
export const destroyData = (key: string): void => {
    localStorage.removeItem(key);
};

/**
* Limpiar todo
*/
export const destroyAllData = (): void => {
    localStorage.clear();
};