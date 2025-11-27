const validator = require('validator'); // Requiere: npm install validator

const { logCriticalEvent } = require('./auditLogger');



// El WAF (Web Application Firewall) de la CIA/Banca: Limpieza y Control Transaccional.

const wafShield = (req, res, next) => {

    // 1. Detección de Inyección de Comandos (SQL/NoSQL/OS Command)

    const payload = { ...req.body, ...req.query, ...req.params };



    for (const key in payload) {

        if (typeof payload[key] === 'string') {

            let value = payload[key];

            

            // a) Desinfectar comandos peligrosos (SQL, XSS, etc.)

            if (validator.contains(value.toLowerCase(), 'select ') || 

                validator.contains(value.toLowerCase(), 'drop ') || 

                validator.contains(value.toLowerCase(), 'cmd') ||

                validator.contains(value, ';')) 

            {

                console.error(`🚨 WAF ALERTA [${req.ip}]: Intento de INYECCIÓN en campo: ${key}`);

                

                // Registrar en log de auditoría

                logCriticalEvent({

                    ip: req.ip || 'unknown',

                    code: '403-WAF-001',

                    message: `Intento de INYECCIÓN en campo: ${key} | Valor: ${value.substring(0, 50)}`

                });

                

                return res.status(403).json({ 

                    error: "Acceso denegado: Violación de Seguridad Crítica.",

                    code: "403-WAF-001"

                });

            }

            

            // b) Sanitizar para prevenir XSS (Cross-Site Scripting)

            req.body[key] = validator.escape(value);



        } else if (typeof payload[key] === 'number') {

            // 2. Control de FRAUDE NUMÉRICO (Grado Bancario)

            if (payload[key] < 0) {

                 console.error(`🚨 WAF ALERTA [${req.ip}]: Intento de FRAUDE (Valor Negativo) en campo: ${key}`);

                 

                 // Registrar en log de auditoría

                 logCriticalEvent({

                     ip: req.ip || 'unknown',

                     code: '403-WAF-002',

                     message: `Intento de FRAUDE (Valor Negativo) en campo: ${key} | Valor: ${payload[key]}`

                 });

                 

                 return res.status(403).json({ 

                    error: "Acceso denegado: Violación de integridad financiera.",

                    code: "403-WAF-002"

                });

            }

        }

    }

    

    // 3. Validaciones Específicas de Formato (Ejemplo de Campos Comunes)

    if (req.body.email && !validator.isEmail(req.body.email)) {

        console.error(`🚨 WAF ALERTA [${req.ip}]: Email con formato inválido.`);

        

        // Registrar en log de auditoría

        logCriticalEvent({

            ip: req.ip || 'unknown',

            code: '400-WAF-003',

            message: `Email con formato inválido: ${req.body.email}`

        });

        

        return res.status(400).json({ error: "Email inválido.", code: "400-WAF-003" });

    }



    if (req.body.amount && !validator.isDecimal(String(req.body.amount), { decimal_digits: '0,2' })) {

        console.error(`🚨 WAF ALERTA [${req.ip}]: Monto con formato inválido.`);

        

        // Registrar en log de auditoría

        logCriticalEvent({

            ip: req.ip || 'unknown',

            code: '400-WAF-004',

            message: `Monto con formato inválido: ${req.body.amount}`

        });

        

        return res.status(400).json({ error: "Monto inválido. Máximo dos decimales.", code: "400-WAF-004" });

    }

    

    // Si la entrada es limpia y cumple con estándares bancarios, procedemos.

    next();

};



module.exports = wafShield;

