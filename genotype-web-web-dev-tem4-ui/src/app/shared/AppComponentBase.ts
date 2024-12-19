import {AuthenticationService} from "../core/services/authentication.service";
import {Injector} from "@angular/core";

export abstract class AppComponentBase {
public authenticationService: AuthenticationService

  protected constructor(injector: Injector) {
  this.authenticationService = injector.get(AuthenticationService);
  }
}
