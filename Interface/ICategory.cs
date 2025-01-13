using neflix.Model;

namespace neflix.Interface
{
    public interface ICategory
    {
        Task<Category> AddCategory(Category category);
        Task<Category> UpdateCategory(int id, Category category);
        Task<bool> DeleteCategory(int id);
        Task<IEnumerable<Category>> GetAllCategories();
        Task<Category> GetCategoryById(int id);
    }
}
