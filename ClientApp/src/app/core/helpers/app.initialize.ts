import { AuthService } from "../auth/auth.service";


export function appInitializer(authenticationService: AuthService) {
  return () => new Promise<void>(resolve => {
    //attempt to refresh token at app startup
    authenticationService.refreshToken()
      .subscribe()
      .add(() => resolve());
  });
}
