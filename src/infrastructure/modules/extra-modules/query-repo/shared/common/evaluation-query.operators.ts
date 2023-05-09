export const Expr = (Expr: Object) => {
  return {
    $expr: Expr,
  };
};

export const EvalQueryOps = {
  Expr,
};

export default EvalQueryOps;
