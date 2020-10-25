# Migration `20201024210323`

This migration has been generated at 10/24/2020, 2:03:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL

ALTER TABLE "public"."Task" ADD COLUMN "hidden" boolean   NOT NULL DEFAULT true,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "completed" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201016072842..20201024210323
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Account {
   id                 Int       @id @default(autoincrement())
@@ -63,20 +63,21 @@
   @@map("verification_requests")
 }
 model Task {
-  id          Int     @id @default(autoincrement())
-  description String
-  completed   Boolean
-  column      Column? @relation(fields: [columnId], references: [id])
+  id          Int      @id @default(autoincrement())
+  description String?
+  completed   Boolean?
+  column      Column?  @relation(fields: [columnId], references: [id])
   columnId    Int?
-  position    Int
+  position    Int?
+  hidden      Boolean  @default(true)
 }
 model Column {
-  id       Int    @id @default(autoincrement())
-  title    String
-  owner    User?  @relation(fields: [userId], references: [id])
+  id       Int     @id @default(autoincrement())
+  title    String?
+  owner    User?   @relation(fields: [userId], references: [id])
   userId   Int?
   Task     Task[]
-  position Int
+  position Int?
 }
```


