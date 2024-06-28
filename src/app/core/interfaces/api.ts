export interface Response<T> {
	data: T;
	paging?: Paging;
}

export interface Paging {
	page: number;
	pages: number;
	items: number;
}
