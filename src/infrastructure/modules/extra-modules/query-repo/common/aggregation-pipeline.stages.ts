import { dot } from "dot-object";
import _, { isNil } from "lodash";

export type Stage = {
  [k: string]: any;
};

export const addFields = (AddFields: Object) => {
  return {
    $addFields: AddFields,
  };
};

export const Match = (...Match: Object[]): Stage => {
  return {
    $match: _.merge({}, ...Match),
  };
};

export const Unwind = (
  Path: string,
  PreserveNullAndEmptyArrays: boolean = false
): Stage => {
  return {
    $unwind: {
      path: Path,
      preserveNullAndEmptyArrays: PreserveNullAndEmptyArrays,
    },
  };
};

export const Limit = (Limit: number): Stage => {
  return {
    $limit: Limit,
  };
};

export const LookupBasic = (
  FromCollection: string,
  LocalField: string,
  ForeignField: string,
  As: string
): Stage => {
  return {
    $lookup: {
      from: FromCollection,
      localField: LocalField,
      foreignField: ForeignField,
      as: As,
    },
  };
};

export const Lookup = (
  FromCollection: string,
  Let: any,
  Pipeline: any[],
  As: string
): Stage => {
  return {
    $lookup: {
      from: FromCollection,
      let: Let,
      pipeline: Pipeline.filter((stage) => !isNil(stage)),
      as: As,
    },
  };
};

export const ReplaceRoot = (NewRoot: string | Object): Stage => {
  return {
    $replaceRoot: {
      newRoot: NewRoot,
    },
  };
};

export const Set = (...Set: Object[]): Stage => {
  return {
    $set: _.merge({}, ...Set),
  };
};

export const Sort = (Sort: Object) => {
  return {
    $sort: Sort,
  };
};

export const Unset = (Field: string | string[]): Stage => {
  return {
    $unset: Field,
  };
};

export const Facet = (Facet: Record<string, Stage[]>): Stage => {
  return {
    $facet: Facet,
  };
};

export const Project = (Project: {
  Id?: 0 | false;
  Include?: Object;
  Exclude?: Object;
  Fields?: Object;
}): Stage => {
  const { Id, Include, Exclude, Fields } = Project;

  let specifications = {};

  if (Id === 0 || Id === false) {
    specifications["_id"] = Id;
  }

  const dotInclude = dot(Include || {});
  const dotExclude = dot(Exclude || {});
  const dotFields = dot(Fields || {});

  Object.keys(dotExclude).forEach((field) => {
    if (dotExclude[field] === 0) specifications[field] = 0;
  });

  Object.keys(dotInclude).forEach((field) => {
    if (dotInclude[field] === 1) specifications[field] = 1;
  });

  specifications = _.merge(specifications, dotFields);

  return {
    $project: specifications,
  };
};

export const AggStages = {
  Match,
  Facet,
  Limit,
  LookupBasic,
  Lookup,
  Project,
  ReplaceRoot,
  Set,
  Sort,
  Unset,
  Unwind,
};

export default AggStages;
