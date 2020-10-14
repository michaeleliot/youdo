# Migration `20201014015045`

This migration has been generated at 10/13/2020, 6:50:45 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Task" ADD COLUMN "columnId" integer   NOT NULL 

ALTER TABLE "public"."Task" ADD FOREIGN KEY ("columnId")REFERENCES "public"."Column"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201013233725..20201014015045
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
@@ -65,12 +65,15 @@
 model Task {
   id          Int     @id @default(autoincrement())
   description String
   completed   Boolean
+  column      Column  @relation(fields: [columnId], references: [id])
+  columnId    Int
 }
 model Column {
   id     Int    @id @default(autoincrement())
   title  String
   owner  User   @relation(fields: [userId], references: [id])
   userId Int
+  Task   Task[]
 }
```


