import { Injectable, UnauthorizedException,GoneException } from '@nestjs/common';
// import { AuthService } from '../../service/auth/auth.service';
import * as config from 'config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/service/user/user.service';
import { LicenseService } from 'src/service/licence/license.service';

const jwtConfig = config.get('JWT');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private licenseService : LicenseService ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    if (payload.email) {
      console.log('email check');
      let user: any;
      if (payload.role == 'ADMIN') {
        user = await this.userService.findUserByEmail(payload.email);//findUser
      }else{
        user = await this.userService.findUser(payload.email);
        if(!(await this.licenseService.licenseValidation(payload.licenceId))){
          throw new GoneException('Invalid license, license is expired')
        }
      }
      if (!user) {
        throw new UnauthorizedException('Malformed User');
      }
    } else {
      throw new UnauthorizedException('Malformed User');
    }
    console.log(payload);
    return payload;
  }
}
