export default function Card({ children, className = '', ...props }) {
    return (
        <div className={`card bg-base-100 shadow-xl ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`card-header p-4 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '', ...props }) {
    return (
        <h2 className={`card-title ${className}`.trim()} {...props}>
            {children}
        </h2>
    );
}

export function CardBody({ children, className = '', ...props }) {
    return (
        <div className={`card-body ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`card-footer ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

export function CardActions({ children, className = '', ...props }) {
    return (
        <div className={`card-actions justify-end ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}
