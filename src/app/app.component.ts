import { Component, Input } from '@angular/core';
import { AgmInfoWindow } from '@agm/core';
import { DataModel, DeviceList, EventData, marker } from 'src/models/Response';
import { MyServiceService } from './my-service.service';
import { DeviceList1, EventData1, Response1, tableModel } from 'src/models/Response2';
import { table } from 'console';
import { ExpandEventArgs } from '@syncfusion/ej2-angular-navigations';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Map App';
  lat: number = 22.0574;
  lng: number = 78.9382;
  zoom:number = 4;
  marker:marker[];
  url:string;
  url2:string;
  loader:boolean=false;
  singleMarker:marker=new marker();
  DeviceList:DeviceList[];
  EventData:EventData[];
  SingleEventData:EventData=new EventData();

  DataModel:DataModel;
  Response1:Response1;
  DeviceList1:DeviceList1[];
  EventData1:EventData1[];
  tableModelList=new  Array<tableModel>();
  tableModel:tableModel;
  MarkerTitleArray:String[];
  @Input() isLoader: Boolean;
  isExpanded:boolean;
  ExistDeviceID:string;
  CountLength:number=0;
  icon = {
    labelOrigin: { x: 16, y: 48 },
    url: "./assets/images/vehicle.png",
    scaledSize: {
      width: 20,
      height: 40
    }
  };
 constructor(  private service: MyServiceService ){

  
 
 }
 ngOnInit() {
this.GetResponse();

}

//in 10 seconds do something
       GetResponse() {
         this.url='http://backup.sendatrack.com:8080/events7/data.jsonx?a=motivation&p=motivation123321&u=admin&g=all&l=1&at=true';
           this.service.GetData1(this.url).subscribe(
               data => { 
               let da = data as any;
               
              let LocalDeviceList= JSON.parse(localStorage.getItem("DeviceList"));
              localStorage.setItem("DeviceList", JSON.stringify(da.DeviceList));
             if(LocalDeviceList==null || (LocalDeviceList.length !=this.CountLength)){
              console.log("5 sece")
              this.CountLength=  LocalDeviceList.length;
              this.DataModel=da;
               this.EventData=[];
               this.DeviceList= this.DataModel.DeviceList;
               this.DeviceList.forEach(deviceData => {
               deviceData.EventData.forEach(eventDataItem=>{
               eventDataItem.markerDescription=deviceData.Device_desc;
               eventDataItem.isActive=true;
               this.EventData.push(eventDataItem); });});
               localStorage.setItem("EventDataVehicle", JSON.stringify(this.EventData));
            
             }
             if(this.CountLength==LocalDeviceList.length){
              console.log(" 5 secend equal")
            }
             
               
            //
               
               },
               err => console.error(err),
               () => console.log('5  done loading')
             );
             setTimeout(() => {
               this.GetResponse();
              //window.location.reload();
             }, 5000);
          }
  previousWindow:AgmInfoWindow = null;

  clickMarker(infoWindow:AgmInfoWindow){    
    if (this.previousWindow) {      
    
      this.previousWindow.close();
    
    }
    this.previousWindow = infoWindow;
  }
//   fieldsChange(values:any,id:any) {
//    this.GetTableDatAndFill(values,id);
//  }

 GetTableDatAndFill(checkBoxValue:any,DeviceId:any) {

  //  this.isLoader=true;
//remove from map

var chxBox=checkBoxValue.currentTarget.checked;
if(!chxBox)
{
  this.EventData = this.EventData.filter(item => item.Device !== DeviceId);
}else
{
 let data= JSON.parse(localStorage.getItem("EventDataVehicle"));

this.SingleEventData= data.find(item => item.Device === DeviceId);
 this.EventData.push(this.SingleEventData);
}
 
 
     
      
    }



    expanded(DeviceId:string)
    {
      this.isLoader=true;
        if(this.ExistDeviceID!=DeviceId)
        {
          this.url='http://backup.sendatrack.com:8080/eventsApp2/data.jsonx?a=motivation&p=motivation123321&u=admin&d='+DeviceId+'&rf=1625443200&rt=1625529599&l=5000&at=true';
          this.service.GetData1(this.url).subscribe(
              data => { 
               let da = data as any;
              this.Response1=da;
              //fill table 
               this.tableModelList=[];
              this.DeviceList1= this.Response1.DeviceList;
              this.DeviceList1.forEach(deviceData1 => {
              deviceData1.EventData.forEach(eventDataItem=>{
                 this.tableModel=new tableModel();
                 this.tableModel.Device=eventDataItem.Device;
                 this.tableModel.Address=eventDataItem.Address;
                 this.tableModel.Timestamp=eventDataItem.Timestamp;
                 this.tableModel.StatusCode=eventDataItem.StatusCode;
               
                    this.tableModelList.push( this.tableModel);
                    this.isLoader=false;
                    this.ExistDeviceID=DeviceId;
               
                   });
              });
              
              },
              err => console.error(err),
              () => console.log('done loading ')
            );
     
        }
    else if(this.ExistDeviceID==DeviceId)
    {
      this.tableModelList=[];
      // this.tableModelList = this.tableModelList.filter(item => item.Device !== DeviceId);
      this.isLoader=false;  
      this.ExistDeviceID="";
    } 

      
    }
}
