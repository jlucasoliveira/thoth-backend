type Props = {
  itens: number;
  total: number;
  take?: number;
  skip?: number;
};

export class PageMetaDto {
  readonly page: number;

  readonly limit: number;

  readonly itens: number;

  readonly total: number;

  readonly pages: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor(props: Props) {
    const take = props.take ?? props.total;
    this.itens = props.itens;
    this.total = props.total;
    this.limit = Number(take || 10);
    this.page = Number((props.skip ?? 0) / take || 1);
    this.pages = Math.ceil(this.total / take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pages;
  }
}

export type Response<T> = {
  data: T[];
  meta: PageMetaDto;
};
