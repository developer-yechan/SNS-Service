import { getSchemaPath } from '@nestjs/swagger';
import { loginResponse } from 'src/dto/login/loginResponse.dto';

export const loginSuccess = {
  description: '로그인 성공.',
  content: {
    'application/json': {
      example: {
        access_token: 'eyJh.WIjoxNjcxMTcwOTg4fQ.tkPzpAU2lV6YO2ifs',
      },
      schema: {
        $ref: getSchemaPath(loginResponse),
      },
    },
  },
};
