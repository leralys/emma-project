import { ApiResponse } from '@emma-project/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): ApiResponse<{ message: string }> {
    return {
      success: true,
      data: { message: 'Hello API' },
    };
  }
}
