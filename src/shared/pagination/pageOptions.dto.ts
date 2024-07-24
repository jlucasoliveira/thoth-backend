import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '@/types/typeorm/base-model';

type MinusKey<Type> = {
  [Property in keyof Type as `-${string & Property}`]: Type[Property];
};

export type Query<AttributeType> = AttributeType extends BaseEntity
  ? FilterOperator<AttributeType>
  :
      | { eq: AttributeType }
      | { ne: AttributeType }
      | { like: AttributeType }
      | { ilike: AttributeType }
      | { between: [AttributeType, AttributeType] }
      | { or: Query<AttributeType>[] }
      | { and: Query<AttributeType>[] }
      | { in: AttributeType[] }
      | { gte: AttributeType }
      | { lte: AttributeType };

export type FilterOperator<Entity> = {
  [key in keyof Entity]?: Query<Entity[key]>;
};

export type Filter<Entity> =
  | FilterOperator<Entity>
  | Array<FilterOperator<Entity>>;

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
