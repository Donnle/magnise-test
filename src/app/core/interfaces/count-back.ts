import { PERIODICITY } from "../enums/count-back";

export interface CountBackConfiguration {
	instrumentId: string;
	provider: string;
	interval: number;
	periodicity: PERIODICITY;
	barsCount: number;
	date?: string;
}

export interface CountBack {
	t: string; // Date
	o: number; // Open price
	h: number; // Highest price
	l: number; // Lowest price
	c: number; // Close price
	v: number;
}
