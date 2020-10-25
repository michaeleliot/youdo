# Migration `20201025201822`

This migration has been generated at 10/25/2020, 1:18:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ADD COLUMN "hidden" boolean   DEFAULT true
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201024210323..20201025201822
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
@@ -73,11 +73,12 @@
   hidden      Boolean  @default(true)
 }
 model Column {
-  id       Int     @id @default(autoincrement())
+  id       Int      @id @default(autoincrement())
   title    String?
-  owner    User?   @relation(fields: [userId], references: [id])
+  owner    User?    @relation(fields: [userId], references: [id])
   userId   Int?
   Task     Task[]
   position Int?
+  hidden   Boolean? @default(true)
 }
```


