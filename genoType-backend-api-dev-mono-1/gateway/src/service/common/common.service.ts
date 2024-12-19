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

  makeListParams(detail) {
    detail = detail ? JSON.parse(detail) : {};
    const limit = (detail && detail.limit && Number(detail.limit)) || 10;
    const sort = (detail && detail.sort) || 'name';
    const order = (detail && detail.order && Number(detail.order)) || -1;
    const sortFilter: any = {};
    const page = (detail && detail.page && Number(detail.page)) || 0;
    const skip = page * limit;
    const search = (detail && detail.search) || null;
    sortFilter[sort] = order;
    return { limit, sort, order, sortFilter, page, skip, search };
  }
}
