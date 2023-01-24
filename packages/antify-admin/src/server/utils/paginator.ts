import { H3Event } from 'h3';
import { Model, Query } from 'mongoose';

enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

export class Paginator {
  constructor(
    private event: H3Event,
    private fallbackOrderBy: string,
    private fallbackPage: number = 1,
    private fallbackItemsPerPage: number = 10,
    private fallbackOrder: orderEnum = orderEnum.asc
  ) {}

  public getPaginationParamsFromQuery() {
    const page =
      parseInt(getQuery(this.event)?.page as string, 10) || this.fallbackPage;
    const orderBy =
      parseInt(getQuery(this.event)?.orderBy as string, 10) ||
      this.fallbackOrderBy;
    const itemsPerPage =
      parseInt(getQuery(this.event)?.itemsPerPage as string, 10) ||
      this.fallbackItemsPerPage;
    let order = getQuery(this.event)?.itemsPerPage;

    if (order !== orderEnum.asc && order !== orderEnum.desc) {
      order = this.fallbackOrder;
    }

    return { page, itemsPerPage, orderBy, order };
  }

  // TODO:: typescript loose model result's type here
  public paginateQuery(model: Query<any, any>): Query<any, any> {
    const { page, itemsPerPage, order, orderBy } =
      this.getPaginationParamsFromQuery();

    return model
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ [orderBy]: order });
  }

  public async getPaginationResponse<T>(model: Model<T>) {
    const count = await model.countDocuments();
    const { page, itemsPerPage } = this.getPaginationParamsFromQuery();

    return { count, page, itemsPerPage };
  }
}
