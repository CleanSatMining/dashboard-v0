import { Database } from "./supabase";

export type TableType = keyof Database["public"]["Tables"];
export type TableRow = Database["public"]["Tables"][TableType]["Row"];

export type Contract = Database["public"]["Tables"]["contracts"]["Row"] & {
  api: Database["public"]["Tables"]["apis"]["Row"];
};

export type Container = Database["public"]["Tables"]["containers"]["Row"] & {
  asics: Database["public"]["Tables"]["asics"]["Row"];
  location: Database["public"]["Tables"]["locations"]["Row"];
};

export type Site = Database["public"]["Tables"]["sites"]["Row"] & {
  location: Database["public"]["Tables"]["locations"]["Row"];
  contract: Contract;
  operator: Database["public"]["Tables"]["operators"]["Row"];
  containers: Container[];
  powerPlant: Database["public"]["Tables"]["powerPlants"]["Row"];
};

export type Farm = Database["public"]["Tables"]["farms"]["Row"] & {
  sites: Site[];
  location: Database["public"]["Tables"]["locations"]["Row"];
  society: Database["public"]["Tables"]["societies"]["Row"];
  token: Database["public"]["Tables"]["tokens"]["Row"];
  vaults: Database["public"]["Tables"]["vaults"]["Row"][];
};


export type FarmSummary = Database["public"]["Tables"]["farms"]["Row"];

export type FinancialBalance = {
  btc: number;
  usd: number;
  source:string;
}

export type FarmBalance = {
  btcSellPrice: number;
  expenses: {
    electricity: FinancialBalance;
    csm: FinancialBalance;
    operator: FinancialBalance;
    depreciation: FinancialBalance;
    other: FinancialBalance;
  },
  incomes: {
    mining: FinancialBalance;
    other: FinancialBalance;
  },
  revenue: {
    gross: FinancialBalance;
    net: FinancialBalance;
  };
}

export type ContainerEquipment = {
  containerId: number;
  units: number;
  manufacturer: string;
  model: string;
  hashrateTHs: number;
  powerW: number;
}

export type FarmEquipment = {
  asics: ContainerEquipment[];
  hashrateTHsMax: number;
  powerWMax: number;
  hashrateTHs: number;
  uptime: number;
  totalCost: number;
}
export type BalanceSheet = {
  start: string;
  end: string;
  days: number;
  balance: FarmBalance;
  equipments: FarmEquipment;
}

export type DetailedBalanceSheet = BalanceSheet & {
  details:BalanceSheet[];
};