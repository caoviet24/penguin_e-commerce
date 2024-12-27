'use client'

import { useEffect, useState } from 'react'

export default function useDebounce(value : string, delay = 500) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        let timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        }

    }, [value])

    return debouncedValue;
}
