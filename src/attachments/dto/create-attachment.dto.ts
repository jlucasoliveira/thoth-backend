import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAttachmentDTO {
  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  resource?: string;
}
