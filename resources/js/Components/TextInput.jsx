import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = useRef(null);

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ${className}`}
            ref={ref || input}
        />
    );
});