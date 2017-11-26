export default function iassign<T>(target: T, setter: (t: T) => void) : T;
export default function iassign<T1, T2>(target: T1, getter: (t: T1) => T2, setter: (t: T2) => void): T1;
export default function iassign<T1, T2>(target: T1, getterOrSetter: any, setter?: any) : T1 {
    const defaultGetter = (t: T1) => t;
    const g = setter ? getterOrSetter : defaultGetter;
    const s = setter || getterOrSetter
    return assign(target, g, s);
}

function copy(object: any): any {
    return Array.isArray(object) ?
        [...object] :
        Object.assign({}, object);
}

function assign<T1, T2>(target: T1, getter: (t: T1) => T2, setter: (t: T2) => void): T1 {
    const handler = (object) => {
        return {
            get(target, key) {
                object[key] = copy(object[key]);
                return new Proxy(object[key], handler(object[key]));
            },
            set(target, key, value) {
                target[key] = value;
                return true;
            }
        };
    }

    let newTarget = copy(target);
    let proxy = new Proxy(newTarget, handler(newTarget));
    setter(getter(proxy));
    return newTarget;
}
