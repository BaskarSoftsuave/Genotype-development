import { Injectable } from "@angular/core";
import { skip } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
  // public db;
  public dbName = 'genotype';
  public licenceStore = 'licence'
  public userStore = 'user'
  public projectStore = 'project'
  // try to set value to the above variabe from environments.ts

  constructor(){ }

  private openDatabase(){
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        reject("Database error on open : " + (event.target as any).errorCode);
      };

      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;

        db.createObjectStore(this.licenceStore);
        // licenceStore.createIndex('id', 'id', { unique: true });// for one and only data in licence store

        db.createObjectStore(this.userStore, { keyPath: '_id' });
        let projectStore = db.createObjectStore(this.projectStore, { keyPath: '_id' });
        projectStore.createIndex('userId', 'userId', { unique: false });
      };
    });
  }

  addLicence(licencedata:any):Promise<any>{
    //licence store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.licenceStore],'readwrite')
        let objectStore = transaction.objectStore(this.licenceStore)
        let request = objectStore.put(licencedata,1)

        request.onsuccess= (event)=>{
          console.log('licence added in db licenceStore successfully ',licencedata)
          resolve('licence added successfully')
        }

        request.onerror= (event)=>{
          reject(' error on licence adding in db licenceStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  getLicence(){
    //licence store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.licenceStore])
        let objectStore = transaction.objectStore(this.licenceStore)
        let request = objectStore.get(1)

        request.onsuccess= (event)=>{
          const result = (event.target as any).result
          resolve(result)
        }

        request.onerror= (event)=>{
          reject(' error on getting licence in db licenceStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  addUser(userDetials){
    //user store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.userStore],'readwrite')
        let objectStore = transaction.objectStore(this.userStore)
        let request = objectStore.add(userDetials)

        request.onsuccess = (event)=>{
          resolve('user added')
        }

        request.onerror = (event)=>{
          reject(' error on adding user in db userStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  getUser(_id){
    //user store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.userStore],'readwrite')
        let objectStore = transaction.objectStore(this.userStore)
        let request = objectStore.get(_id)

        request.onsuccess = (event)=>{
          const result = (event.target as any).result
          resolve(result)
        }

        request.onerror = (event)=>{
          reject(' error on getting user from db userStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  addProject(projectDetails){
    //project store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.projectStore],'readwrite')
        let objectStore = transaction.objectStore(this.projectStore)
        let request = objectStore.add(projectDetails)

        request.onsuccess = (event)=>{
          resolve('project added')
        }

        request.onerror = (event)=>{
          reject('error on adding project in db projectStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  getProjectList(userId: string,
    options: {
      skip: number
      limit: number;
      sort: number;
      searchByString: string;
      orderBy:string
    }){
    //project store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.projectStore],'readwrite')
        let objectStore = transaction.objectStore(this.projectStore)
        let index = objectStore.index('userId')
        const request = index.getAll(IDBKeyRange.only(userId))

        let CusorPosition = 0
        let projectCount =0
        let result :any = []

        request.onsuccess = () => {

          let projectList = request.result;
          projectCount = projectList.length
          if(projectCount !== 0 ){
            if(options.sort !== 1){
              projectList.sort((a,b)=> a[options?.orderBy].localeCompare(b[options?.orderBy])) 
            }else{
              projectList.sort((b,a)=> a[options?.orderBy].localeCompare(b[options?.orderBy])) 
            }
            
            for(let i = options.skip; i < projectCount && i < options.skip+options.limit;i++){
              //this condition is to skip and limit the element in the list to show n element in m th page 
              if((options.searchByString && projectList[i].project_name.toLowerCase().includes(options.searchByString)) || options.searchByString ==''){
                  // this condition is to filter the project by searched key word
                  result.push(projectList[i])
              }
            }
            resolve({data:result,projectCount})
          }else{
            resolve({data:result,projectCount})
          }


          // CusorPosition++;
          // const cursor:any = request.result;
          // if(cursor){
          //   if(CusorPosition > (options?.skip)){
          //     //this condition is to skip the for to show in the nth page
          //     const project = cursor.value;
          //     if(options.searchByString && project.project_name.includes(options.searchByString)){
          //       // this condition is to filter the project by searched key word
          //       result.push(project)
          //     }
          //     if(result.length >= options.limit){
          //       // this condition is to limit the no of project to show in the page
          //       resolve({data:result,projectCount})
          //       return
          //     }
          //   }else{
          //     cursor.continue();
          //   }
          // }else{
          //   resolve({data:result,projectCount})
          // }
        }

        request.onerror = (event)=>{
          reject('error on getting project from db projectStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }

  deleteProject(id){
    //project store
    return new Promise<any>((resolve, reject) => {
      this.openDatabase().then((db)=>{
        let transaction = db.transaction([this.projectStore],'readwrite')
        let objectStore = transaction.objectStore(this.projectStore)
        let request = objectStore.delete(id)

        request.onsuccess= (event)=>{
          // const result = (event.target as any).result
          resolve('project deleted')
        }

        request.onerror= (event)=>{
          reject(' error on deleting project in db projectStore ' + (event.target as any).errorCode);
        }

        transaction.oncomplete = (event)=>{
          db.close();
        }

      }).catch((error)=>{
        reject(error)
      })
    })

  }

  
  // need to consider to delete the deleted user (on any api call)

  
}
