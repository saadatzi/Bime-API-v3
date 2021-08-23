import { ApiProperty } from '@nestjs/swagger';
import { EnumMessages } from './messeages.enum';

export class BaseApiResponse<T> {
  constructor(data: T, msg: EnumMessages, succuss: Boolean, meta: any) {
    this.data = data;
    this.msg = msg;
    this.success = succuss;
    this.meta = meta;
  }
  public data: T;
  public msg: EnumMessages;
  public success: Boolean;
  @ApiProperty({ type: Object })
  public meta: any;
}
