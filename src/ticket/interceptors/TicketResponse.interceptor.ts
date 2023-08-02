import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TicketResponseDto } from "../dtos/ticket.dto";

@Injectable()
export class TicketResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((ticket) => new TicketResponseDto(ticket));
        } else {
          return new TicketResponseDto(data);
        }
      }),
    );
  }
}
