export function handleMappingSingleRow<T, V>(response: T[], map: { [k in keyof T]: keyof V | null}): V | null {
    if (response.length == 0) {
        return null; 
    } else {
        return mapFields<T, V>(map, response[0]);
    }
}

export function mapFields<T, V>(fieldMap: { [k in keyof T]: keyof V | null}, response: T): V {
    const result: any = {} 
    for (let key in fieldMap) {
        if (fieldMap[key] != null) {
            result[fieldMap[key]] = response[key]
        }
    }
    return result;
}

export function mapFieldsReverse<T, V>(fieldMap: { [k in keyof T]: keyof V | null}, response: V): T {
    const result: any = {} 
    for (let key in fieldMap) {
        const index = fieldMap[key]
        if (index != null) {
            result[key] = response[index as keyof V]
        }
    }
    return result;
}