import { useEffect, useRef } from 'react';

export default function TextInput({
    type = 'text',
    name,
    id,
    value,
    className = '',
    autoComplete,
    required,
    isFocused = false,
    handleChange,
    ...props
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused && input.current) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            type={type}
            name={name}
            id={id}
            value={value}
            className={
                `border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ${className}`
            }
            ref={input}
            autoComplete={autoComplete}
            required={required}
            onChange={(e) => handleChange ? handleChange(e) : null}
            {...props}
        />
    );
}