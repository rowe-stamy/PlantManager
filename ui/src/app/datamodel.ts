export interface Entity {
    id: string;
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string;
    modifiedBy: string;
}


export interface Fraction {
    id: string;
    chargeId: string;
}

export interface Plant extends Entity {
    name: string;
    fractions: Fraction[];
}

export interface Extraction extends Entity {
    plantId: string;
    fractionId: string;
    chargeId: string;
    weightInKg: number;
    comment: string;
}

