namespace PlantManager.Api.Model
{
    public class Charge : Entity
    {
        public string Number { get; set; }

        public string BundleNumber { get; set; }

        public string ContainerType { get; set; }

        public string ArticleNumber { get; set; }

        public static string BlueBarrel => nameof(BlueBarrel);

        public static string GreyBarrel => nameof(GreyBarrel);
        
        public static string Ibc => nameof(Ibc);

        public static string AluminumBottle => nameof(AluminumBottle);
    }
}