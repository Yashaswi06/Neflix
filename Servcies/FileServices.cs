using neflix.Interface;
using System;


namespace Netfliee.Service
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

     
        public Tuple<int, string> SaveImage(IFormFile imageFile)
        {
            try
            {
                var contentPath = this._environment.ContentRootPath;
               
                var path = Path.Combine(contentPath, "Uploads");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var ext = Path.GetExtension(imageFile.FileName);
                var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };
                if (!allowedExtensions.Contains(ext))
                {
                    string msg = string.Format("Only {0} extensions are allowed", string.Join(",", allowedExtensions));
                    return new Tuple<int, string>(0, msg);
                }
                string uniqueString = Guid.NewGuid().ToString();
                var newFileName = uniqueString + ext;
                var fileWithPath = Path.Combine(path, newFileName);
                var stream = new FileStream(fileWithPath, FileMode.Create);
                imageFile.CopyTo(stream);
                stream.Close();
                return new Tuple<int, string>(1, newFileName);
            }
            catch (Exception)
            {
                return new Tuple<int, string>(0, "Error has occured");
            }
        }

        public (int, string) SaveVideo(IFormFile videoFile)
        {
            try
            {
                var contentPath = this._environment.ContentRootPath; 
                var path = Path.Combine(contentPath,"Videos");

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var uniqueFileName = Guid.NewGuid() + Path.GetExtension(videoFile.FileName);
                var fileWithPath = Path.Combine(path, uniqueFileName);

                using (var stream = new FileStream(fileWithPath, FileMode.Create))
                {
                    videoFile.CopyTo(stream);
                }

                var relativePath = Path.Combine("Videos", uniqueFileName).Replace("\\", "/");
                return (1, relativePath); 
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (0, "Error occurred while saving the video.");
            }
        }




        public async Task DeleteImage(string imageFileName)
        {
            var contentPath = this._environment.ContentRootPath;
            var path = Path.Combine(contentPath, $"Uploads", imageFileName);

            if (File.Exists(path))
            {
                await Task.Run(() => File.Delete(path)); 
            }
        }

        public async Task DeleteVideo(string videoFileName)
        {
            try
            {
                var contentPath = _environment.ContentRootPath;
                var filePath = Path.Combine(contentPath, "Videos", videoFileName);

                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath)); 
                }
                else
                {
                    Console.WriteLine("File not found: " + filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting video file: {ex.Message}");
                throw new Exception("Error occurred while deleting the video.");
            }
        }



    }
}

