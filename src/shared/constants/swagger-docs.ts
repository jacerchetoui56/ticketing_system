import { HttpStatus } from "@nestjs/common";
import { ApiResponseOptions } from "@nestjs/swagger";

export const DEFAULT_RESPONSE: ApiResponseOptions[] = [
  {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal Server Error!",
  },
  {
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized!",
  },
  {
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden!",
  },
];
