using Microsoft.EntityFrameworkCore;
using neflix.Interface;
using neflix.Model;

namespace neflix.Servcies
{
    public class CategoryService : ICategory
    {
        private readonly UserDBContext _dbcontext;
        private readonly ILogger<CategoryService> _logger;
        public CategoryService(UserDBContext userDBContext, ILogger<CategoryService> logger)
        {
            _dbcontext = userDBContext;
            _logger = logger;
        }

        public async Task<Category> AddCategory(Category category)
        {
            try
            {
                await _dbcontext.Categories.AddAsync(category);
                await _dbcontext.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while adding categories: {ex}");
                throw;
            }
        }

        public async Task<Category> UpdateCategory(int id, Category category)
        {
            try
            {
                var existingCategory = await _dbcontext.Categories.FindAsync(id);
                if (existingCategory == null)
                {
                    throw new Exception("Not Found");
                }
                existingCategory.CategoryName = category.CategoryName;

                _dbcontext.Categories.Update(existingCategory);
                await _dbcontext.SaveChangesAsync();

                return existingCategory;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while updating categories: {ex}");
                throw;
            }
        }

        public async Task<bool> DeleteCategory(int id)
        {
            try
            {
                var category = await _dbcontext.Categories.FindAsync(id);
                if (category == null)
                {
                    return false;
                }

                _dbcontext.Categories.Remove(category);
                await _dbcontext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while deleting categories: {ex}");
                throw;
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            try
            {
                return await _dbcontext.Categories.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while fetching categories: {ex}");
                throw;
            }
        }

        public async Task<Category> GetCategoryById(int id)
        {
            try
            {
                return await _dbcontext.Categories.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while fetching category by id: {ex}");
                throw;
            }
        }
    }
}
