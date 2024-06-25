import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { StockModule } from './stock/stock.module';
import { TokensModule } from './tokens/tokens.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { NODE_ENV } from './config/configuration';
import { oracleConnectionConfig } from './config/data-source';

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
    TypeOrmModule.forRootAsync({
      useFactory: oracleConnectionConfig,
    }),
    UsersModule,
    AuthModule,
    BrandsModule,
    StockModule,
    ProductsModule,
    CategoriesModule,
    TokensModule,
    AttachmentsModule,
    ClientsModule,
    OrdersModule,
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
