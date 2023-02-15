using System.Xml.Serialization;

namespace ClientPortal.DtOs
{
    [Serializable]
    [XmlRoot(ElementName = "xml", Namespace = "", IsNullable = false)]
    public partial class ScadaMeterReading
    {
        [XmlElement("result")] public string Result { get; set; }
        [XmlElement("meter")] public ReadingMeter Meter { get; set; }
    }

    [Serializable]
    public partial class ReadingMeter
    {
        [XmlElement("serial")] public string SerialNumber { get; set; }
        [XmlElement("id")] public string Description { get; set; }
        [XmlElement("start_total")] public ReadingTotal StartTotal { get; set; }
        [XmlElement("end_total")] public ReadingTotal EndTotal { get; set; }
        [XmlElement("max_demand")] public MaxDemand MaxDemand { get; set; }
    }

    [Serializable]
    public partial class ReadingTotal
    {
        [XmlElement("result")] public string Result { get; set; }
        [XmlElement("date")] public string ReadingDate { get; set; }
        [XmlElement("P1")] public string P1 { get; set; }
        [XmlElement("P2")] public string P2 { get; set; }
        [XmlElement("Q1")] public string Q1 { get; set; }
        [XmlElement("Q2")] public string Q2 { get; set; }
        [XmlElement("Q3")] public string Q3 { get; set; }
        [XmlElement("Q4")] public string Q4 { get; set; }
        [XmlElement("P1READING")] public string P1Reading { get; set; }
        [XmlElement("Q1READING")] public string Q1Reading { get; set; }
        [XmlElement("STATUS")] public string Status { get; set; }
    }

    [Serializable]
    public partial class MaxDemand
    {
        [XmlElement("result")] public string Result { get; set; }
        [XmlElement("date")] public string MaxDemandDate { get; set; }
        [XmlElement("kVA")] public string kVA { get; set; }
    }
}