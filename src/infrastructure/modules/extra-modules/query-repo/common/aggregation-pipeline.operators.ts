export const And = (Args: Object[]) => {
  return {
    $and: Args,
  };
};

export const Or = (Args: Object[]) => {
  return {
    $or: Args,
  };
};

export const Cond = (If: any, Then: any, Else: any) => {
  return {
    $cond: [If, Then, Else],
  };
};

export const Gt = (Exp1: any, Exp2: any) => {
  return {
    $gt: [Exp1, Exp2],
  };
};

export const Gte = (Exp1: any, Exp2: any) => {
  return {
    $gte: [Exp1, Exp2],
  };
};

export const Lt = (Exp1: any, Exp2: any) => {
  return {
    $lt: [Exp1, Exp2],
  };
};

export const Lte = (Exp1: any, Exp2: any) => {
  return {
    $lte: [Exp1, Exp2],
  };
};

export const Eq = (Exp1: any, Exp2: any) => {
  return {
    $eq: [Exp1, Exp2],
  };
};

export const Ne = (Exp1: any, Exp2: any) => {
  return {
    $ne: [Exp1, Exp2],
  };
};

export const In = (Arg1: any, Arg2: string | any[]) => {
  return {
    $in: [Arg1, Arg2],
  };
};

export const IfNull = (...Args: (string | Object)[]) => {
  return {
    $ifNull: Args,
  };
};

export const MergeObjects = (Args: (Object | string)[]) => {
  return {
    $mergeObjects: [...Args],
  };
};

export const Switch = (Branches: Object[], Default?: Object) => {
  return {
    $switch: {
      branches: Branches,
      default: Default,
    },
  };
};

export const RegexMatch = (Input: Object, Regex: Object, Options?: Object) => {
  return {
    $regexMatch: {
      input: Input,
      regex: Regex,
      options: Options,
    },
  };
};

export const AggOps = {
  And,
  Cond,
  Eq,
  Gt,
  Gte,
  Lt,
  Lte,
  IfNull,
  In,
  Ne,
  Or,
  MergeObjects,
  Switch,
  RegexMatch,
};

export default AggOps;
