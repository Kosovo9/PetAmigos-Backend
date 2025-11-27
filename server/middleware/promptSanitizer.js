const validator = require('validator');



// ============================================

// PROMPT SANITIZER - Blindaje de Prompts

// Previene inyecciones y contenido inapropiado

// ============================================



const sanitizePrompt = (req, res, next) => {

    if (req.body.prompt || req.body.subject || req.body.action || req.body.scenario) {

        // Sanitizar todos los campos de prompt

        if (req.body.subject) {

            req.body.subject = sanitizeField(req.body.subject);

        }

        if (req.body.action) {

            req.body.action = sanitizeField(req.body.action);

        }

        if (req.body.scenario) {

            req.body.scenario = sanitizeField(req.body.scenario);

        }

        if (req.body.styleKeys) {

            if (Array.isArray(req.body.styleKeys)) {

                req.body.styleKeys = req.body.styleKeys.map(key => sanitizeField(key));

            } else {

                req.body.styleKeys = sanitizeField(req.body.styleKeys);

            }

        }

        if (req.body.prompt) {

            req.body.prompt = sanitizeField(req.body.prompt);

        }

    }

    next();

};



/**

 * Sanitizar campo individual

 */

function sanitizeField(field) {

    if (typeof field !== 'string') {

        return field;

    }

    // 1. Remover caracteres peligrosos

    let sanitized = field

        .replace(/[<>]/g, '') // Remover HTML tags

        .replace(/javascript:/gi, '') // Remover javascript:

        .replace(/on\w+=/gi, '') // Remover event handlers

        .replace(/data:/gi, '') // Remover data URIs

        .trim();

    

    // 2. Escape de caracteres especiales

    sanitized = validator.escape(sanitized);

    

    // 3. Limitar longitud (prevenir prompts excesivamente largos)

    if (sanitized.length > 500) {

        sanitized = sanitized.substring(0, 500);

    }

    

    // 4. Detectar intentos de inyección SQL/NoSQL

    const dangerousPatterns = [

        /select\s+/i,

        /drop\s+/i,

        /insert\s+/i,

        /delete\s+/i,

        /update\s+/i,

        /union\s+/i,

        /exec\s+/i,

        /script\s*>/i

    ];

    

    for (const pattern of dangerousPatterns) {

        if (pattern.test(sanitized)) {

            throw new Error("Prompt contiene patrones peligrosos. Acceso denegado.");

        }

    }

    

    return sanitized;

}



module.exports = sanitizePrompt;


