import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

// Autenticación
export const authentication = (req, res, next) => {
    const secreto = process.env.SECRETO;
    const head = req.headers['authorization'];
    if (!head) {
        return res.status(401).send({ message: 'No se proporcionó token' });
    } else {
        const token = head && head.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó token' });
        }
        try {
            const decode = jwt.verify(token, secreto);
            req.user = decode;
            next();
        } catch (err) {
            return res.status(401).send({ message: 'Token inválido' });
        }
    }
};

export const esPaciente = (req, res, next) => {
    const secreto = process.env.SECRETO;
    const head = req.headers['authorization'];
    const token = head && head.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó token' });
    }
    try {
        const decode = jwt.verify(token, secreto);
        if (decode.role === 'paciente') {
            req.user = decode;
            next();
        } else {
            return res.status(403).send({ error: 'Acceso denegado' });
        }
    } catch (err) {
        return res.status(401).send({ message: 'Token inválido' });
    }
};

export const esEspecialista = (req, res, next) => {
    const secreto = process.env.SECRETO;
    const head = req.headers['authorization'];
    const token = head && head.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó token' });
    }
    try {
        const decode = jwt.verify(token, secreto);
        if (decode.role === 'especialista') {
            req.user = decode;
            next();
        } else {
            return res.status(403).send({ error: 'Acceso denegado' });
        }
    } catch (err) {
        return res.status(401).send({ message: 'Token inválido' });
    }
};
