import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], filterString?: string): any[] {
    if (!items || !filterString) return items;
    const filteredItems = items.filter(item => {
        if((item.name !== undefined && item.name.search(filterString) > -1) ||
        (item.username !== undefined && item.username.search(filterString) > -1)) {
        return item;
      }
    })
    return filteredItems;
  }

}
