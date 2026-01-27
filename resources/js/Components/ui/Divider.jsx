export default function Divider({ children, className = '', ...props }) {
    if (children) {
        return (
            <div className={`divider ${className}`.trim()} {...props}>
                {children}
            </div>
        );
    }
    return <div className={`divider ${className}`.trim()} {...props}></div>;
}

