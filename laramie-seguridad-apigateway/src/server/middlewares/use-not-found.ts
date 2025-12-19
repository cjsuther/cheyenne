import express from 'express';


export default function useNotFound (req, res) {
    const httpError = {
        statusCode: 404,
        message: "Recurso inexistente"
    }

    return res.status(httpError.statusCode).send(httpError);
}

