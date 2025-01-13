namespace neflix.Model
{
    public class Subscription
    {
        public int SubscriptionId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }


        public DateTime DateSubscribed { get; set; }

        public DateTime EndDate => DateSubscribed.AddMonths(2);
    }
}
