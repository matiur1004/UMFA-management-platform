using System.Xml.Serialization;

namespace ClientPortal.DtOs
{
    [Serializable]
    [XmlRoot(ElementName = "xml", Namespace = "", IsNullable = false)]
    public partial class ScadaMeterProfile
    {
        [XmlElement("result")] public string Result { get; set; }
        [XmlElement("meter")] public Meter Meter { get; set; }
    }

    [Serializable]
    public partial class Meter
    {
        [XmlElement("serial")] public string SerialNumber { get; set; }
        [XmlElement("id")] public string Description { get; set; }
        [XmlArray("profile")]
        [XmlArrayItem("sample")]
        public Sample[] ProfileSamples { get; set; }
    }

    [Serializable]
    public partial class Sample
    {
        [XmlElement("result")] public string Result { get; set; }
        [XmlElement("date")] public string Date { get; set; }
        [XmlElement("kVA")] public string KVA { get; set; }
        [XmlElement("P1")] public string P1 { get; set; }
        [XmlElement("P2")] public string P2 { get; set; }
        [XmlElement("Q1")] public string Q1 { get; set; }
        [XmlElement("Q2")] public string Q2 { get; set; }
        [XmlElement("Q3")] public string Q3 { get; set; }
        [XmlElement("Q4")] public string Q4 { get; set; }
        [XmlElement("STATUS")] public string Status { get; set; }
    }

}
