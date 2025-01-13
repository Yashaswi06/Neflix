using Microsoft.EntityFrameworkCore;
using neflix.Interface;
using neflix.Model;

namespace neflix
{
    public class UserDBContext : DbContext
    {

        public UserDBContext(DbContextOptions<UserDBContext> options) : base(options) { }

        public DbSet<Register> NetflyUsers { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Favourite> Favorites { get; set; }
        public DbSet<Subscription> subscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // RegisterUser entity configuration
            modelBuilder.Entity<Register>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnType("varchar(255)");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(10)")
                    .HasColumnName("Contact");

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasColumnType("varchar(50)");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.CategoryId);

                entity.Property(c => c.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            // Movie 
            modelBuilder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.MovieId);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);
                    

                entity.Property(e => e.ReleaseYear)
                    .HasMaxLength(4);

                entity.Property(e => e.MovieImage)
                    .HasMaxLength(255);

                entity.Property(e => e.Cast)
                    .HasMaxLength(255);

                entity.Property(e => e.Director)
                    .HasMaxLength(100);

                entity.HasOne<Category>()
                    .WithMany()
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Properties marked as [NotMapped] in the model do not need Fluent API configuration
            });

            // Favourite entity configuration
            modelBuilder.Entity<Favourite>(entity =>
            {
                // Set the primary key
                entity.HasKey(f => f.FavoriteId);

                // Foreign key relationship with Register (User)
                entity.HasOne<Register>()
                      .WithMany()  // No navigation property
                      .HasForeignKey(f => f.UserId)
                      .OnDelete(DeleteBehavior.NoAction);

                // Foreign key relationship with Movie
                entity.HasOne<Movie>()
                      .WithMany()  // No navigation property
                      .HasForeignKey(f => f.MovieId)
                      .OnDelete(DeleteBehavior.NoAction);

                // Optional: Configure table name
                entity.ToTable("Favorites");
            });

            // Subscription entity configuration
            modelBuilder.Entity<Subscription>(entity =>
            {
                // Configure the foreign key relationship
                entity.HasOne<Register>()
                    .WithMany() // A user can have many subscriptions
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade); // Or another delete behavior

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.DateSubscribed)
                    .IsRequired()
                    .HasColumnType("datetime");

            });
            base.OnModelCreating(modelBuilder);
        }


    }
}
