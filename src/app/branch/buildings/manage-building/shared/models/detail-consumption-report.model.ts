export class CostModel {
    totalExel: number | null;
    vat: number | null;
    totalIncl: number | null;
    supplyType?: number | null;
}

export class TenantDetailConsumptionReportModel {
    id: string | null;
    tenantName: string | null;
    shopName: string | null;
    shopDetailName: string | null;
    supplyName: string | null;
    itemName: string | null;
    costs: CostModel[] | [];
    isExpanded: boolean;
    details: any | null;
    childs: TenantDetailConsumptionReportModel[] | [];
    isLast: boolean | false;
    isFirst: boolean | false;
}