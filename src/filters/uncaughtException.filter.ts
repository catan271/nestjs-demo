import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        if (exception instanceof HttpException) {
            res.status(exception.getStatus()).json(exception);
        } else if (exception instanceof TypeORMError) {
            console.error(exception);
            res.status(500).json({
                status: 500,
                name: 'TypeORMError',
                message: 'Lỗi truy nhập cơ sở dữ liệu',
                response: exception.message,
            });
        } else {
            console.error(exception);
            res.status(500).json({
                status: 500,
                name: 'OtherException',
                message: 'Lỗi máy chủ',
                response: exception.message,
            });
        }
    }
}
