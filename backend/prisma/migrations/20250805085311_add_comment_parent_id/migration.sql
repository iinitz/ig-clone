-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
