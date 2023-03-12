export interface LeadQueryModel {
    readonly location: string;
    readonly companySize: {
        fe: number;
        total: number;
        dev: number
    }
    readonly hiring: {
        junior: boolean;
        active: boolean;
        talentProgram: boolean
    }
    readonly websiteLink: string;
    readonly linkedinLink: string;
    readonly industry: string;
    readonly name: string;
    readonly annualRevenue: number;
    readonly scopes: string[];
}
