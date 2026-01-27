import { yupResolver } from '@hookform/resolvers/yup';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

export default function Form({
    children,
    onSubmit,
    schema,
    defaultValues = {},
    resolver = 'zod', // 'zod' or 'yup'
    className = '',
    ...props
}) {
    const formMethods = useForm({
        resolver: resolver === 'zod' ? zodResolver(schema) : yupResolver(schema),
        defaultValues,
    });

    const handleSubmit = formMethods.handleSubmit(onSubmit);

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit} className={className} {...props}>
                {children}
            </form>
        </FormProvider>
    );
}
