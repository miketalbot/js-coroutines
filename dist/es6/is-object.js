export function isObject(v) {
    return typeof v === 'object' && !Array.isArray(v)
}
