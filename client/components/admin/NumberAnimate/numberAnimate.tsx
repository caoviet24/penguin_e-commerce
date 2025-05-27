import React, { useEffect, useState } from "react";

export default function AnimatedNumber({ count }: { count: number }) {
    const [_count, setCount] = useState(count); // Đồng bộ ban đầu
    const [animation, setAnimation] = useState("");

    useEffect(() => {
        if (count > _count) {
            setAnimation("animate-bounce-up");
        } else if (count < _count) {
            setAnimation("animate-bounce-down");
        }

        const timeout = setTimeout(() => {
            setCount(count);
            setAnimation("");
        }, 300);

        return () => clearTimeout(timeout);
    }, [count, _count]);

    return (

        <div className={`relative text-5xl font-bold ${animation}`}>
            {_count}
        </div>
    );
}
