import {LiveAnnouncer} from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  id: number,
  TotalConfirmed : number,
  country : string,
  TotalDeaths: number
}
export interface Gloabl {
  Date : string,
  NewConfirmed: number,
  NewDeaths : number,
  TotalConfirmed : number,
  TotalDeaths : number

}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  dataSource: any;
  global: Gloabl;
  // dataSource: PeriodicElement[] = [] ;

  constructor(private http : HttpClient, private _liveAnnouncer: LiveAnnouncer ) { }
  datas : PeriodicElement[] =[];
  @ViewChild(MatSort) sort : MatSort;
  getData() {
    let url = "https://api.covid19api.com/summary";
    return this.http.get(url);
  }
  
  ngOnInit(): void {
    this.getData().subscribe((data : any)=> {
      console.log(data.Countries[0]);
      let data1 = data.Countries;
      this.global = data.Global
      data1.map((d : any, index : any)=>  {
        return this.datas.push({ id: index + 1, country: d.Country, TotalConfirmed: d.TotalConfirmed, TotalDeaths : d.TotalDeaths });
      });
      console.log(this.datas);
      const dataSource1 = new MatTableDataSource(this.datas);
      this.dataSource = dataSource1
      console.log(this.dataSource);
      
    })
  }
  displayedColumns: string[] = ['id', 'country', 'TotalConfirmed', 'TotalDeaths'];
  ngAfterViewInit(){
    console.log(this.dataSource);
    if(this.dataSource)
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: any) {
    console.log("sort --", sortState);
    
    if (sortState.direction) {
      this.dataSource.sort = this.sort
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
