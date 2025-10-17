import * as Create from "./Create";
import * as LinearAlgebra from "./LinearAlgebra";
import * as Num from "./Num";
import * as Op from "./Op";
import * as Pt from "./Pt";
import * as Util from "./Util";
import * as Physics from "./Physics";
import * as Play from "./Play";

globalThis.Pts = {
  ...Create,
  ...LinearAlgebra, ...Num, ...Op,
  ...Pt,
  ...Util,
  ...Physics,
  ...Play
};
