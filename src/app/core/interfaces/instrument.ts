export type Instruments = Instrument[];

export interface Instrument {
	id: string;
	symbol: string;
	kind: string;
	description: string;
	tickSize: number;
	currency: string;
	baseCurrency: string;
	mappings: Mappings;
}

export interface Mappings {
	[key: string]: Map;
}

export interface Map {
	symbol: string;
	exchange: string;
	defaultOrderSize: number;
}

export interface InstrumentsConfiguration {
	providers?: string[];
	exchanges?: string[];
	page: number;
	size: number;
}
