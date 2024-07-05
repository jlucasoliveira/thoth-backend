import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AttachmentsModule } from './attachments/attachments.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { NODE_ENV } from './config/configuration';
import { oracleConnectionConfig } from './config/data-source';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    AttachmentsModule,
    ClientsModule,
    OrdersModule,
    PaymentsModule,
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
