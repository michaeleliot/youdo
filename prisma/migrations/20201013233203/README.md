# Migration `20201013233203`

This migration has been generated at 10/13/2020, 4:32:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Task" (
"id" SERIAL,
"description" text   NOT NULL ,
"completed" boolean   NOT NULL ,
"position" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Column" (
"id" SERIAL,
"title" text   NOT NULL ,
"order" integer   NOT NULL ,
"userId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Column" ADD FOREIGN KEY ("userId")REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201010040222..20201013233203
--- datamodel.dml
+++ datamodel.dml
@@ -1,63 +1,78 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
-generator client {
-  provider = "prisma-client-js"
-}
-
 model Account {
-  id                 Int       @default(autoincrement()) @id
-  compoundId         String    @unique @map(name: "compound_id")
-  userId             Int       @map(name: "user_id")
-  providerType       String    @map(name: "provider_type")
-  providerId         String    @map(name: "provider_id")
-  providerAccountId  String    @map(name: "provider_account_id")
-  refreshToken       String?   @map(name: "refresh_token")
-  accessToken        String?   @map(name: "access_token")
-  accessTokenExpires DateTime? @map(name: "access_token_expires")
-  createdAt          DateTime  @default(now()) @map(name: "created_at")
-  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+  id                 Int       @id @default(autoincrement())
+  compoundId         String    @unique @map("compound_id")
+  userId             Int       @map("user_id")
+  providerType       String    @map("provider_type")
+  providerId         String    @map("provider_id")
+  providerAccountId  String    @map("provider_account_id")
+  refreshToken       String?   @map("refresh_token")
+  accessToken        String?   @map("access_token")
+  accessTokenExpires DateTime? @map("access_token_expires")
+  createdAt          DateTime  @default(now()) @map("created_at")
+  updatedAt          DateTime  @default(now()) @map("updated_at")
   @@index([providerAccountId], name: "providerAccountId")
   @@index([providerId], name: "providerId")
   @@index([userId], name: "userId")
-
-  @@map(name: "accounts")
+  @@map("accounts")
 }
 model Session {
-  id           Int      @default(autoincrement()) @id
-  userId       Int      @map(name: "user_id")
+  id           Int      @id @default(autoincrement())
+  userId       Int      @map("user_id")
   expires      DateTime
-  sessionToken String   @unique @map(name: "session_token")
-  accessToken  String   @unique @map(name: "access_token")
-  createdAt    DateTime @default(now()) @map(name: "created_at")
-  updatedAt    DateTime @default(now()) @map(name: "updated_at")
+  sessionToken String   @unique @map("session_token")
+  accessToken  String   @unique @map("access_token")
+  createdAt    DateTime @default(now()) @map("created_at")
+  updatedAt    DateTime @default(now()) @map("updated_at")
-  @@map(name: "sessions")
+  @@map("sessions")
 }
 model User {
-  id            Int       @default(autoincrement()) @id
+  id            Int       @id @default(autoincrement())
   name          String?
   email         String?   @unique
-  emailVerified DateTime? @map(name: "email_verified")
+  emailVerified DateTime? @map("email_verified")
   image         String?
-  createdAt     DateTime  @default(now()) @map(name: "created_at")
-  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
+  createdAt     DateTime  @default(now()) @map("created_at")
+  updatedAt     DateTime  @default(now()) @map("updated_at")
-  @@map(name: "users")
+  Column Column[]
+  @@map("users")
 }
 model VerificationRequest {
-  id         Int      @default(autoincrement()) @id
+  id         Int      @id @default(autoincrement())
   identifier String
   token      String   @unique
   expires    DateTime
-  createdAt  DateTime  @default(now()) @map(name: "created_at")
-  updatedAt  DateTime  @default(now()) @map(name: "updated_at")
+  createdAt  DateTime @default(now()) @map("created_at")
+  updatedAt  DateTime @default(now()) @map("updated_at")
-  @@map(name: "verification_requests")
-}
+  @@map("verification_requests")
+}
+
+model Task {
+  id          Int     @id @default(autoincrement())
+  description String
+  completed   Boolean
+  position    Int
+}
+
+model Column {
+  id     Int    @id @default(autoincrement())
+  title  String
+  owner  User   @relation(fields: [userId], references: [id])
+  order  Int
+  userId Int
+}
```


