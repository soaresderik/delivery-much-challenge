import Knex from 'knex';

export default abstract class Repository<T> {
  constructor(private table: string, protected db: Knex) {}

  public async findOne(params: Partial<T>) {
    const product = await this.db<T>(this.table)
      .select('*')
      .where(params)
      .first();

    return product;
  }

  public async update(where: Partial<T>, params: Partial<T>, returning = true) {
    await this.db(this.table)
      .update({ ...params })
      .where({ ...where });

    if (returning) return this.findOne({ ...where });

    return true;
  }
}
