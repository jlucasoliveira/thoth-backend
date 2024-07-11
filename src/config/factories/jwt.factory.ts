import { ConfigService } from '@nestjs/config';
import { AuthConfig, AuthConfigToken } from '@/config';

export function jwtFactory(configService: ConfigService) {
  const { expiresIn, secret } =
    configService.getOrThrow<AuthConfig>(AuthConfigToken);

  return {
    secret,
    signOptions: { expiresIn },
  };
}
