# Migration `20201013233710`

This migration has been generated at 10/13/2020, 4:37:10 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" DROP COLUMN "order"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201013233203..20201013233710
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
@@ -72,7 +72,6 @@
 model Column {
   id     Int    @id @default(autoincrement())
   title  String
   owner  User   @relation(fields: [userId], references: [id])
-  order  Int
   userId Int
 }
```


