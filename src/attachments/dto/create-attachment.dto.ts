import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAttachmentDTO {
  @IsUUID()
  @IsOptional()
  variationId?: string;

  @IsString()
  @IsOptional()
  resource?: string;
}
