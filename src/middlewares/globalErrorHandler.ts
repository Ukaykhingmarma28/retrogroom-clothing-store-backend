import {HttpError} from "http-errors";
import {NextFunction, Request, Response} from "express";
import {config} from "../config";

const globalErrorHAndler = ((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode= err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "DEVELOPMENT" ? err.stack : ""
    })
})

export default globalErrorHAndler;