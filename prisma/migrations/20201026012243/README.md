# Migration `20201026012243`

This migration has been generated at 10/25/2020, 6:22:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ALTER COLUMN "userId" DROP NOT NULL

ALTER TABLE "public"."Task" ALTER COLUMN "columnId" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201026010508..20201026012243
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
@@ -66,19 +66,19 @@
 model Task {
   id          Int     @id @default(autoincrement())
   description String  @default("New Task")
   completed   Boolean @default(false)
-  column      Column  @relation(fields: [columnId], references: [id])
-  columnId    Int
+  column      Column? @relation(fields: [columnId], references: [id])
+  columnId    Int?
   position    Int?
   hidden      Boolean @default(true)
 }
 model Column {
   id       Int     @id @default(autoincrement())
   title    String  @default("New Column")
-  owner    User    @relation(fields: [userId], references: [id])
-  userId   Int
+  owner    User?   @relation(fields: [userId], references: [id])
+  userId   Int?
   Task     Task[]
   position Int?
   hidden   Boolean @default(true)
 }
```


