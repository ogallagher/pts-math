import * as Create from "./Create";
import * as LinearAlgebra from "./LinearAlgebra";
import * as Num from "./Num";
import * as Op from "./Op";
import * as Pt from "./Pt";
import * as Util from "./Util";

globalThis.Pts = {
  ...Create,
  ...LinearAlgebra, ...Num, ...Op,
  ...Pt,
  ...Util
};
