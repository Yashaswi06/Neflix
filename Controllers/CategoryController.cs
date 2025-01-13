using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using neflix.Interface;
using neflix.Model;

namespace neflix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategory _categoryService;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategory categoryService, ILogger<CategoryController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            try
            {
                if (category == null)
                {
                    return BadRequest("Category cannot be null");
                }
                var createdCategory = await _categoryService.AddCategory(category);
                return Ok(new Response<Category>(true, "Category created successfully.", createdCategory));

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while Creating category: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            try
            {
                if (id != category.CategoryId)
                {
                    return BadRequest(new Response<string>(false, "Category ID mismatch.", null));
                }

                var updatedCategory = await _categoryService.UpdateCategory(id, category);
                if (updatedCategory == null)
                {
                    return NotFound(new Response<string>(false, "Category not found.", null));
                }

                return Ok(new Response<Category>(true, "Category updated successfully.", updatedCategory));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while updating category: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new Response<string>(false, "Invalid category ID.", null));
                }

                var isDeleted = await _categoryService.DeleteCategory(id);
                if (!isDeleted)
                {
                    return NotFound(new Response<string>(false, "Category not found.", null));
                }

                return Ok(new Response<string>(true, "Category Deleted Successfully.", null));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while deleting category: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategories();
                return Ok(new Response<IEnumerable<Category>>(true, "Categories retrieved successfully.", categories));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while getting categories: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new Response<string>(false, "Invalid category ID.", null));
                }

                var category = await _categoryService.GetCategoryById(id);
                if (category == null)
                {
                    return NotFound(new Response<string>(false, "Category not found.", null));
                }

                return Ok(new Response<Category>(true, "Category retrieved successfully.", category));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while getting category by id: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
