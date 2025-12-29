// Sistema de validación avanzado con Zod
import { z } from 'zod';
import validator from 'validator';

// Esquemas de validación completos
export const userValidation = {
    register: z.object({
        email: z.string()
            .email('Email inválido')
            .refine((email) => {
                const domain = email.split('@')[1];
                const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
                return commonDomains.includes(domain);
            }, 'Usa un email de dominio común'),

        password: z.string()
            .min(8, 'Mínimo 8 caracteres')
            .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
            .regex(/[a-z]/, 'Debe contener al menos una minúscula')
            .regex(/[0-9]/, 'Debe contener al menos un número')
            .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),

        full_name: z.string()
            .min(2, 'Nombre muy corto')
            .max(100, 'Nombre muy largo')
            .refine(name => !/\d/.test(name), 'El nombre no puede contener números'),

        phone: z.string().optional()
            .refine(phone => !phone || validator.isMobilePhone(phone, 'any'), 'Teléfono inválido')
    }).strict(),

    login: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'La contraseña es requerida')
    }).strict()
};

export const petValidation = {
    create: z.object({
        name: z.string().min(2).max(50),
        pet_type: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']),
        age: z.number().min(0).max(30),
        breed_id: z.string().uuid().optional(),
        description: z.string().max(500).optional(),
        temperament_tags: z.array(z.string()).max(10).optional()
    }).strict()
};

export const paymentValidation = {
    create: z.object({
        amount: z.number().positive('El monto debe ser positivo').max(10000, 'Monto máximo excedido'),
        currency: z.enum(['USD', 'MXN', 'ARS', 'CLP']),
        payment_method: z.enum(['mercadopago', 'paypal', 'credit_card']),
        reference: z.string().min(5).max(100)
    }).strict()
};

// Función helper para validar
export async function validateData<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: boolean; data?: T; errors?: string[] }> {
    try {
        const validated = await schema.parseAsync(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
            };
        }
        return { success: false, errors: ['Validation failed'] };
    }
}

// Sanitización de inputs
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remover tags HTML
        .replace(/javascript:/gi, '') // Remover javascript:
        .replace(/on\w+=/gi, '') // Remover event handlers
        .trim();
}

export function sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }

    return sanitized;
}
