import { HttpParams } from '@angular/common/http';
import { DataTable } from 'primeng/primeng';
import { Pageable } from './pageable.util';

export class RequestUtil {

  static getRequestParams = (datatable?: DataTable): HttpParams => {
    let params: HttpParams = new HttpParams();
    if (datatable == null) {
      const pageable = new Pageable(1, 20);
      return params = Object.assign({params: pageable});
    }
  
    params = params.append('page', Math.round(datatable.first / datatable.rows).toString());
    params = params.append('size', datatable.rows == null ? null : datatable.rows.toString());
  
    const direction = datatable.sortOrder === 1 ? 'ASC' : 'DESC';
    params = params.append('sort', datatable.sortField == null ? '' : datatable.sortField + ',' + direction);
  
    return params;
  }
}