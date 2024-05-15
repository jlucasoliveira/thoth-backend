import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVariationDTO } from './create-product-variation.dto';

export class UpdateProductVariationDTO extends PartialType(
  CreateProductVariationDTO,
) {}
