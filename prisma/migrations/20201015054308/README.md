# Migration `20201015054308`

This migration has been generated at 10/14/2020, 10:43:08 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ALTER COLUMN "userId" DROP NOT NULL

ALTER TABLE "public"."Task" ALTER COLUMN "columnId" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201014015045..20201015054308
--- datamodel.dml
+++ datamodel.dml
@@ -1,11 +1,12 @@
 generator client {
-  provider = "prisma-client-js"
+  provider        = "prisma-client-js"
+  previewFeatures = ["atomicNumberOperations"]
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Account {
   id                 Int       @id @default(autoincrement())
@@ -65,15 +66,15 @@
 model Task {
   id          Int     @id @default(autoincrement())
   description String
   completed   Boolean
-  column      Column  @relation(fields: [columnId], references: [id])
-  columnId    Int
+  column      Column? @relation(fields: [columnId], references: [id])
+  columnId    Int?
 }
 model Column {
   id     Int    @id @default(autoincrement())
   title  String
-  owner  User   @relation(fields: [userId], references: [id])
-  userId Int
+  owner  User?  @relation(fields: [userId], references: [id])
+  userId Int?
   Task   Task[]
 }
```


