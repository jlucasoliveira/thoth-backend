import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { GendersModule } from './genders/genders.module';
import { PricesModule } from './prices/prices.module';
import { StockModule } from './stock/stock.module';
import { TokensModule } from './tokens/tokens.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { NODE_ENV } from './config/configuration';

@Module({
  imports: [
    RavenModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
      },
    }),
    UsersModule,
    AuthModule,
    BrandsModule,
    ProductsModule,
    CategoriesModule,
    GendersModule,
    PricesModule,
    StockModule,
    TokensModule,
    AttachmentsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
