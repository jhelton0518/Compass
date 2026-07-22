import type { MonthlyBalanceSheetRecord, OpeningEquityAnchor } from "../app/types/balance-sheet.ts";
import { financialPeriods } from "./financial-periods.ts";

export const volunteerCustomHomesOpeningEquityAnchor: OpeningEquityAnchor = {
  companyId: "vch",
  period: "2024-06",
  retainedEarnings: 450_000,
  currentFiscalYearNetIncome: 120_000,
};

const thousands = (values: readonly number[]) => values.map((value) => value * 1_000);
const periods = financialPeriods.map((period) => period.id);

// These are period-ending operational balances. Rising AR, Other Current Assets,
// AP, and credit-card balances model slower collections, advance material buys,
// and tighter short-term liquidity. Owner distributions are explicit cumulative
// equity withdrawals, not a generic balancing category. Retained Earnings closes
// the preceding calendar year's calculated Net Income each January.
const accountSeries: Record<string, readonly number[]> = {
  "gl-1000": thousands([620,605,590,575,555,540,560,550,535,525,518,510,500,490,475,460,445,430,512,486,459,447,431,418]),
  "gl-1100": thousands([420,432,445,458,472,490,505,520,535,550,575,600,610,620,632,645,655,665,680,700,720,740,760,782]),
  "gl-1200": thousands([55,56,57,58,60,62,64,66,68,70,75,80,82,84,86,88,90,92,90,91,92,94,95,96]),
  "gl-1500": thousands([900,930,950,970,1000,1030,1060,1090,1120,1150,1190,1230,1260,1290,1320,1350,1380,1410,1440,1470,1500,1530,1560,1590]),
  "gl-1510": thousands([-250,-260,-270,-280,-290,-300,-310,-320,-330,-340,-350,-360,-375,-390,-405,-420,-435,-450,-465,-480,-495,-510,-525,-540]),
  "gl-1600": thousands([40,40,42,42,44,45,45,46,46,47,48,48,48,49,49,49,50,50,50,50,50,50,50,50]),
  "gl-2000": thousands([260,270,275,285,295,310,320,330,340,350,365,380,390,400,410,420,430,440,455,470,485,500,512,524]),
  "gl-2100": thousands([45,47,48,50,52,55,58,60,62,65,70,75,78,80,82,84,86,90,95,100,105,110,114,118]),
  "gl-2200": thousands(Array(24).fill(0)),
  "gl-2300": thousands(Array(24).fill(0)),
  "gl-2400": thousands(Array(24).fill(0)),
  "gl-2500": thousands([25,26,26,27,28,30,30,31,32,33,34,35,35,36,36,37,38,38,39,40,40,41,41,42]),
  "gl-2700": thousands([620,610,600,590,580,570,560,550,540,530,520,510,500,490,480,470,460,450,440,430,420,410,400,390]),
  "gl-3000": thousands([300,300,300,300,300,300,350,350,350,350,350,350,350,350,350,350,350,350,450,450,450,450,450,450]),
  "gl-3100": [-69_340,-90_750,-114_230,-148_780,-171_100,-183_890,-213_980,-225_140,-245_480,-269_250,-278_210,-300_234,-320_094,-342_094,-368_374,-395_674,-426_034,-443_474,-479_814,-518_614,-568_114,-615_114,-671_594,-731_194],
  "gl-3200": [450_000,450_000,450_000,450_000,450_000,450_000,785_890,785_890,785_890,785_890,785_890,785_890,785_890,785_890,785_890,785_890,785_890,785_890,1_272_474,1_272_474,1_272_474,1_272_474,1_272_474,1_272_474],
};

for (const [accountId, values] of Object.entries(accountSeries)) {
  if (values.length !== periods.length) throw new Error(`${accountId} must contain ${periods.length} period-ending balances.`);
}

export const volunteerCustomHomesBalanceSheetRecords: MonthlyBalanceSheetRecord[] = periods.map((period, periodIndex) => ({
  companyId: "vch",
  period,
  balances: Object.entries(accountSeries).map(([glAccountId, values]) => ({ glAccountId, endingBalance: values[periodIndex] })),
}));
