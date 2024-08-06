import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import {
  databaseFactory,
  loggerFactory,
  authConfig,
  databaseConfig,
  sentryConfig,
  serverConfig,
  storageConfig,
} from '@/config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { UsersModule } from './users/users.module';
import { StockModule } from './stock/stock.module';
import { OrdersModule } from './orders/orders.module';
import { BrandsModule } from './brands/brands.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { CategoriesModule } from './categories/categories.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      // eslint-disable-next-line prettier/prettier
      load: [serverConfig, databaseConfig, authConfig, storageConfig, sentryConfig],
      envFilePath: '.env',
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: loggerFactory,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseFactory,
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
    BankAccountsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
