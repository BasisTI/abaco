export class Pageable {
    page: number;
    size: number;
    sort: string;

    constructor(page: number = 0, size: number = 20) {
	    this.page = page;
        this.size = size;
    }

    setPage(page: number) {
        if (page && page === 0) {
            this.page = 0;
        } else {
            this.page = page / this.size;
        }
    }

    setSize(size: number) {
        this.size = (size ? size : 5);
    }

    setSort(sortOrder: number, sortField: string) {
        if (sortField) {
            const direction = sortOrder === 1 ? 'ASC' : 'DESC';
            this.sort = sortField + ',' + direction;
        }
    }
}