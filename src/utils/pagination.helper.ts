import {NotFoundException} from "@nestjs/common";
import {DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER} from "./constants/pagination.constants";

export class PaginationHelper{

    private makeOptions(items, options, count): any {
        const limit = options.limit !== undefined ? Number(options.limit) : DEFAULT_PAGE_LIMIT;
        const itemsPerPage = limit == 0 ? count : limit;
        const pageNumber = options.page !== undefined ? Number(options.page) : DEFAULT_PAGE_NUMBER;
        const path = options.path;
        const totalPages = Math.ceil(count / itemsPerPage);

        if (pageNumber > totalPages && totalPages > 0) throw new NotFoundException();

        return {
            totalItems: count,
            limit: itemsPerPage,
            itemsCount: items.length,
            totalPages: Math.ceil(count / itemsPerPage),
            pageNumber: pageNumber,
            nextPage: (totalPages > 1 && pageNumber < (totalPages - 1)) ? (pageNumber + 1) : pageNumber,
            prevPage: pageNumber > 0 ? pageNumber - 1 : 0,
            lastPage: totalPages > 1 ? totalPages - 1 : totalPages,
            route: `${process.env.BASE_URL}${path}`
        }
    }

    private makeMeta(options: any) {
        const { totalItems, limit, itemsCount, totalPages, pageNumber } = options;

        return {
            "itemCount": itemsCount,
            "totalItems": totalItems,
            "itemsPerPage": limit,
            "totalPages": totalPages,
            "currentPage": pageNumber
          }
    }

    private makeLinks(options: any): any {
        const { limit, prevPage, nextPage, lastPage, totalPages, route } = options;

        return {
            "first": `${route}?limit=${limit}`,
            "previous": `${route}?page=${prevPage}&limit=${limit}`,
            "next": `${route}?page=${nextPage}&limit=${limit}`,
            "last": `${route}?page=${lastPage}&limit=${limit}`
        }
    }

    static makePaginationData(items, options, count): any {
        const paginator: PaginationHelper = new PaginationHelper();
        const metaOptions = paginator.makeOptions(items, options, count);
        const meta =  paginator.makeMeta(metaOptions);
        const links = paginator.makeLinks(metaOptions);

        const limit = Number(options.limit);
        if(limit > 0) {
            return {totalCount: count, data: items, meta, links}
        } else {
            return { totalCount: count, data: items}
        }

    }
}