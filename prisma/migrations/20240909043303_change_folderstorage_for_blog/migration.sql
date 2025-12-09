-- AlterTable
ALTER TABLE `blog` MODIFY `image` VARCHAR(191) NOT NULL DEFAULT '/blog/blog.webp';

-- AlterTable
ALTER TABLE `blogcategory` MODIFY `image` VARCHAR(191) NOT NULL DEFAULT '/category/category.jpg';
