# Migration `20201026010508`

This migration has been generated at 10/25/2020, 6:05:08 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Column" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT E'New Column',
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "hidden" SET NOT NULL

ALTER TABLE "public"."Task" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT E'New Task',
ALTER COLUMN "completed" SET NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "columnId" SET NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201025201822..20201026010508
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
@@ -63,22 +63,22 @@
   @@map("verification_requests")
 }
 model Task {
-  id          Int      @id @default(autoincrement())
-  description String?
-  completed   Boolean?
-  column      Column?  @relation(fields: [columnId], references: [id])
-  columnId    Int?
+  id          Int     @id @default(autoincrement())
+  description String  @default("New Task")
+  completed   Boolean @default(false)
+  column      Column  @relation(fields: [columnId], references: [id])
+  columnId    Int
   position    Int?
-  hidden      Boolean  @default(true)
+  hidden      Boolean @default(true)
 }
 model Column {
-  id       Int      @id @default(autoincrement())
-  title    String?
-  owner    User?    @relation(fields: [userId], references: [id])
-  userId   Int?
+  id       Int     @id @default(autoincrement())
+  title    String  @default("New Column")
+  owner    User    @relation(fields: [userId], references: [id])
+  userId   Int
   Task     Task[]
   position Int?
-  hidden   Boolean? @default(true)
+  hidden   Boolean @default(true)
 }
```


