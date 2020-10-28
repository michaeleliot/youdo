# Migration `20201028032352`

This migration has been generated at 10/27/2020, 8:23:52 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" DROP COLUMN "hidden"

ALTER TABLE "public"."Task" DROP COLUMN "hidden"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201026012243..20201028032352
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
@@ -69,16 +69,14 @@
   completed   Boolean @default(false)
   column      Column? @relation(fields: [columnId], references: [id])
   columnId    Int?
   position    Int?
-  hidden      Boolean @default(true)
 }
 model Column {
-  id       Int     @id @default(autoincrement())
-  title    String  @default("New Column")
-  owner    User?   @relation(fields: [userId], references: [id])
+  id       Int    @id @default(autoincrement())
+  title    String @default("New Column")
+  owner    User?  @relation(fields: [userId], references: [id])
   userId   Int?
   Task     Task[]
   position Int?
-  hidden   Boolean @default(true)
 }
```


