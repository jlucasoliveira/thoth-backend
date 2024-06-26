import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '@/types/typeorm/base-model';

type MinusKey<Type> = {
  [Property in keyof Type as `-${string & Property}`]: Type[Property];
};

export type FilterOperator<AttributeType> = AttributeType extends BaseEntity
  ? Filter<AttributeType>
  :
      | { eq: AttributeType }
      | { ne: AttributeType }
      | { like: AttributeType }
      | { ilike: AttributeType }
      | { between: [AttributeType, AttributeType] }
      | { or: FilterOperator<AttributeType>[] }
      | { and: FilterOperator<AttributeType>[] }
      | { in: AttributeType[] }
      | { gte: AttributeType }
      | { lte: AttributeType };

export type Filter<Entity> = {
  [key in keyof Entity]?: FilterOperator<Entity[key]> | Entity[key];
};

export type Sort<Entity> = keyof Entity | keyof MinusKey<Entity>;

export class PageOptionDto<Entity = Record<string, any>> {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  take?: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsOptional()
  @IsString()
  sort?: Sort<Entity>;

  @IsOptional()
  where: Filter<Entity>;
}
