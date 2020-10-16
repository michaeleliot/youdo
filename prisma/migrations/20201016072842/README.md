# Migration `20201016072842`

This migration has been generated at 10/16/2020, 12:28:42 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ADD COLUMN "position" integer   NOT NULL 

ALTER TABLE "public"."Task" ADD COLUMN "position" integer   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201015054308..20201016072842
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
@@ -68,13 +68,15 @@
   description String
   completed   Boolean
   column      Column? @relation(fields: [columnId], references: [id])
   columnId    Int?
+  position    Int
 }
 model Column {
-  id     Int    @id @default(autoincrement())
-  title  String
-  owner  User?  @relation(fields: [userId], references: [id])
-  userId Int?
-  Task   Task[]
+  id       Int    @id @default(autoincrement())
+  title    String
+  owner    User?  @relation(fields: [userId], references: [id])
+  userId   Int?
+  Task     Task[]
+  position Int
 }
```


