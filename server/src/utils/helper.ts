const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
};
export default json;

export const mapColumnsToKeys = (columns: string[], result: any[]) => {
    if (!Array.isArray(result)) {
      throw new TypeError('Expected result to be an array');
    }
    const newResult = result.map((item: any) => {
      const newItem: any = {};
      for (let i = 0; i < columns.length; i++) {
        newItem[columns[i]] = item[`f${i}`];
      }
      return newItem;
    });
    return newResult;
  };