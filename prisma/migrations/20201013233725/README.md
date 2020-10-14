# Migration `20201013233725`

This migration has been generated at 10/13/2020, 4:37:25 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" DROP COLUMN "order"

ALTER TABLE "public"."Task" DROP COLUMN "position"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201013233710..20201013233725
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Account {
   id                 Int       @id @default(autoincrement())
@@ -65,9 +65,8 @@
 model Task {
   id          Int     @id @default(autoincrement())
   description String
   completed   Boolean
-  position    Int
 }
 model Column {
   id     Int    @id @default(autoincrement())
```


