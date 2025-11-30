import {Request, Response, NextFunction } from "express";

export const responseMiddleware = (req: Request, res : Response, next : NextFunction) => {

    res.success = (data: any) => {
       return res.status(200).json({
            status: "success",
            data: data
        });
    }

    res.error = (message: string, statusCode: number = 500) => {
       return res.status(statusCode).json({
            status: "error",
            message: message
        });
    }

    next();
}