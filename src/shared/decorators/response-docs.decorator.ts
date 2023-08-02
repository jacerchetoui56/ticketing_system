import { applyDecorators } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@nestjs/swagger";

export function ResponseDoc(responses: ApiResponseOptions[]) {
  const responseDecorators: MethodDecorator[] | ClassDecorator[] = [];
  responses.map((res) => {
    responseDecorators.push(ApiResponse({ ...res }));
  });
  return applyDecorators(...responseDecorators);
}
