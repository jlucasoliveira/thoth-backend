import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductVariationDTO } from './create-product-variation.dto';

export class UpdateProductVariationDTO extends PartialType(
  OmitType(CreateProductVariationDTO, ['quantity', 'costPrice']),
) {}
