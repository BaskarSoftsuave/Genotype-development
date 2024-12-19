import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  successMessage(data, message, code) {
    return {
      data,
      message: message,
      statusCode: code,
    };
  }

  errorMessage(message, code, logger, error) {
    logger.error(message, error);
    return {
      message: message,
      statusCode: code,
      error: error.stack,
    };
  }
}
