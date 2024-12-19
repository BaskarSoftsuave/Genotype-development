import { Injectable } from "@angular/core";
import { IndexedDBService } from "./db.service";

@Injectable({
    providedIn: 'root'
})
export class IndexedDbApiService{
    constructor(private indexedDBService:IndexedDBService){}

    checkLicenceValidity(){
        return new Promise<any>((resolve, reject) => {
            let licence;
             this.indexedDBService.getLicence().then((licenceDetail)=>{
                licence = licenceDetail
                if(!licence){resolve( {isLicenceValid : false , message : 'no licence'} )} // not vaild licence
                
                // check expriy and return true
                if(licence?.endDate && ( licence.endDate == 'Eternal' || new Date(new Date().toLocaleDateString()).getTime() <= new Date(licence?.endDate).getTime() )){
                    if(! (licence.endDate == 'Eternal')){
                        resolve ({isLicenceValid : true , message : ' licence valid' , licenceValidUpto:licence.endDate,licence:licence}) // valid licence
                    }else{
                        let dateDiffeInMilliSecond = new Date(licence?.endDate).getTime() - new Date(new Date().toLocaleDateString()).getTime() 
                        let milliSecondPerHour = 3600000
                        let expiryIn_hours = Math.floor(dateDiffeInMilliSecond / milliSecondPerHour)
                        resolve ({isLicenceValid : true , message : ' licence valid' , licenceValidUpto:licence.endDate,expiryInHours:expiryIn_hours,licence:licence}) // valid licence
                    }
                }else{
                    resolve ({isLicenceValid : false , message : 'licence expired' })
                }
            }).catch((error)=>{
                resolve({isLicenceValid : false , message : error}) // not vaild licence
            })
        })
    }

    addLicence(licenceDetail){
        return new Promise<any>((resolve, reject) => {
            this.indexedDBService.addLicence(licenceDetail).then(
                (res)=> {
                    resolve(res)
                }
            ).catch((error)=>{
                reject(error)
            })
        })
    }

    addUser(userDetail){
        return new Promise<any>((resolve, reject) => {
            this.indexedDBService.addUser(userDetail).then(
                (res)=>{
                    resolve(res)
                }
            ).catch((error)=>{
                reject(error)
            })
        })
    }

    getUser(userId){
        return new Promise<any>((resolve, reject) => {
            this.indexedDBService.getUser(userId).then(
                (res)=>{
                    resolve(res)
                }
            ).catch((error)=>{
                reject(error)
            })
        })
    }

    addProject(projectDetails){
        return new Promise<any>((resolve, reject) => {
            projectDetails._id = Date.now() + ( (Math.random()*100000).toFixed())  // for unique id
            this.indexedDBService.addProject(projectDetails).then((res)=>{
                resolve(res)
            }).catch((error)=>{
                reject(error)
            })
        })
    }

    getProject(userId,options = {page:0,limit:6,order : -1,orderBy:'project_name',search:''}){
        return new Promise<any>((resolve, reject) => {
            let filter = {skip : options.page * options.limit ,limit : options.limit , sort: options.order , orderBy:options.orderBy, searchByString: options.search}
            this.indexedDBService.getProjectList(userId,filter).then((res)=>{
                resolve(res)
            }).catch((error)=>{
                reject(error)
            })
        })
    }

    deleteProject(id){
        return new Promise<any>((resolve, reject) => {
            this.indexedDBService.deleteProject(id).then((res)=>{
                resolve(res)
            }).catch((error)=>{
                reject(error)
            })
        })
    }
    

}