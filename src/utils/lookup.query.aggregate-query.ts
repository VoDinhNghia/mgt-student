/* eslint-disable class-methods-use-this */
interface IlookupInterface {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  unwind: boolean;
}

export class LookupCommon {
  lookup(listFields: IlookupInterface[]) {
    const results = [];
    for (const obj of listFields) {
      const lookup = {
        $lookup: {
          from: obj.from,
          localField: obj.localField,
          foreignField: obj.foreignField,
          as: `${obj.as}`,
        },
      };
      results.push(lookup);
      if (obj.unwind) {
        results.push({ $unwind: `$${obj.as}` });
      }
    }
    return results;
  }
}
