namespace neflix.Interface
{
    public interface IFileService
    {
        public Tuple<int, string> SaveImage(IFormFile imageFile);
        public (int, string) SaveVideo(IFormFile videoFile);
        public Task DeleteImage(String imageFileName);
        public Task DeleteVideo(string videoFileName);
    }
}
